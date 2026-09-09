const http = require("http")
const server = http.createServer((req, res)=>{
    if(req.url === "/"){
        res.write("Trang chu")
    }else{
        res.write("404 Not Found")
    }
    res.end()
})
server.listen(3000)