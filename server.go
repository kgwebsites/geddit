package main

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"time"

	"github.com/patrickmn/go-cache"
)

var contentTypes = map[string]string{
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
}

func getTemplateData(r *http.Request) string {
    p := r.URL.Path
    if p == "/" { // home page, load /r/popular
        popularURL := "https://api.reddit.com/r/popular"
    
        client := &http.Client{}
        req, err := http.NewRequest("GET", popularURL, nil)
        req.Header.Add("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")

        resp, err := client.Do(req)

        if err != nil {
            log.Fatalln(err)
        }

        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            log.Fatalln(err)
            return ""
        }
        return string(body)

    }
    return ""
}

func viewHandler(w http.ResponseWriter, r *http.Request) {
    d := getTemplateData(r)
    renderTemplate(w, d)
}

func renderTemplate(w http.ResponseWriter, d string) {
    t := template.Must(template.ParseFiles("client/index.gohtml"))
    err := t.ExecuteTemplate(w, "index.gohtml", d)

    if err != nil {
        fmt.Fprintf(w, "%s", err)
    }
}

func assetHandler(w http.ResponseWriter, r *http.Request){
    filename := r.URL.Path[len("/public/"):]
    fileExt := filepath.Ext(filename)
    body, err := ioutil.ReadFile("client/" + filename)
    if err != nil {
        fmt.Fprintf(w, "%s", err)
    }

    w.Header().Set("Content-Type", contentTypes[fileExt])
    fmt.Fprintf(w, "%s", body)
}

func subredditHandler(w http.ResponseWriter, r *http.Request, c *cache.Cache) {
    subreddit, found := c.Get(r.URL.Path)
	if found {
		w.Header().Set("Content-Type", contentTypes[".json"])
        fmt.Fprintf(w, "%s", subreddit)
        return
	}

    subredditAboutPath := "https://api.reddit.com" + r.URL.Path + "/about"
    
    client := &http.Client{}
    req, err := http.NewRequest("GET", subredditAboutPath, nil)
    req.Header.Add("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1")

    resp, err := client.Do(req)

    if err != nil {
        log.Fatalln(err)
    }

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        log.Fatalln(err)
        fmt.Fprintf(w, "%s", err)
        return
    }

    c.Set(r.URL.Path, body, cache.DefaultExpiration)

    w.Header().Set("Content-Type", contentTypes[".json"])
    fmt.Fprintf(w, "%s", body)
}

func main() {
    // Create a cache with a default expiration time of 24 hours, and which
	// purges expired items every 48 hours
	c := cache.New(24*time.Hour, 48*time.Hour)
    http.HandleFunc("/r/", func(w http.ResponseWriter, r *http.Request) {
        subredditHandler(w, r, c)
    })
    http.HandleFunc("/public/", assetHandler)
    http.HandleFunc("/", viewHandler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}