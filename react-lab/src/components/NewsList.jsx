import NewsItem from "./NewsItem";
import NewsForm from "./NewsForm";
import { useState } from "react";

function NewsList({ posts, onAddNews }) {
  return (
    <>
      <NewsForm onAddNews={onAddNews} />
      <h2>Danh sách tin tức</h2>
      {posts.map((post) => (
        <NewsItem
          key={post.id}
          title={post.title}
          description={post.description}
          views={post.views}
        />
      ))}
    </>
  );
}
export default NewsList;
