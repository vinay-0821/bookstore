import React, { useEffect, useState } from "react";
import "./css/Orders.css";
import Navbar from "../components/Navbar";

interface Order {
  orderId: number;
  date: string;
  totalAmount: number;
  status: string;
  items: {
    title: string;
    quantity: number;
    price: number;
  }[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/buyer/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="orders-page">
        <h2>My Orders</h2>
        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.orderId}</h3>
                  <p><strong>Date:</strong> {order.date}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.title} (x{item.quantity}) - ₹{item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </>
  );
}
