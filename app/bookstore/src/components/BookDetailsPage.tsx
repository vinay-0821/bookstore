import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchBookDetails, fetchBookReviews } from "../services/adminapis";
import "./css/BookDetailsPage.css";
import AdminNavbar from "../admin/AdminNavbar";

interface Book {
  bookid: number;
  title: string;
  author: string;
  description: string;
  price: string;  
  date_publish: string;
  availableCount: number;
  seller_id: number;
  seller_name: string;
  seller_email: string;
  genres: string;
  soldCount: string | number;
  images?: string[]; 
}

interface Review {
  reviewid: number;
  rating: string;
  review_description: string;
  userName: string;
}

export default function BookDetailsPage() {
  const { bookid } = useParams<{ bookid: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
        console.log("Books");
      try {
        setLoading(true);
        if (!bookid) return;

        const [bookData, reviewData] = await Promise.all([
          fetchBookDetails(bookid),
          fetchBookReviews(bookid),
        ]);

        setBook(bookData);
        setReviews(reviewData);

        // console.log("Books: ",bookData);
        // console.log("Reviews: ",reviewData);
      } 
      catch (err) {
        console.error(err);
        setError("Failed to fetch book details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookid]);

  if (loading) return <div>Loading book details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div>No book found.</div>;

  
        // console.log("Books: ",book);
        // console.log("Reviews: ",reviews);

  return (

    <>
        <AdminNavbar />
        <div className="book-page">
        
        <div className="book-left">
            {/* {Array.isArray(book.images) ? (
                book.images.map((img: string, index: number) => (
                    <img key={index} src={img} alt={`book-image-${index}`} />
                ))
                ) : book.images ? (
                <img src={book.images} alt="book-image" />
                ) : (
                <p>No images available</p>
            )} */}
            <img
                src={require("../assets/bookmain.jpg")}
                alt={book.title}
            />
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
                <p><strong>Sold:</strong> {book.soldCount}</p>
                <p><strong>Published:</strong> {new Date(book.date_publish).toLocaleDateString()}</p>
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
    </>
  );
}
