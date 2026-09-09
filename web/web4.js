const http = require("http") 
 const server = http.createServer((req, res) => { 
 
  const myURL = new URL(req.url, "http://localhost:3000") 
 
  const keyword = myURL.searchParams.get("keyword")   
  res.writeHead(200,{"content-type":"text/html; charset=utf-8"})   
  res.write(` 
    <html> 
        <body>     
            <form method = "GET"> 
                <input type="text" name = "keyword"/> 
                <button>Tim kiem </button> 
            </form> 
        </body> 
    </html> 
  `)  
  if (keyword) { 
    res.write("<h1>Ket qua tim kiem: " + keyword + "</h1>") 
  }  
  res.end() 
 
})  
server.listen(3000) 
