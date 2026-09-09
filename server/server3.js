const http= require("http")
const server= http.createServer((req,res)=>{
    if(req.url === "/"){
        res.write("Trang chủ")
    }else if(req.url === "/about"){
        res.write("Trang giới thiệu")
    }else if(req.url === "/contact"){
        res.write("Trang liên hệ")
    }
    res.end()
})
server.listen(3000)
console.log("Server đang chạy............")