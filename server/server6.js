const http = require("http") 
 const server = http.createServer((req, res) => {   
    res.writeHead(404)   
    res.end("404 Not Found") 
})  
server.listen(3000)
