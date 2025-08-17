import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("http://localhost:5000/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setLoggedIn(true);
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="app-name">BookStore</span>
      </div>
      <div className="navbar-right">
        {loggedIn ? (
          <button onClick={handleLogout} className="nav-button logout-button">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-button login-button">Login</Link>
            <Link to="/signup" className="nav-button signup-button">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
