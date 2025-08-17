import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./auth.css";
import { signupUser } from '../services/authapi';
import Navbar from '../components/Navbar';

export default function SignUp() {
  const [username,setUsername] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [error, setError] = useState('');

  const [addressline, setAddressline] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');

  const navigate = useNavigate();
  // const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username === '' || email === '' || password === '') {
      setError('Please fill in all fields');
      return;
    }

    if (role === 'seller' && (addressline === '' || state === '' || country === '' || pincode === '')) {
      setError('Please fill in all seller address fields');
      return;
    }

    const address = `${addressline}, ${state}, ${country} - ${pincode}`

    try {
      const response = await signupUser(
        username,
        email,
        password,
        role,
        mobile,
        address,
      );

      console.log("Signup Success", response);
      navigate('/login');
    } 
    catch (err: any) {
      console.log("Signup Error", err);
      setError(err.message || 'Signup failed');
    }
  }

  return (
    <div>
      <Navbar />
      <div className="signup">
        <img src={require('../assets/bookmain.jpg')} alt="bookstoreimg" />

        <div className="signup-form">
          <h1>Sign Up</h1>

          <div className="role-toggle">
            <label>
              <input type="radio" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} />
              Customer
            </label>
            <label>
              <input type="radio" value="seller" checked={role === 'seller'} onChange={() => setRole('seller')} />
              Seller
            </label>
          </div>

          <p style={{ color: 'red', fontStyle: 'italic' }}>
            {error && <span className="error">{error}</span>}
          </p>

          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="tel" placeholder="Mobile Number" onChange={(e) => setMobile(e.target.value)} />

            {role === 'seller' && (
              <>
                <input type="text" placeholder="Addressline" onChange={(e) => setAddressline(e.target.value)} />
                <input type="text" placeholder="State" onChange={(e) => setState(e.target.value)} />
                <input type="text" placeholder="Country" onChange={(e) => setCountry(e.target.value)} />
                <input type="text" placeholder="Pincode" onChange={(e) => setPincode(e.target.value)} />
              </>
            )}

            <button type="submit">Sign Up</button>
          </form>

          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}
