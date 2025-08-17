import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerNavbar from "./SellerNavbar";
import { 
  getSellerTotalAmount, 
  getSellerTotalBooks, 
  getSellerTopBook, 
  getSellerRating, 
  getRecentOrders 
} from "../services/sellerapis";
import "./css/SellerDashboard.css";

interface SellerStats {
  totalAmount: number;
  totalBooksSold: number;
  topBook: string;
  rating: number;
}

interface Order {
  id: number;
  book: string;
  buyer: string;
  date: string;
  amount: number;
}

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SellerStats>({
    totalAmount: 0,
    totalBooksSold: 0,
    topBook: "",
    rating: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // fetch all stats in parallel
        const [amountData, booksData, topBookData, ratingData, ordersData] = await Promise.all([
          getSellerTotalAmount(),
          getSellerTotalBooks(),
          getSellerTopBook(),
          getSellerRating(),
          getRecentOrders()
        ]);

        setStats({
          totalAmount: amountData.totalAmount || 0,
          totalBooksSold: booksData.totalBooksSold || 0,
          topBook: topBookData.topBook || "",
          rating: ratingData.rating || 0
        });

        setRecentOrders(ordersData || []);
      } 
      catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <SellerNavbar />
      <div className="dashboard-container">
        <h1>Seller Dashboard</h1>

        <div className="stats-section">
          <div className="stat-card blue">
            <h3>Total Amount Received</h3>
            <p>₹{stats.totalAmount.toLocaleString()}</p>
          </div>
          <div className="stat-card green">
            <h3>Total Books Sold</h3>
            <p>{stats.totalBooksSold}</p>
          </div>
          <div className="stat-card purple">
            <h3>Top Book</h3>
            <p>{stats.topBook || "No sales yet"}</p>
          </div>
          <div className="stat-card orange">
            <h3>Customer Rating</h3>
            <p>{stats.rating} ★</p>
          </div>
        </div>

        <div className="user-table">
          <div className="table-header">
            <h2>Recent Buys</h2>
            <button onClick={() => navigate("/seller/orders")}>View All</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Book</th>
                <th>Buyer</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.book}</td>
                  <td>{order.buyer}</td>
                  <td>{order.date}</td>
                  <td>{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
