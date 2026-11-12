const http = require('node:http');
const port = Number(process.env.PORT || 3000);
const page = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>我的网站</title><style>body{margin:0;background:#f3f6fb;color:#19233a;font:16px/1.7 system-ui,sans-serif}main{max-width:720px;margin:12vh auto;padding:36px}small{color:#3863b0;letter-spacing:.1em}h1{font-size:clamp(2.3rem,7vw,4rem);line-height:1.15;margin:.6em 0}p{color:#53617c}a{color:#315bb1}</style></head><body><main><small>HELLO WORLD</small><h1>我的网站，<br>已经上线。</h1><p>这是一个测试页面。以后可以把它替换成你自己的内容或程序。</p></main></body></html>`;
http.createServer((req, res) => {
  if (req.url === '/health') { res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('ok'); }
  if (req.url !== '/') { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Not found'); }
  res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'}); res.end(page);
}).listen(port, '0.0.0.0', () => console.log(`Listening on ${port}`));

