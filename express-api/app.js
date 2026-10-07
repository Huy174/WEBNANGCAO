const express = require("express")
const path = require("path") 
const session = require("express-session") 
const { usesession, requireLogin } = require("./middlewares/authMiddleware");
const postRoutes = require("./routes/postRoute") 
const authRoutes = require("./routes/authRoute") 
const postApiRoutes = require("./routes/api/postApiRoute") // <-- Đã có sẵn
const authApiRoutes = require("./routes/api/authApiRoute") 

const app = express() 
const port = 3000 
 
app.set("view engine", "ejs") 
app.set("views", path.join(__dirname, "views")) 
 
app.use(express.urlencoded({ extended: true })) 
app.use(express.json()) 
app.use(express.static(path.join(__dirname, "public"))) 
app.use(session({   
    secret: "mysecretkey",   
    resave: false,   
    saveUninitialized: false 
})) 
 
app.use(usesession) 
 
app.use("/api/posts", postApiRoutes)
app.use("/api/auth", authApiRoutes) 

app.get("/", (req, res) => {   
    res.render("home") 
})  

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`)
})