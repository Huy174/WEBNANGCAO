const http = require("http")
const server=http.createServer((req,res)=>{
    
    res.write("Hello NodeJS")
    res.end()
})
server.listen(3000)