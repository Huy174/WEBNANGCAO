import { useState } from "react";

function CategoryList() {
  const [categories, setCategories] = useState([
    "Công nghệ",
    "Giáo dục",
    "Thể thao",
  ]);
  return (
    <div>
      <h2>Danh mục tin tức</h2>

      <ul>
        {" "}
        {categories.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>

      <button onClick={() => setCategories([...categories, "Giải trí"])}>
        Thêm danh mục
      </button>
    </div>
  );
}
export default CategoryList;
