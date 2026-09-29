const express = require("express");
const path = require("path");
const session = require("express-session");
const db = require("./config/db");

const app = express();
const port = 3000;

// Cấu hình View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware đọc dữ liệu từ Form
app.use(express.urlencoded({ extended: true }));

// Middleware Logger
function logger(req, res, next) {   
    console.log(req.method, req.url);   
    next(); 
}  
app.use(logger);

// Cấu hình Session
app.use(session({  
    secret: "mysecretkey",  
    resave: false,  
    saveUninitialized: false  
}));

// Middleware truyền thông tin user sang giao diện EJS
app.use((req, res, next) => { 
    res.locals.user = req.session.user || null;   
    next(); 
});

// ================= 2. THÊM MIDDLEWARE XÁC THỰC =================
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

// ================= ROUTE XÁC THỰC (ĐĂNG NHẬP / ĐĂNG XUẤT) =================

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const [users] = await db.query(
            "SELECT * FROM users WHERE username = ? AND password = ?", 
            [username, password] 
        );
        if (users.length === 0) {
            return res.render("login", { error: "Sai username hoặc password" });
        } 
        req.session.user = { username: username };
        return res.redirect("/news");
    } catch (error) {
        console.error(error);
        res.send("Lỗi khi đăng nhập");
    }
});

app.get("/logout", (req, res) => {   
    req.session.destroy(() => {     
        res.redirect("/"); 
    }); 
}); 

// ================= ROUTE TIN TỨC (CÓ BẢO VỆ) =================

// 1. Xem danh sách bài viết (Công khai - Ai cũng xem được)
app.get("/news", async (req, res) => {
    try {
        const [posts] = await db.query("SELECT * FROM posts ORDER BY id DESC");
        res.render("news-list", { posts });
    } catch (error) {
        console.error(error);
        res.send("Lỗi khi lấy danh sách bài viết");
    }
});

// 2. Tìm kiếm bài viết (Công khai - Đặt trước các route có param :id)
app.get("/news/search", async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const [posts] = await db.query(
            "SELECT * FROM posts WHERE title LIKE ? OR description LIKE ? ORDER BY id DESC", 
            [`%${keyword}%`, `%${keyword}%`]
        );
        res.render("news-list", { posts });
    } catch (error) {
        console.error(error);
        res.send("Lỗi khi tìm kiếm bài viết");    
    }
});

// ================= 3. SỬ DỤNG MIDDLEWARE ĐỂ BẢO VỆ =================

// Thêm bài viết (Yêu cầu đăng nhập)
app.get("/news/add", requireLogin, (req, res) => {
    res.render("add-post");
});

app.post("/news/add", requireLogin, async (req, res) => {   
    try {
        const title = req.body.title;
        const description = req.body.description;
        await db.query(
            "INSERT INTO posts(title, description) VALUES (?, ?)",
            [title, description]
        );
        res.redirect("/news");
    } catch (error) {
        console.error(error);
        res.send("Lỗi khi thêm bài viết");
    }
});

// Sửa bài viết (Yêu cầu đăng nhập)
app.get("/news/:id/edit", requireLogin, async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).send("Không tìm thấy bài viết");
        }
        res.render("edit-post", { post: rows[0] });
    } catch (error) {
        console.error(error);
        res.send("Lỗi khi chỉnh sửa bài viết");
    }
});

app.post("/news/:id/edit", requireLogin, async (req, res) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        const description = req.body.description;
        await db.query(
            "UPDATE posts SET title = ?, description = ? WHERE id = ?",
            [title, description, id]
        );
        res.redirect("/news");
    } catch (error) {
        console.error(error);
        res.send("Lỗi khi cập nhật bài viết");
    }
});

// Xóa bài viết (Yêu cầu đăng nhập)
app.post("/news/:id/delete", requireLogin, async (req, res) => {
    try {
        const id = req.params.id;
        await db.query("DELETE FROM posts WHERE id = ?", [id]);
        res.redirect("/news");
    } catch (error) {
        console.error(error);
        res.send("Lỗi khi xóa bài viết");
    }
});

// 4. Chi tiết bài viết (Công khai - Đặt ở đáy cùng)
app.get("/news/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).send("Không tìm thấy bài viết");
        }
        res.render("news-detail", { post: rows[0] });
    } catch (error) {
        console.error(error);
        res.send("Lỗi khi xem chi tiết bài viết");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});