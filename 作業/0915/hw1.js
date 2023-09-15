import { Application, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use(async (ctx) => {
    if(ctx.request.url.pathname == '/ngu/csie'){
        ctx.response.body = `
        <html>
            <body>
            <h1>金門大學資工學系</h1>
            <a href="https://csie.nqu.edu.tw/">金門大學資工學系</a>
            </body>
        </html>`
    }else if(ctx.request.url.pathname == '/to/ngu'){
        ctx.response.redirect('https://www.nqu.edu.tw/');
    }else if(ctx.request.url.pathname == '/to/ngu/csie'){
        ctx.response.redirect('https://csie.nqu.edu.tw/');
    }else if(ctx.request.url.pathname == '/ngu'){
        ctx.response.body = `
        <html>
            <body>
            <h1>金門大學</h1>
            <a href="https://www.nqu.edu.tw/">NGU</a>
            </body>
        </html>`
    }else{
        ctx.response.body = `
        <html>
            <body>
            <h1>404</h1>
            <p>請在127.0.0.1:8000後面加入/ngu、/nug/csie、/to/ngu或/to/nug/csie
            </body>
        </html>
        `
    }

    
});


console.log('start at : http://127.0.0.1:8000')
console.log('cwd=', Deno.cwd())
await app.listen({ port: 8000 });
