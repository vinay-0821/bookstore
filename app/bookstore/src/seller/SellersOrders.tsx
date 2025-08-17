import React, { useEffect, useState } from "react";
import SellerNavbar from "./SellerNavbar";
import { fetchSellerOrders } from "../services/sellerapis"; 
import debounce from "lodash.debounce";
import "./css/SellerBooks.css";

interface SellerOrder {
  id: number;
  book: string;
  buyer: string;
  date: string;
  amount: number;
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [sortBy, setSortBy] = useState<'id' | 'book' | 'buyer' | 'date' | 'amount'>("date");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [buyerFilter, setBuyerFilter] = useState('');
  const [bookFilter, setBookFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("this is genre filter",orderIdFilter);
        // console.log("this is seller filter",buyerFilter);
        // console.log("this is title filter",bookFilter);
        const data = await fetchSellerOrders(
          orderIdFilter,
          buyerFilter,
          bookFilter,
          sortBy,
          order
        );
        // console.log("from server", data);
        setOrders(data);
        // console.log("this is good", orders);
      } catch (err) {
        console.error(err);
      }
    };

    const debouncedFetch = debounce(fetchData, 500);
    debouncedFetch();
    
    return () => debouncedFetch.cancel();
  }, [orderIdFilter, buyerFilter, bookFilter, sortBy, order]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  return (
    <div className="admin-customers-page">
      <SellerNavbar />
      <div className="admin-customers-container">

        <div className="filters">
          <input
            type="text"
            placeholder="Filter by Order ID"
            value={orderIdFilter}
            onChange={(e) => setOrderIdFilter(e.target.value)}
            className="search-input"
          />

          <input
            type="text"
            placeholder="Filter by Buyer Email"
            value={buyerFilter}
            onChange={(e) => setBuyerFilter(e.target.value)}
            className="search-input"
          />

          <input
            type="text"
            placeholder="Filter by Book Title"
            value={bookFilter}
            onChange={(e) => setBookFilter(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                Order ID {sortBy === "id" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("book")}>
                Book {sortBy === "book" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("buyer")}>
                Buyer {sortBy === "buyer" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("date")}>
                Date {sortBy === "date" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("amount")}>
                Amount {sortBy === "amount" && (order === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr>
                <td>{o.id}</td>
                <td>{o.book}</td>
                <td>{o.buyer}</td>
                <td>{o.date}</td>
                <td>{o.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
