import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = "Hello World!"
   })

  .get("/room/e319", (ctx) => {
    ctx.response.body = `
        <html>
            <body>
            <h1>OO教室</h1>
            </body>
        </html>
        `
   })

  .get("/room/e320", (ctx) => {
    ctx.response.body = `
        <html>
            <body>
            <h1>嵌入式教室</h1>
            </body>
        </html>
        `
   })

  .get("/room/e321", (ctx) => {
    ctx.response.body = `
        <html>
            <body>
            <h1>多媒體教室</h1>
            </body>
        </html>
        `
   })

  .get("/room/e322", (ctx) => {
    ctx.response.body = `
        <html>
            <body>
            <h1>XX教室</h1>
            </body>
        </html>
        `
   })

  .get("/ngu", (ctx) => {
    ctx.response.body = `
        <html>
            <body>
            <h1>金門大學</h1>
            <a href="https://www.nqu.edu.tw/">NGU</a>
            </body>
        </html>`
   })

  .get("/ngu/csie", (ctx) => { 
    ctx.response.body = `
        <html>
            <body>
            <h1>金門大學資工學系</h1>
            <a href="https://csie.nqu.edu.tw/">金門大學資工學系</a>
            </body>
        </html>`
   })

  .get("to/ngu", (ctx) => {
    ctx.response.redirect('https://www.nqu.edu.tw/');
   })

  .get("to/ngu/csie", (ctx) => { 
    ctx.response.redirect('https://csie.nqu.edu.tw/');
   });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });