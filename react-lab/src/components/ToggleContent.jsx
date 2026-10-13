import { useState } from "react";

function ToggleContent() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow(!show)}>Ẩn / Hiện nội dung</button>
      {show ? (
        <p>Đây là nội dung đang được hiển thị.</p>
      ) : (
        <p>Nội dung đã bị ẩn.</p>
      )}
    </div>
  );
}
export default ToggleContent;
