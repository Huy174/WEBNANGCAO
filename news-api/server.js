const http = require("http");
const crypto = require("crypto")
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const querystring = require("querystring");
const db = require("./config/db");
const sessions = {}

function parseCookies(req) {
    const cookieHeader = req.headers.cookie
    const cookies = {}
    if (!cookieHeader) {
    return cookies
 }
    cookieHeader.split(";").forEach(cookie => {
    const parts = cookie.split("=")
    const key = parts[0].trim()
    const value = parts[1]
    cookies[key] = value
 })
    return cookies
}
function getCurrentUser(req) {
    const cookies = parseCookies(req)
    const sessionId = cookies.sessionId
    if (!sessionId) {
    return null
    }
    const session = sessions[sessionId]
    if (!session) {
    return null
 }
    return session
}

const server = http.createServer((req, res) => {
    if (req.url.startsWith("/delete") && req.method === "GET") {
        const myURL = new URL(req.url, "http://localhost:3000");
        const id = myURL.searchParams.get("id");

        db.query(
            "DELETE FROM posts WHERE id = ?",
            [id]
        ).then(() => {
        res.writeHead(302, {
            Location: "/news"
    });
        res.end();
  });
        return;
}
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
    } else if (req.url === "/create") {
        filePath = path.join(__dirname, "views", "create.ejs");
    } else if (req.url.startsWith("/edit")) {
        filePath = path.join(__dirname, "views", "edit.ejs");
    } else if (req.url === "/register") {
        filePath = path.join(__dirname, "views", "register.ejs")    
    } else {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>404 - Không tìm thấy trang</h1>");
        return;
    }

    fs.readFile(filePath, "utf8", async (err, data) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
            res.end("<h1>Lỗi server</h1>");
            return;
        }
        if (req.url === "/create" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
            req.on("end", async () => {
                const formData = querystring.parse(body);
                await db.query(
                    "INSERT INTO posts(title, description) VALUES (?, ?)",
                    [formData.title, formData.description]
                    );
            res.writeHead(302, {
                Location: "/news"
            });
             res.end();
  });
            return;
}
        if (req.url.startsWith("/edit") && req.method === "GET") {
            const myURL = new URL(req.url, "http://localhost:3000");
            const id = myURL.searchParams.get("id");

            const [rows] = await db.query(
                "SELECT * FROM posts WHERE id = ?",
                [id]
            );

            const post = rows.length > 0 ? rows[0] : null;

            data = ejs.render(data, {post: post});

            res.end(data);
            return;
}
        if (req.url === "/edit" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
            body += chunk.toString();
        });
            req.on("end", async () => {
            const formData = querystring.parse(body);
            await db.query(
                "UPDATE posts SET title = ?, description = ? WHERE id = ?",
                [formData.title, formData.description, formData.id]
    );
            res.writeHead(302, {
                Location: "/news/" + formData.id
    });
            res.end();
  });
            return;
}
        if (req.url === "/register" && req.method === "POST") {
            let body = ""
            req.on("data", chunk => {
                body += chunk.toString()
 })
            req.on("end", async () => {
                const formData = querystring.parse(body)
                const fullname = formData.fullname
                const username = formData.username
                const password = formData.password
        if (!username || !password) {
                const html = ejs.render(data, {message: "Vui lòng nhập username và password"
 })
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"
 })
            res.end(html)
            return
 }
                const [users] = await db.query(
                    "SELECT * FROM users WHERE username = ?",
                    [username]
 )
        if (users.length > 0) {
            const html = ejs.render(data, {
            message: "Username đã tồn tại"
 })
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"
 })
            res.end(html)
            return
 }
    await db.query("INSERT INTO users(username, password,fullname) VALUES (?, ?, ?)",[username, password, fullname])
    res.writeHead(302, {
    Location: "/login"
 })
    res.end()
 })
    return
}else if(req.url === "/register"){
    data = ejs.render(data, {message: "Vui lòng nhập đầy đủ thông tin để tạo tài khoản"
 })
}


        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

        // Route /search
        if (req.url.startsWith("/search") && req.method === "GET") {
            const myURL = new URL(req.url, "http://localhost:3000");
            const keyword = myURL.searchParams.get("keyword") || "";
            const [newsList] = await db.query("select * from posts where title like ? or description like ?",
            [`%${keyword}%`, `%${keyword}%`])
            data = ejs.render(data, { keyword: keyword, newsList:newsList });
            return res.end(data);
        }

        // Route /news
        if (req.url.startsWith("/news")) {
            const pathParts = req.url.split("/");
            const id = pathParts[2];
            if(id){
                const [newsList] = await db.query("select * from posts where id = ?",[id])
                data = ejs.render(data, {id: id, newsList:newsList})
            }else{
                const [newsList] = await db.query("select * from posts order by id desc limit 10")
                data = ejs.render(data, { id: "", newsList: newsList})
}  
            return res.end(data);
        }
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"
});
        // Route /login (POST)
        if (req.url === "/login" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", async () => {
                const formData = querystring.parse(body);
                const username = formData.username;
                const password = formData.password;
                const [users] = await db.query(
                    "SELECT * FROM users WHERE username = ? AND password = ?",
                    [username, password]
                )
                if (users.length === 0) {
                    data = ejs.render(data, { message: "Sai tên đăng nhập hoặc mật khẩu" });
                    res.end(data);
                    return;
                }
                const user = users[0]
                const sessionId = crypto.randomBytes(16).toString("hex")
                sessions[sessionId] ={
                    userId: user.id,
                    username: user.username,
                    fullname: user.fullname
                }
                res.writeHead(302, {
                    "Set-Cookie": `sessionId=${sessionId}; HttpOnly; Path=/`,
                    Location: "/profile"
                });
                res.end();
            });
                return     
        }}else if(req.url === "/login"){
            data = ejs.render(data, {
            message: "Vui lòng nhập username và password để đăng nhập"
    })
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