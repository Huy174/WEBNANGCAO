const http = require("http") 
 
const server = http.createServer((req, res) => { 
 
  if (req.url.startsWith("/news/")) { 
 
    const parts = req.url.split("/") 
 
    const id = parts[2] 
 
    res.end("Ban dang xem bai viet so " + id)  
  } 
 
})  
server.listen(3000) 
