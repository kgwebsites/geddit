import routes from "./routes.js";
import page from "//unpkg.com/page/page.mjs";

page.configure({ window });

const body = document.querySelector("body");
const app = document.querySelector(".site-main");

function changePage({ filePath, elementName }) {
  const viewScript = document.createElement("script");
  const currentModuleScript = body.querySelector("#view-module-script");

  viewScript.type = "module";
  viewScript.src = `/public/${filePath}`;
  viewScript.id = "view-module-script";

  const view = document.createElement(elementName);

  if (currentModuleScript) body.replaceChild(viewScript, currentModuleScript);
  else body.appendChild(viewScript);

  if (app.childNodes?.[0]) app.replaceChild(view, app.childNodes[0]);
  else app.appendChild(view);
}

routes.forEach(({ route, filePath, elementName }) => {
  page(route, () => {
    changePage({ filePath, elementName });
  });
});

page(location.pathname);
