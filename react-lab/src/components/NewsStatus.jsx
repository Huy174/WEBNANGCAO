import { useState } from "react";
function NewsStatus() {
  const [info, setInfo] = useState({
    title: "ReactJS",
    views: 100,
    status: "Đang hiển thị",
  });
  return (
    <div>
      <h2>{info.title}</h2>
      <p>Lượt xem: {info.views}</p>
      <p>Trạng thái: {info.status}</p>
      <button onClick={() => setInfo({ ...info, views: info.views + 1 })}>
        Tăng lượt xem
      </button>

      <button onClick={() => setInfo({ ...info, status: "Đã cập nhật" })}>
        Cập nhật trạng thái
      </button>
    </div>
  );
}
export default NewsStatus;
