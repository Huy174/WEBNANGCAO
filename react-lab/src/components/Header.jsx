import { NavLink } from "react-router-dom";

function Header() {
  const navStyle = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    color: isActive ? "blue" : "black",
  });
  return (
    <header>
      <h1>Website Tin tức</h1>
      <nav>
        <NavLink to="/" style={navStyle}>
          Trang chủ
        </NavLink>
        {" | "}

        <NavLink to="/news" style={navStyle}>
          Tin tức
        </NavLink>
        {" | "}

        <NavLink to="/about" style={navStyle}>
          Giới thiệu
        </NavLink>
        {" | "}

        <NavLink to="/contact" style={navStyle}>
          Liên hệ
        </NavLink>
      </nav>
    </header>
  );
}
export default Header;
