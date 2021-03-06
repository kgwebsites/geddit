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

type TemplateData struct {
    Data string
    Theme string
}

func fetchData(url string, userAgent string) ([]byte, error) {
    client := &http.Client{}
    req, err := http.NewRequest("GET", url, nil)
    req.Header.Add("User-Agent", userAgent)

    resp, err := client.Do(req)

    if err != nil {
        log.Fatalln(err)
    }

    return ioutil.ReadAll(resp.Body)
}

func getTemplateData(r *http.Request, c *cache.Cache) TemplateData {
    p := r.URL.Path
    d := TemplateData{ Data: "", Theme: "" }

    templateData, found := c.Get(p)
    data, ok := templateData.(string);

    if found && ok {
        d.Data = data
    } else {
        url := "https://api.reddit.com" + p
        if p == "/" { // home page, load /r/popular
            url = "https://api.reddit.com/r/popular"
        }
        body, err := fetchData(url, r.Header["User-Agent"][0])
        
        if err != nil {
            log.Fatalln(err)
        } else {
            d.Data = string(body)
            c.Set(p, string(body), cache.DefaultExpiration)
        }
    }

    t, err := r.Cookie("geddit-theme")

    if err == nil {
        d.Theme = t.Value
    }

    return d
}

func viewHandler(w http.ResponseWriter, r *http.Request, c *cache.Cache) {
    d := getTemplateData(r, c)
    renderTemplate(w, d)
}

func renderTemplate(w http.ResponseWriter, d TemplateData) {
    t := template.Must(template.ParseFiles("./index.gohtml"))
    err := t.ExecuteTemplate(w, "index.gohtml", d)

    if err != nil {
        fmt.Fprintf(w, "%s", err)
    }
}

func assetHandler(w http.ResponseWriter, r *http.Request){
    filename := r.URL.Path[len("/static/"):]
    fileExt := filepath.Ext(filename)
    body, err := ioutil.ReadFile("static/" + filename)
    if err != nil {
        fmt.Fprintf(w, "%s", err)
    }

    w.Header().Set("Content-Type", contentTypes[fileExt])
    fmt.Fprintf(w, "%s", body)
}

func subredditHandler(w http.ResponseWriter, r *http.Request, c *cache.Cache) {
    subredditPath := r.URL.Path[len("/about/"):]
    subreddit, found := c.Get(subredditPath)
	if found {
		w.Header().Set("Content-Type", contentTypes[".json"])
        fmt.Fprintf(w, "%s", subreddit)
        return
	}

    subredditAboutPath := "https://api.reddit.com/" + subredditPath + "/about"
    
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
	subredditCache := cache.New(24*time.Hour, 48*time.Hour)
    http.HandleFunc("/about/r/", func(w http.ResponseWriter, r *http.Request) {
        subredditHandler(w, r, subredditCache)
    })
    http.HandleFunc("/static/", assetHandler)

    viewCache := cache.New(5*time.Minute, 10*time.Minute)
    http.HandleFunc("/r/", func(w http.ResponseWriter, r *http.Request) {
        viewHandler(w, r, viewCache)
    })
    http.HandleFunc("/post/", func(w http.ResponseWriter, r *http.Request) {
        viewHandler(w, r, viewCache)
    })
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        viewHandler(w, r, viewCache)
    })

    log.Fatal(http.ListenAndServe(":8080", nil))
}