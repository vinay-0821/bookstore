import { useState } from "react";
import "./css/PurchaseModal.css";

const defaultBookImg = require("../assets/bookmain.jpg");

interface PurchaseModalProps {
  book: {
    title: string;
    author: string;
    price: string;
    availableCount: number;
    image?: string;
  };
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

export default function PurchaseModal({ book, onClose, onConfirm }: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>Confirm Purchase</h2>
        <div className="purchase-content">
          {/* <img
            src={book.images && book.images[0] ? book.images[0] : defaultBookImg}
            alt={book.title}
          /> */}

          <img src={ defaultBookImg} alt={book.title} />

          <div className="details">
            <p><strong>{book.title}</strong> by {book.author}</p>
            <p>Price per unit: {book.price}</p>

            <div className="quantity-control">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(book.availableCount, q + 1))}>+</button>
            </div>

            <p>Total: {Number(book.price) * quantity}</p>
          </div>
        </div>

        <button className="confirm-btn" onClick={() => onConfirm(quantity)}> Buy</button>
      </div>
    </div>
  );
}
