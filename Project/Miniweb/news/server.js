const http = require("http");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
    let filePath = "";

    // 1. Khai báo các đường dẫn
    if (req.url === "/") {
        filePath = path.join(__dirname, "views", "home.html");
    } else if (req.url === "/about") {
        filePath = path.join(__dirname, "views", "about.html");
    } else if (req.url === "/contact") { // Yêu cầu 1: Thêm trang /contact
        filePath = path.join(__dirname, "views", "contact.html");
    } else if (req.url.startsWith("/news")) {
        filePath = path.join(__dirname, "views", "news.ejs");
    } else if (req.url.startsWith("/search")) {
        filePath = path.join(__dirname, "views", "search.ejs");
    } else if (req.url === "/login") {
        filePath = path.join(__dirname, "views", "login.ejs");
    } else {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>404 - Không tìm thấy trang</h1>");
        return;
    }

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
            res.end("<h1>Lỗi server</h1>");
            return;
        }

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

        // Route /search
        if (req.url.startsWith("/search") && req.method === "GET") {
            const myURL = new URL(req.url, "http://localhost:3000");
            const keyword = myURL.searchParams.get("keyword") || "";
            data = ejs.render(data, { keyword: keyword });
            return res.end(data);
        }

        // Route /news
        if (req.url.startsWith("/news")) {
            const pathParts = req.url.split("/");
            const id = pathParts[2];

            // Yêu cầu 2 & 3: Thêm bài viết thứ 4 và bổ sung các trường author, createdAt
            const newsList = [
                { id: 1, title: "Nodejs", description: "Lập trình backend với Node.js", author: "Nguyễn Văn A", createdAt: "2026-09-01" },
                { id: 2, title: "Web động", description: "Trả về dữ liệu tương ứng với request", author: "Trần Thị B", createdAt: "2026-09-03" },
                { id: 3, title: "React", description: "Lập trình frontend với React.js", author: "Lê Văn C", createdAt: "2026-09-05" },
                { id: 4, title: "EJS Template", description: "Render HTML động phía máy chủ", author: "Phạm Văn D", createdAt: "2026-09-08" }
            ];

            if (id) {
                const selectedNews = newsList.find(item => item.id == id);
                data = ejs.render(data, { 
                    id: id, 
                    newsList: selectedNews ? [selectedNews] : [] 
                });
            } else {
                data = ejs.render(data, { id: "", newsList: newsList });
            }
            return res.end(data);
        }

        // Route /login (POST)
        if (req.url === "/login" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", () => {
                const formData = querystring.parse(body);
                const username = formData.username || "";
                let islogin = Boolean(username);
                data = ejs.render(data, { islogin: islogin, username: username });
                res.end(data);
            });
            return;
        }

        // Route /login (GET)
        if (req.url === "/login" && req.method === "GET") {
            data = ejs.render(data, { islogin: false, username: "" });
            return res.end(data);
        }

        // Trả về HTML tĩnh (home, about, contact)
        res.end(data);
    });
});

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});