const http = require("http")
const server = http.createServer((req,res)=>{
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    if (req.url === "/"){
        res.write("Đây là trang chủ")
    }else if(req.url === "/about"){
        res.write("Đây là trang giới thiệu")
    }else if(req.url === "/contact"){
        res.write("Đây là trang liên hệ")
    }else if(req.url === "/tin-tuc"){
        const myURL= new URL(req.url,"http://localhost:3000")
        let id= myURL.searchParams.get("id")
        res.write("Đây là trang tin tức")
        res.write("Bạn đang xem tin số"+ id)
    }else{
        res.write("Không tìm thấy nội dung phù hợp")
    }
    res.end()
})
server.listen(3000)
console.log("Server is running on http://localhost:3000")