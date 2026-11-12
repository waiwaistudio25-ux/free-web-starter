const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const files = {'/':['index.html','text/html'], '/style.css':['style.css','text/css'], '/app.js':['app.js','text/javascript'], '/core.mjs':['core.mjs','text/javascript'], '/speedtest.mjs':['speedtest.mjs','text/javascript']};
http.createServer((req,res)=>{
  const url = new URL(req.url,'http://localhost').pathname;
  if(url==='/health'){res.writeHead(200,{'Content-Type':'text/plain'}); return res.end('ok')}
  if(!files[url]){res.writeHead(404);return res.end('Not found')}
  const [file,type]=files[url];
  fs.readFile(path.join(__dirname,file),(err,data)=>{
    if(err){res.writeHead(500);return res.end('Server error')}
    res.writeHead(200,{'Content-Type':type+'; charset=utf-8','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(data);
  });
}).listen(Number(process.env.PORT||3000),'0.0.0.0');

