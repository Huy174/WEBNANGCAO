const http= require("http")
const server= http.createServer((req,res)=>{
    console.log(req.method)
    res.end("OK")
})
server.listen(3000)
console.log("Server đang chạy.....")