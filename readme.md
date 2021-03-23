# Geddit

A reddit clone using a Go webserver, and Reddit's api for data.
On the front end we are using javascript modules (with some help from lit-element) for creating web components requiring no FE build tools or compilers. This just works out of the box (in modern browsers).

To start up your server, open your terminal and build the `server` executable by running `go build server.go`.
Then run `./server` (mac/linux) or `./server.exe` (windows).
Open your (modern) browser and head over to http://localhost:8080.

Any changes to the `server.go` file will require a rebuild and launch, but any changes to any of the client side (js / css / index.gohtml) will appear on refresh on the page.

TODO:

- ~~Subreddits other than /r/popular~~
- Individual post pages with comments
- User Auth
- Create Post
- Add comment
- Edit comment
- Delete comment
