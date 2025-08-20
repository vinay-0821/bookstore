import React from "react";
import "./css/BookCard.css";

interface Book {
  bookid: number;
  title: string;
  author: string;
  isbn: number | string;
  description: string;
  price: string; 
  date_publish: string;
  availableCount: number;
  seller_id: number;
  seller_name: string;
  seller_email: string;
  genres: string;
  images?: string[];
  rating?: number; 
}

const fallback = require("../assets/bookmain.jpg");

export default function BookCard({ book }: { book: Book }) {
  const price = Number(book.price) || 0;
  const rating = typeof book.rating === "number" ? book.rating : undefined;

  return (
    <div className="book-card">
      <div className="thumb">
        {/* <img
          src={book.images?.[0] || fallback}
          alt={book.title}
          loading="lazy"
        /> */}
        <img src={ fallback} alt={book.title} />
      </div>
      <div className="info">
        <h3 title={book.title}>{book.title}</h3>
        <div className="author" title={book.author}>by {book.author}</div>
        <div className="meta">
          <span className="price">₹{price.toFixed(2)}</span>
          {rating !== undefined && (
            <span className="rating" title={`${rating} out of 5`}>
              ★ {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
