export default [
  {
    route: "/",
    filePath: "./src/views/home.view.js",
    elementName: "geddit-view-home",
  },
  {
    route: "/r/:subreddit",
    filePath: "./src/views/subreddit.view.js",
    elementName: "geddit-view-subreddit",
  },
  {
    route: "/post/:postId",
    filePath: "./src/views/post.view.js",
    elementName: "geddit-view-post",
  },
];

// Dynamically import view file based on filePath in route configuration above
// Dynamic imports must have the route STATICALLY typed out,
// So we can't just pull the import route as a variable from the routing config unfortunately.
export const importView = async (elementName) => {
  switch (elementName) {
    case "geddit-view-home":
      await import("./src/views/home.view.js");
      break;
    case "geddit-view-subreddit":
      await import("./src/views/subreddit.view.js");
      break;
    case "geddit-view-post":
      await import("./src/views/post.view.js");
      break;
    default:
      // 404 fallback
      await import("./src/views/home.view.js");
  }
};
