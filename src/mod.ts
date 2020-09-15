import { log, Application, send } from "./deps.ts";

import api from "./api.ts";

const app = new Application();
const PORT = 8000;

app.use(api.routes());
app.use(api.allowedMethods());

/**
 * Logging setup
 */
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    },
  },
});

app.addEventListener("error", (event) => {
  log.error(event.error);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.body = "Internal server error";
    throw err;
  }
});

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

if (import.meta.main) {
  log.info(`Starting server on port ${PORT}...`);
  await app.listen({
    port: PORT,
  });
}
