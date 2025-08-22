import React, { useEffect, useState } from "react";
import { getBuyerOrders } from "../services/buyerapis";
import "./css/MyOrders.css";
import BookCard from "../components/BookCard";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [reviews, setReviews] = useState<{ [bookid: number]: { rating: number; description: string } }>({});
  const navigate = useNavigate();


  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getBuyerOrders();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderid: number) => {
    setExpandedOrder(expandedOrder === orderid ? null : orderid);
  };

  
  let count = orders.length;

  return (
    <>
      <Navbar />
      <div className="my-orders-container">
        <h2 className="my-orders-title">My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.orderid}
              className={`order-card ${
                expandedOrder === order.orderid ? "expanded" : ""
              }`}
              onClick={() => toggleExpand(order.orderid)}
            >
              <div className="order-header">
                <div>
                  <h3 className="order-id">Order #{count--}</h3>
                  <p className="order-date">
                    {new Date(order.dateoforder).toLocaleDateString()}
                  </p>
                </div>
                <p className="order-total">₹{order.total_amount}</p>
              </div>

              {expandedOrder === order.orderid && (
                <div
                  className="order-books-row"
                  onClick={(e) => e.stopPropagation()}
                >
                  {order.items?.map((book: any) => (
                    <div
                        key={book.orderitemid}
                        className="order-book"
                        onClick={(e) => {
                        e.stopPropagation(); 
                        }}
                    >
                        <Link to={`/api/books/${book.bookid}`}>
                        <BookCard book={book} />
                        </Link>
                        <div className="quantity">Qty: {book.quantity}</div>

                        <button
                          className="review-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/reviews/${book.bookid}`, { state: { book } });
                          }}
                        >
                          {book.review_description ? "Edit Review" : "Add Review"}
                        </button>

                    </div>
                    ))}

                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
