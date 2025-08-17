import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './css/AdminDashboard.css';
import { topCustomers as tc} from '../services/adminapis';
import { topSellers as ts} from '../services/adminapis';
import { topBooks as tb} from '../services/adminapis';

interface Customer {
  name: string;
  email: string;
  spent: number;
}

interface Seller {
  name: string;
  email: string;
  revenue: number;
}

interface Book {
  title: string;
  author: string;
  copiesSold: number;
}


export default function AdminDashboard() {
  const navigate = useNavigate();
    
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
  const [topSellers, setTopSellers] = useState<Seller[]>([]);
  const [topBooks, setTopBooks] = useState<Book[]>([]);
  // const [topCustomerData, settopCustomerData] = useState("");


 useEffect(() => {
  const fetchData = async () => {
    try {
      const [topCustomersData, topSellersData, topBooksData] = await Promise.all([
        tc(),
        ts(),
        tb(),
      ]);

      setTopCustomers(topCustomersData);
      setTopSellers(topSellersData);
      setTopBooks(topBooksData);
    } 
    catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  fetchData();
}, []);


  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>

        <div className="stats-section">
          <div className="stat-card blue">
            <h3>Best Customer</h3>
            {topCustomers[0] && (
              <>
                <p>{topCustomers[0].name}</p>
                <p>{topCustomers[0].email}</p>
                <span>₹{topCustomers[0].spent} spent</span>
              </>
            )}
          </div>

          <div className="stat-card green">
            <h3>Best Seller</h3>
            {topSellers[0] && (
              <>
                <p>{topSellers[0].name}</p>
                <p>{topSellers[0].email}</p>
                <span>₹{topSellers[0].revenue} earned</span>
              </>
            )}
          </div>

          <div className="stat-card purple">
            <h3>Total Customer Spend</h3>
            <p>{topCustomers.reduce((sum, c) => sum + Number(c.spent || 0), 0)}</p>
          </div>

          <div className="stat-card orange">
            <h3>Total Books Sold</h3>
            <p>{topBooks.reduce((sum, b) => sum + Number(b.copiesSold || 0), 0)}</p>
          </div>
        </div>

        <div className="tables-section">
          <div className="user-table">
            <div className="table-header">
              <h2>Top 10 Customers</h2>
              <button onClick={() => navigate('/admin/customers')}>View All</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Spent</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, idx) => (
                  <tr key={idx}>
                    <td data-label="Name">{customer.name}</td>
                    <td data-label="Email">{customer.email}</td>
                    <td data-label="Amount Spend">₹{customer.spent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="user-table">
            <div className="table-header">
              <h2>Top 10 Sellers</h2>
              <button onClick={() => navigate('/admin/sellers')}>View All</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((seller, idx) => (
                  <tr key={idx}>
                    <td data-label="Name">{seller.name}</td>
                    <td data-label="Email">{seller.email}</td>
                    <td data-label="Amount Spend">₹{seller.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="user-table">
            <div className="table-header">
              <h2>Top 10 Books</h2>
              <button onClick={() => navigate('/admin/books')}>View All</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name of the Book</th>
                  <th>Author</th>
                  <th>No. of Copies Sold</th>
                </tr>
              </thead>
              <tbody>
                {topBooks.map((book, idx) => (
                  <tr key={idx}>
                    <td data-label="Name">{book.title}</td>
                    <td data-label="Email">{book.author}</td>
                    <td data-label="Amount Spend">{book.copiesSold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
