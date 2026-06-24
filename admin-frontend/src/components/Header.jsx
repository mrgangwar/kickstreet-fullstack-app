import "./Header.css";

function Header({ title }) {
  return (
    <div className="header">
      <div>
        <h2>{title}</h2>
        <p>Welcome to Kick Street Admin Panel</p>
      </div>

      <div className="admin-box">
        <span>Admin</span>
      </div>
    </div>
  );
}

export default Header;