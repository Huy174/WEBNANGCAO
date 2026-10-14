import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsList from "./components/NewsList";
import NewsDetail from "./pages/NewsDetail";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "ReactJS",
      description: "ReactJS là thư viện xây dựng giao diện người dùng.",
      views: 120,
    },
    {
      id: 2,
      title: "NodeJS",
      description: "NodeJS là môi trường chạy JavaScript phía server.",
      views: 85,
    },
    {
      id: 3,
      title: "ExpressJS",
      description: "ExpressJS là framework hỗ trợ xây dựng API trong NodeJS.",
      views: 60,
    },
  ]);
  function addNews(newPost) {
    setPosts([...posts, newPost]);
  }

  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/news"
            element={<NewsList posts={posts} onAddNews={addNews} />}
          />
          <Route path="/news/:id" element={<NewsDetail posts={posts} />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
