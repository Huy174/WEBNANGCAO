const express = require("express");
const path = require("path");
const db = require("./config/db");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("home");
});

// 1. Danh sách bài viết
app.get("/news", async (req, res) => {
    try {
        const [posts] = await db.query("SELECT * FROM posts ORDER BY id DESC");
        console.log(posts);
        res.render("news-list", { posts });
    } catch (error) {
        console.error(error);
        res.send("Lỗi khi lấy danh sách bài viết");
    }
});

// 2. Thêm bài viết
app.get("/news/add", (req, res) => {
    res.render("add-post");
});

app.post("/news/add", async (req, res) => {   
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

// 3. Tìm kiếm bài viết (ĐÃ CHUYỂN LÊN TRƯỚC /news/:id)
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

// 4. Chi tiết bài viết (LUÔN ĐẶT Ở ĐÁY)
app.get("/news/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).send("Không tìm thấy bài viết");
        }
        res.render("news-detail", { post: rows[0] });
    } catch (error) {
        console.log(error);
        res.send("Lỗi khi xem chi tiết bài viết");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});