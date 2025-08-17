import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/AdminNavbar.css";
import { logout } from "../utils/authSlice";
import { useDispatch } from "react-redux";
// import FaBars from "react-icons/fa/FaBars";
// import { FaBars, FaUserCircle } from "react-icons/fa";
import { PersonCircle } from 'react-bootstrap-icons';
import { List } from 'react-bootstrap-icons';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  }

  const [isOpen, setIsOpen] = useState(false);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const profileRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    
    if (
      showDropdown &&
      profileRef.current &&
      !(profileRef.current as any).contains(target)
    ) {
      setShowDropdown(false);
    }

    const navLinks = document.querySelector(".nav-links");
    const navToggle = document.querySelector(".nav-toggle");

    if (
      isOpen &&
      navLinks &&
      navToggle &&
      !navLinks.contains(target) &&
      !navToggle.contains(target)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [isOpen]);

  return (
    <nav className="admin-navbar">
      <div className="nav-logo">Admin</div>

      <div className={isOpen ? "nav-links open" : "nav-links"}>
        <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
        <Link to="/admin/approvesellers" onClick={() => setIsOpen(false)}>Approve Sellers</Link>
        <Link to="/admin/books" onClick={() => setIsOpen(false)}>Books</Link>
        <Link to="/admin/customers" onClick={() => setIsOpen(false)}>Customers</Link>
        <Link to="/admin/sellers" onClick={() => setIsOpen(false)}>Sellers</Link>

        <div className="mobile-only">
          <Link to="/admin/profile" onClick={() => setIsOpen(false)}>Profile</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="profile-section desktop-only">
        {/* <FaUserCircle className="profile-icon" onClick={toggleDropdown} /> */}
        <PersonCircle className="profile-icon" onClick={toggleDropdown} />
        {showDropdown && (
          <div className="profile-dropdown">
            <Link to="/admin/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      <div className="nav-toggle" onClick={toggleMenu}>
        {/* <FaBars /> */}
        <List />
      </div>
    </nav>

  );
};

export default AdminNavbar;