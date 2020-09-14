import { Application } from "https://deno.land/x/oak@v6.1.0/mod.ts";

const app = new Application();
const PORT = 8000;

app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} ${time}`);
  console.log("With Async");
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const delta = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${delta}ms`);
  console.log(` Response time ${delta}ms`);
});

app.use(async (ctx) => {
  ctx.response.body = "This is sparta :D!!!";
  console.log("With message");
});

app.listen({
  port: PORT,
});
