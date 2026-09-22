const http = require("http");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const querystring = require("querystring");
const db = require("./config/db");

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