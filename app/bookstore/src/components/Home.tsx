import React from 'react'
import './css/Home.css';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="home-container">
        <h1 className="home-title">Welcome to BookStore</h1>
        <p className="home-description">
          Discover, explore, and shop your favorite books in one place.
          <br />
          <a href="/login">Login</a> or <a href="/signup">create an account</a> to get started!
        </p>
      </div>
    </div>
  )
}
