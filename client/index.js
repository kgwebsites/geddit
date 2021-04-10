import page from "page";
import routes, { importView } from "./routes.js";

page.configure({ window });

const body = document.querySelector("body");
const app = document.querySelector(".site-main");

async function changePage({ filePath, elementName, ctx }) {
  const contextScript = document.createElement("script");
  const currentContextScript = document.querySelector("#view-context");
  const { page, ...context } = ctx;

  contextScript.type = "application/json";
  contextScript.id = "view-context";
  contextScript.innerText = JSON.stringify(context);

  importView(elementName);

  const view = document.createElement(elementName);

  if (currentContextScript)
    body.replaceChild(contextScript, currentContextScript);
  else body.appendChild(contextScript);

  if (app.childNodes?.[0]) app.replaceChild(view, app.childNodes[0]);
  else app.appendChild(view);
}

routes.forEach(({ route, filePath, elementName }) => {
  page(route, (ctx) => {
    changePage({ filePath, elementName, ctx });
  });
});

page(location.pathname);
