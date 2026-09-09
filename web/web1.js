const http = require("http") 
 
const server = http.createServer((req, res) => { 
 
  if (req.url === "/") { 
 
    res.writeHead(200) 
 
    res.write("Trang chu") 
 
  }  
  else if (req.url === "/about") { 
 
    res.writeHead(200) 
 
    res.write("Trang gioi thieu") 
 
  }    else if (req.url === "/contact") { 
 
    res.writeHead(200) 
 
    res.write("Trang lien he") 
 
  }    else {      res.writeHead(404) 
     res.write("Khong tim thay trang") 
 
  }    res.end() 
 
})  
server.listen(3000) 
