import React, { useEffect, useRef, useState } from "react";
import "./css/SellerAddBook.css";
import SellerNavbar from "./SellerNavbar";
import { addBook, fetchGenres } from "../services/sellerapis";


export default function SellerAddBook() {
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
  const [genres, setGenres] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputKey, setInputKey] = useState(0);

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
  }, []);

//   console.log("Genres genres: ",genres);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        console.log("Book data: ",formData);
      const result = await addBook(formData);
      console.log("Book added successfully:", result);

      setFormData({
        title: "",
        author: "",
        isbn: "",
        price: "",
        description: "",
        stock: "",
        genre: "",
        image: null,
      });
      setPreview(null);
      setInputKey((prev) => prev + 1);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting book:", error);
    }
  };

  return (
    <>
      <SellerNavbar />
      <div className="seller-add-book-container">
        <h2 className="seller-add-book-title">Add a New Book</h2>
        <form onSubmit={handleSubmit} className="seller-add-book-form">
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
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
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
                placeholder="Enter ISBN number"
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

            <button type="submit" className="submit-btn">
              Add Book
            </button>
          </div>
        </form>
      </div>
    </>
  );
}




