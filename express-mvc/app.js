const express = require("express");
const path = require("path");
const session = require("express-session");
const db = require("./config/db");
const postModel = require("./models/postModel")
const postController = require("./controllers/postController")
const authController = require("./controllers/authController")

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

app.get("/login", authController.showLogin)


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
app.get("/news", postController.index)

// 2. Tìm kiếm bài viết (Công khai - Đặt trước các route có param :id)
app.get("/news/search", postController.search)

// ================= 3. SỬ DỤNG MIDDLEWARE ĐỂ BẢO VỆ =================

// Thêm bài viết (Yêu cầu đăng nhập)
app.get("/news/add", requireLogin, postController.create)

app.post("/news/add", requireLogin, postController.store)
// Sửa bài viết (Yêu cầu đăng nhập)
app.get("/news/:id/edit", requireLogin, postController.edit)

app.post("/news/:id/edit", requireLogin, postController.update)

// Xóa bài viết (Yêu cầu đăng nhập)
app.post("/news/:id/delete", requireLogin,postController.destroy)

// 4. Chi tiết bài viết (Công khai - Đặt ở đáy cùng)
app.get("/news/:id", postController.show)


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});