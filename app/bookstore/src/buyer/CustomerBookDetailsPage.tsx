import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../components/css/BookDetailsPage.css";
import Navbar from "../components/Navbar";
import { fetchBookDetailsBuyer, fetchBookReviewsBuyer, placeOrder, saveCart } from "../services/buyerapis";
import PurchaseModal from "./PurchaseModal";
import { addToCart } from "../utils/cartSlice";
import { useDispatch } from "react-redux";

const defaultBookImg = require("../assets/bookmain.jpg");

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
}

interface Review {
  reviewid: number;
  rating: string;
  review_description: string;
  userName: string;
}

export default function CustomerBookDetailsPage() {
  const { bookid } = useParams<{ bookid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!bookid) return;

        const [bookData, reviewData] = await Promise.all([
          fetchBookDetailsBuyer(bookid),
          fetchBookReviewsBuyer(bookid),
        ]);

        setBook(bookData);
        setReviews(reviewData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch book details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookid]);

  const handleBuyNowClick = () => {
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async (quantity: number) => {
  if (!book) return;

  const confirmed = window.confirm(
    `Are you sure you want to buy ${quantity} copy/copies of "${book.title}" for ₹${
      Number(book.price) * quantity
    }?`
  );

  if (!confirmed) return;

  try {
    await placeOrder(book.bookid, quantity, Number(book.price) * quantity);
    alert("Purchase successful!");
    setShowPurchaseModal(false);
    navigate("/orders");
  } catch (error) {
    alert("Purchase failed. Please try again.");
  }
};


const handleAddToCart = async () => {
    if (!book) return;

    const cartItem = {
      bookid: book.bookid,
      title: book.title,
      price: Number(book.price),
      quantity: 1,
    };

    dispatch(addToCart(cartItem));

    try {
      await saveCart([cartItem]);
    } catch (err) {
      console.error("Failed to save cart:", err);
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };


  if (loading) return <div>Loading book details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div>No book found.</div>;

  return (
    <>
      <Navbar />
      <div className="book-page">
        <div className="book-left">
          
          {/* <img
            src={book.images && book.images[0] ? book.images[0] : defaultBookImg}
            alt={book.title}
          /> */}

          <img src={ defaultBookImg} alt={book.title} />

        </div>

        <div className="book-right">
          <div className="book-details">
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Description:</strong> {book.description}</p>
            <p><strong>Genre(s):</strong> {book.genres}</p>
            <p><strong>Seller:</strong> {book.seller_name} ({book.seller_email})</p>
            <p><strong>Price:</strong> ₹{book.price}</p>
            <p><strong>Stock Left:</strong> {book.availableCount}</p>
            <p><strong>Published:</strong> {new Date(book.date_publish).toLocaleDateString()}</p>

            <div className="action-buttons">
               <button className="add-cart-btn" onClick={handleAddToCart}>
                🛒 {addedToCart ? "Added!" : "Add to Cart"}
              </button>
              <button className="buy-now-btn" onClick={handleBuyNowClick}>⚡ Buy Now</button>
            </div>
          </div>

          <div className="book-reviews">
            <h3>Customer Reviews</h3>
            {reviews.length === 0 && <p>No reviews yet.</p>}
            {reviews.map((rev) => (
              <div key={rev.reviewid} className="review-card">
                <div className="review-header">
                  <span className="review-name">{rev.userName}</span>
                  <span className="review-rating">⭐ {rev.rating}</span>
                </div>
                <p className="review-desc">{rev.review_description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPurchaseModal && book && (
        <PurchaseModal
          book={{
            title: book.title,
            author: book.author,
            price: book.price,
            availableCount: book.availableCount,
            image: book.images && book.images[0],
          }}
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </>
  );
}
