import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Navbar.css";

import { Cart, PersonCircle } from "react-bootstrap-icons";

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/customer/home" className="app-name">
          BookStore
        </Link>
      </div>

      {loggedIn && (
        <div className="navbar-middle">
          
        </div>
      )}

      <div className="navbar-right">
        {loggedIn ? (
          <div className="icons-container">
            <Link to="/api/cart" className="icon-link">
              <Cart size={22} />
            </Link>
            <div className="profile-dropdown2">
              <PersonCircle
                size={26}
                className="profile-icon"
                onClick={toggleDropdown}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/api/profile" onClick={closeDropdown}>
                    My Profile
                  </Link>
                  <Link to="/api/orders" onClick={closeDropdown}>
                    My Orders
                  </Link>
                  <Link to="/api/reviews" onClick={closeDropdown}>
                    My Reviews
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-button login-button">
              Login
            </Link>
            <Link to="/signup" className="nav-button signup-button">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
