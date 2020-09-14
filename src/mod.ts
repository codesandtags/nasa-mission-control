import { log, Application, send } from "./deps.ts";

import api from "./api.ts";

const app = new Application();
const PORT = 8000;

app.use(api.routes());
app.use(api.allowedMethods());

/**
 * Send public files
 */
app.use(async (ctx) => {
  const PUBLIC = "/public";
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [
    "/index.html",
    "/javascripts/script.js",
    "/stylesheets/style.css",
    "/images/favicon.png",
  ];

  if (fileWhitelist.includes(filePath)) {
    await send(ctx, filePath, {
      root: `${Deno.cwd()}${PUBLIC}`,
    });
  }
});

app.listen({
  port: PORT,
});
