import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { deleteBook, fetchGenres, fetchSellerBookDetails, fetchSellerBookReviews, updateBook } from "../services/sellerapis";
import "../components/css/BookDetailsPage.css";
import SellerNavbar from "./SellerNavbar";

const defaultBookImg = require('../assets/bookmain.jpg');

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
  soldCount: string | number;
  images?: string[];
}

interface Review {
  reviewid: number;
  rating: string;
  review_description: string;
  userName: string;
}

export default function SellerBookDetailsPage() {
  const { bookid } = useParams<{ bookid: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    price: "",
    description: "",
    stock: "",
    genre: "",
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<typeof formData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputKey, setInputKey] = useState(0);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {

    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data.data);
        // console.log("Genres data: ",data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    loadGenres();


    const loadData = async () => {
      try {
        setLoading(true);
        if (!bookid) return;

        const [bookData, reviewData] = await Promise.all([
          fetchSellerBookDetails(bookid),
          fetchSellerBookReviews(bookid),
        ]);

        setBook(bookData);
        setReviews(reviewData);

        const initialForm = {
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn,
          price: bookData.price,
          description: bookData.description,
          stock: bookData.availableCount.toString(),
          genre: bookData.genres,
          image: null,
        };

        setFormData(initialForm);
        setOriginalData(initialForm);
        setPreview(bookData.images && bookData.images[0] ? bookData.images[0] : defaultBookImg);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch book details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookid]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    try {
      const updateData: any = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        price: formData.price,
        description: formData.description,
        stock: formData.stock,
        genre: formData.genre,
      };

      if (formData.image) {
        updateData.image = formData.image;
      }

      console.log("Book data: ",updateData);
      // console.log(book);
      const result = await updateBook(book.bookid, updateData);
      console.log("Book added successfully:", result);
      alert("Book updated successfully!");
      setIsEditing(false);

      const updatedBook = await fetchSellerBookDetails(book.bookid);
      setBook(updatedBook);
      setPreview(updatedBook.images && updatedBook.images[0] ? updatedBook.images[0] : defaultBookImg);
      setInputKey((prev) => prev + 1);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Failed to update book.");
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
      setPreview(book?.images && book.images[0] ? book.images[0] : defaultBookImg);
    }
    setIsEditing(false);
    setInputKey((prev) => prev + 1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async () => {
    if (!book) return;

    const confirm = window.confirm("Are you sure you want to delete this book?");
    if (!confirm) return;

    try {
      console.log(book.bookid);
      await deleteBook(book.bookid);
      alert("Book deleted successfully!");
      navigate("/seller/mybooks");
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Failed to delete book.");
    }
  };

  if (loading) return <div>Loading book details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div>No book found.</div>;

  return (
    <>
      <SellerNavbar />
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

          <img src={ defaultBookImg} alt={book.title} />
        </div>

        <div className="book-right">
          {!isEditing ? (
            <>
              <div className="book-details">
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                  <button onClick={() => setIsEditing(true)}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </div>

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
            </>
          ) : (
            <form onSubmit={handleSave} className="seller-add-book-form">
              <div className="form-left">
                <div className="image-upload-box">
                  {preview ? (
                    <img src={preview} alt="Book Preview" className="image-preview" />
                  ) : (
                    <span className="placeholder-text"></span>
                  )}
                  <label htmlFor="image">Book Image</label>
                  <input
                    key={inputKey}
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-right">
                <div className="form-group">
                  <label htmlFor="title">Book Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="isbn">ISBN</label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    placeholder="Enter ISBN"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="Enter available stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Genre --</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter book description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-button">Save</button>
                  <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

