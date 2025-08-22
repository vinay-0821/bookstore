import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./css/WriteReview.css";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import { postReview, putReview } from "../services/buyerapis";

export default function WriteReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookid } = useParams<{ bookid: string }>();

  const { book: bookFromState } = location.state || {};
  const [book, setBook] = useState<any>(bookFromState);

  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number | "">("");

  // console.log("WriteReview: ", book);

  useEffect(() => {
    if (book) {
      if (book.review_description) setReview(book.review_description);
      if (book.review_rating) setRating(book.review_rating);
    }
  }, [book]);
    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === "" || rating < 1 || rating > 5) {
      alert("Please enter a valid rating between 1 and 5.");
      return;
    }


    try {
      let res;
      
      if(book.review_description && book.review_rating){
        console.log("update");
         res = await putReview(book.bookid, book.reviewid, review, rating);
      }
      else{
        console.log("post");
         res = await postReview(book.bookid, review, rating);
         console.log(res);
      }


      alert("Review saved!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving review.");
    }
  };

  if (!book) {
    return <p>Loading book details...</p>;
  }

  return (
    <>
    <Navbar />
    <div className="review-page">
      <h2>Review  this book</h2>
      <div className="review-container">
        <BookCard book={book} />

        <form onSubmit={handleSubmit} className="review-form">
          <label htmlFor="rating">Rating (1-5):</label>
          <input
            id="rating"
            type="number"
            min="1"
            max="5"
            step="0.1"   
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rating-input"
            placeholder="Enter rating (1 - 5)"
            title="Enter a rating between 1 and 5, decimals allowed"
          />

          <label>Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
            rows={6}
          />

          <button type="submit" className="submit-btn">
            {book.review_description ? "Update Review" : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
