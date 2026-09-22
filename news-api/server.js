const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const querystring = require("querystring");
const db = require("./config/db");

const sessions = {};

function parseCookies(req) {
    const cookieHeader = req.headers.cookie;
    const cookies = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(";").forEach(cookie => {
        const parts = cookie.split("=");
        const key = parts[0].trim();
        const value = parts[1];
        cookies[key] = value;
    });
    return cookies;
}

function getCurrentUser(req) {
    const cookies = parseCookies(req);
    const sessionId = cookies.sessionId;
    if (!sessionId) return null;
    return sessions[sessionId] || null;
}

const server = http.createServer((req, res) => {
    // 1. Route /logout
    if (req.url === "/logout" && req.method === "GET") {
        const cookies = parseCookies(req);
        const sessionId = cookies.sessionId;
        if (sessionId) {
            delete sessions[sessionId];
        }
        res.writeHead(302, {
            "Set-Cookie": "sessionId=; Max-Age=0; Path=/",
            Location: "/login"
        });
        return res.end();
    }

    // 2. Route /delete
    if (req.url.startsWith("/delete") && req.method === "GET") {
        const user = getCurrentUser(req);
        if (!user) {
            res.writeHead(302, { Location: "/login" });
            return res.end();
        }

        const myURL = new URL(req.url, "http://localhost:3000");
        const id = myURL.searchParams.get("id");

        db.query("DELETE FROM posts WHERE id = ?", [id]).then(() => {
            res.writeHead(302, { Location: "/news" });
            res.end();
        });
        return;
    }

    // 3. Khai báo đường dẫn file view
    let filePath = "";
    if (req.url === "/") {
        filePath = path.join(__dirname, "views", "home.html");
    } else if (req.url === "/about") {
        filePath = path.join(__dirname, "views", "about.html");
    } else if (req.url === "/contact") {
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
        filePath = path.join(__dirname, "views", "register.ejs");
    } else if (req.url === "/profile") {
        filePath = path.join(__dirname, "views", "profile.ejs");
    } else {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        return res.end("<h1>404 - Không tìm thấy trang</h1>");
    }

    // Đọc file giao diện
    fs.readFile(filePath, "utf8", async (err, data) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
            return res.end("<h1>Lỗi server</h1>");
        }

        // 4. Route /create GET
        if (req.url === "/create" && req.method === "GET") {
            const user = getCurrentUser(req);
            if (!user) {
                res.writeHead(302, { Location: "/login" });
                return res.end();
            }
            const html = ejs.render(data, {});
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            return res.end(html);
        }

        // 5. Route /profile
        if (req.url === "/profile" && req.method === "GET") {
            const user = getCurrentUser(req);
            if (!user) {
                res.writeHead(302, { Location: "/login" });
                return res.end();
            }
            const html = ejs.render(data, { user: user });
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            return res.end(html);
        }

        // 6. Route /create POST
        if (req.url === "/create" && req.method === "POST") {
            const user = getCurrentUser(req);
            if (!user) {
                res.writeHead(302, { Location: "/login" });
                return res.end();
            }

            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", async () => {
                const formData = querystring.parse(body);
                await db.query(
                    "INSERT INTO posts(title, description) VALUES (?, ?)",
                    [formData.title, formData.description]
                );
                res.writeHead(302, { Location: "/news" });
                res.end();
            });
            return;
        }

        // 7. Route /edit GET
        if (req.url.startsWith("/edit") && req.method === "GET") {
            const user = getCurrentUser(req);
            if (!user) {
                res.writeHead(302, { Location: "/login" });
                return res.end();
            }

            const myURL = new URL(req.url, "http://localhost:3000");
            const id = myURL.searchParams.get("id");
            const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
            const post = rows.length > 0 ? rows[0] : null;

            const html = ejs.render(data, { post: post });
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            return res.end(html);
        }

        // 8. Route /edit POST
        if (req.url === "/edit" && req.method === "POST") {
            const user = getCurrentUser(req);
            if (!user) {
                res.writeHead(302, { Location: "/login" });
                return res.end();
            }

            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", async () => {
                const formData = querystring.parse(body);
                await db.query(
                    "UPDATE posts SET title = ?, description = ? WHERE id = ?",
                    [formData.title, formData.description, formData.id]
                );
                res.writeHead(302, { Location: "/news/" + formData.id });
                res.end();
            });
            return;
        }

        // 9. Route /register
        if (req.url === "/register" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", async () => {
                const formData = querystring.parse(body);
                const { fullname, username, password } = formData;

                if (!username || !password) {
                    const html = ejs.render(data, { message: "Vui lòng nhập username và password" });
                    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                    return res.end(html);
                }

                const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
                if (users.length > 0) {
                    const html = ejs.render(data, { message: "Username đã tồn tại" });
                    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                    return res.end(html);
                }

                await db.query("INSERT INTO users(username, password, fullname) VALUES (?, ?, ?)", [username, password, fullname]);
                res.writeHead(302, { Location: "/login" });
                res.end();
            });
            return;
        } else if (req.url === "/register" && req.method === "GET") {
            const html = ejs.render(data, { message: "Vui lòng nhập đầy đủ thông tin để tạo tài khoản" });
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            return res.end(html);
        }

        // 10. Route /search
        if (req.url.startsWith("/search") && req.method === "GET") {
            const myURL = new URL(req.url, "http://localhost:3000");
            const keyword = myURL.searchParams.get("keyword") || "";
            const [newsList] = await db.query(
                "SELECT * FROM posts WHERE title LIKE ? OR description LIKE ?",
                [`%${keyword}%`, `%${keyword}%`]
            );
            const html = ejs.render(data, { keyword: keyword, newsList: newsList });
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            return res.end(html);
        }

        // 11. Route /news
        if (req.url.startsWith("/news") && req.method === "GET") {
            const pathParts = req.url.split("/");
            const id = pathParts[2];
            const user = getCurrentUser(req);
            let html = "";

            if (id) {
                const [newsList] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
                html = ejs.render(data, { id: id, newsList: newsList, user: user });
            } else {
                const [newsList] = await db.query("SELECT * FROM posts ORDER BY id DESC LIMIT 10");
                html = ejs.render(data, { id: "", newsList: newsList, user: user });
            }
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            return res.end(html);
        }

        // 12. Route /login POST
        if (req.url === "/login" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk.toString(); });
            req.on("end", async () => {
                const formData = querystring.parse(body);
                const { username, password } = formData;

                const [users] = await db.query(
                    "SELECT * FROM users WHERE username = ? AND password = ?",
                    [username, password]
                );

                if (users.length === 0) {
                    const html = ejs.render(data, { message: "Sai tên đăng nhập hoặc mật khẩu" });
                    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                    return res.end(html);
                }

                const user = users[0];
                const sessionId = crypto.randomBytes(16).toString("hex");
                sessions[sessionId] = {
                    userId: user.id,
                    username: user.username,
                    fullname: user.fullname
                };

                res.writeHead(302, {
                    "Set-Cookie": `sessionId=${sessionId}; HttpOnly; Path=/`,
                    Location: "/profile"
                });
                res.end();
            });
            return;
        }

        // 13. Route /login GET
        if (req.url === "/login" && req.method === "GET") {
            const html = ejs.render(data, {
                message: "Vui lòng nhập username và password để đăng nhập",
                islogin: false,
                username: ""
            });
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            return res.end(html);
        }

        // Mặc định trả về HTML tĩnh (home.html, about.html, contact.html)
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
    });
});

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});