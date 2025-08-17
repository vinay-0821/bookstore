import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./auth.css";
// import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { login } from '../utils/authSlice';
import { useDispatch } from 'react-redux';
import { loginUser } from '../services/authapi';
import Navbar from '../components/Navbar';
// import { bookImg } from "../assets/bookmain.jpg"

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const location = useLocation();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser(email, password);
      // console.log("it is logging in", res)

      const token = res.token;
      const decoded: any = jwtDecode(token);

      const user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      dispatch(login({ user, token }));
      if(user.role === 'admin'){
        navigate('/admin/dashboard');
      }
      else if(user.role === 'customer'){
        navigate('/home');
      }
      else if(user.role === 'seller'){ 
        navigate('/seller/dashboard'); 
      }
    } 
    catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login">
        <img src={require("../assets/bookmain.jpg")} alt="bookstoreimg" />
        
        <div className='login-form'>
          <h1>Login</h1>
          <p style={{ color: 'red', fontStyle: 'italic' }}>{error && <span className="error">{error}</span>}</p>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
          </form>
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  )
}
