const http = require("http") 
const querystring = require("querystring") 
 
const server = http.createServer((req, res) => { 
  res.writeHead(200,{"content-type":"text/html; charset=utf-8"}) 
 
  if (req.url === "/" && req.method === "POST") { 
 
    let body = ""     
    req.on("data", chunk => {       body += chunk.toString() 
    })  
    req.on("end", () => { 
      const formData = querystring.parse(body)       
      const username = formData.username       
      res.end("Xin chao " + username) 
    }) 
  }    else {      
    res.write(`     <html> 
        <body>     
           <form method="POST"> 
              <input type="text" name="username" /> 
              <button>Dang nhap</button> 
           </form> 
        </body> 
    </html> 
 
  `) 
} 
})  
server.listen(3000) 
