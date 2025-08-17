import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { FaBars } from "react-icons/fa";
// import { RiUser3Line } from "react-icons/ri";
import "./css/SellerNavbar.css";
import { logout } from "../utils/authSlice";
import { Person } from 'react-bootstrap-icons';
import { List } from 'react-bootstrap-icons';

const SellerNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen((v) => !v);
  const toggleDropdown = () => setShowDropdown((v) => !v);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (showDropdown && profileRef.current && !profileRef.current.contains(t)) {
        setShowDropdown(false);
      }
      const navLinks = document.querySelector(".nav-links");
      const navToggle = document.querySelector(".nav-toggle");
      if (
        isOpen &&
        navLinks &&
        navToggle &&
        !navLinks.contains(t) &&
        !navToggle.contains(t)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen, showDropdown]);

  return (
    <nav className="seller-navbar">
      <div className="nav-left">
        <div className="nav-logo" onClick={() => navigate("/seller/dashboard")}>
          <span className="logo-text">Seller</span>
        </div>
      </div>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/seller/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
        <Link to="/seller/mybooks" onClick={() => setIsOpen(false)}>My Books</Link>
        <Link to="/seller/addbook" onClick={() => setIsOpen(false)}>Add Book</Link>
        <Link to="/seller/orders" onClick={() => setIsOpen(false)}>Orders</Link>

        <div className="mobile-only">
          <Link to="/seller/profile" onClick={() => setIsOpen(false)}>Profile</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="nav-right">
        <div className="profile-section desktop-only" ref={profileRef}>
          {/* <RiUser3Line className="profile-icon" onClick={toggleDropdown} aria-hidden /> */}
          <Person className="profile-icon" onClick={toggleDropdown} />
          {showDropdown && (
            <div className="profile-dropdown" aria-label="Profile menu">
              <Link to="/seller/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {/* <FaBars /> */}
          <List />
        </button>
      </div>
    </nav>
  );
};

export default SellerNavbar;
