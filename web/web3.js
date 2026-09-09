const http = require("http") 
 
const server = http.createServer((req, res) => { 
 
  const myURL = new URL(req.url, "http://localhost:3000") 
 
  const id = myURL.searchParams.get("id") 
 
  res.end("Ban dang xem bai viet so " + id) 
 
})  
server.listen(3000) 
