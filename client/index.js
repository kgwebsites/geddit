import routes from "./routes.js";
import page from "//unpkg.com/page/page.mjs";

page.configure({ window });

const body = document.querySelector("body");
const app = document.querySelector(".site-main");

function changePage({ filePath, elementName, ctx }) {
  const viewScript = document.createElement("script");
  const currentModuleScript = body.querySelector("#view-module-script");
  const contextScript = document.createElement("script");
  const currentContextScript = document.querySelector("#view-context");
  const { page, ...context } = ctx;

  viewScript.type = "module";
  viewScript.src = `/public/${filePath}`;
  viewScript.id = "view-module-script";

  contextScript.type = "application/json";
  contextScript.id = "view-context";
  contextScript.innerText = JSON.stringify(context);

  const view = document.createElement(elementName);

  if (currentContextScript)
    body.replaceChild(contextScript, currentContextScript);
  else body.appendChild(contextScript);

  if (currentModuleScript) body.replaceChild(viewScript, currentModuleScript);
  else body.appendChild(viewScript);

  if (app.childNodes?.[0]) app.replaceChild(view, app.childNodes[0]);
  else app.appendChild(view);
}

routes.forEach(({ route, filePath, elementName }) => {
  page(route, (ctx) => {
    changePage({ filePath, elementName, ctx });
  });
});

page(location.pathname);
