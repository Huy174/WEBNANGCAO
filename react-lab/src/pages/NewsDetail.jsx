import { useParams } from "react-router-dom";

function NewsDetail({ posts }) {
  const { id } = useParams();

  const post = posts.find((item) => item.id === Number(id));
  if (!post) {
    return <h2>Không tìm thấy bài viết</h2>;
  }
  return (
    <div>
      <h2>{post.title}</h2>

      <p>{post.description}</p>

      <p>Lượt xem: {post.views}</p>
    </div>
  );
}

export default NewsDetail;
