import { useState } from "react";

function NewsForm({ onAddNews }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const newPost = {
      id: Date.now(),
      title: title,
      description: description,
      views: 0,
    };
    onAddNews(newPost);
    setTitle("");
    setDescription("");
  }
  return (
    <div>
      <h2>Thêm bài viết</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tiêu đề"
          onChange={(event) => setTitle(event.target.value)}
        />

        <br />
        <br />

        <textarea
          rows="5"
          cols="40"
          placeholder="Nội dung"
          onChange={(event) => setDescription(event.target.value)}
        />

        <br />
        <br />

        <button type="submit">Lưu bài viết</button>
      </form>

      <h3>Xem trước</h3>

      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
export default NewsForm;
