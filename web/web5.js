const http = require("http") 
 
const server = http.createServer((req, res) => { 
  res.writeHead(200,{"content-type":"text/html; charset=utf-8"})   
  res.write(` 
    <html> 
        <body>     
           <form method="POST"> 
              <input type="text" name="username" /> 
              <button>Dang nhap</button> 
           </form> 
        </body> 
    </html> 
 
  `)  
  res.end() 
 
})  
server.listen(3000) 
