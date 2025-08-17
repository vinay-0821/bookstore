import React, { useEffect, useState } from 'react';
import './css/AdminCustomers.css';
import AdminNavbar from './AdminNavbar';
import { fetchBooks } from '../services/adminapis';
import debounce from 'lodash.debounce';
// import Book from '../components/Book';
import { useNavigate } from 'react-router-dom';

interface Book {
  bookid: number;
  title: string;
  genre: string;
  avaliableCount: number;
  soldCount: number;
  seller_email: string;
  author?: string;
  price?: number;
  image_url?: string;
}

export default function AdminBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'genre' | 'available' | 'sold'>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [genre, setGenre] = useState('');
  const [seller, setSeller] = useState('');
  const [title, setTitle] = useState('');
  // const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("this is genre filter",genre);
        // console.log("this is seller filter",seller);
        // console.log("this is title filter",title);
        const data = await fetchBooks(genre, seller, title, sortBy, order);
        // console.log("This is data: ", data);
        setBooks(data);
      } catch (err) {
        console.error(err);
      }
    };

    

    const debouncedFetch = debounce(fetchData, 500);
    debouncedFetch();
    
    // console.log("this is books: ", books );

    return () => debouncedFetch.cancel();
  }, [genre, seller, title, sortBy, order]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setOrder('asc');
    }
  };

  

  return (
    <div className="admin-customers-page">
      <AdminNavbar />
      <div className="admin-customers-container">
        <h2>Books Inventory</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Filter by genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Filter by seller"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Filter by title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("title")}>
                Title {sortBy === "title" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("genre")}>
                Genre {sortBy === "genre" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("available")}>
                Available {sortBy === "available" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("sold")}>
                Sold {sortBy === "sold" && (order === "asc" ? "↑" : "↓")}
              </th>
              <th>Seller</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr
                key={b.bookid}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/admin/books/${b.bookid}`)}
              >
                <td>{b.title}</td>
                <td>{b.genre}</td>
                <td>{b.avaliableCount}</td>
                <td>{b.soldCount}</td>
                <td>{b.seller_email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
