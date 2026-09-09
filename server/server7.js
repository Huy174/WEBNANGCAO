const http = require("http") 
 const server = http.createServer((req, res) => {   
    res.writeHead(200, { 
        "Content-Type": "text/html; charset=utf-8" 
  })   
    res.end("<h1>Xin chao NodeJS</h1>") 
})  
server.listen(3000) 
