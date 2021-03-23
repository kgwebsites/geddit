export default [
  {
    route: "/",
    filePath: "views/home.view.js",
    elementName: "geddit-view-home",
  },
  {
    route: "/r/:subreddit",
    filePath: "views/subreddit.view.js",
    elementName: "geddit-view-subreddit",
  },
  {
    route: "/post/:postId",
    filePath: "views/post.view.js",
    elementName: "geddit-view-post",
  },
];
