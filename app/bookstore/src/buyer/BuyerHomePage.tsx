import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "./css/BuyerHomePage.css";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import FiltersSidebar, { FiltersState, SortOption } from "../components/FiltersSidebar";
import Advertisements from "./Advertisements";
import { fetchBooksBuyer, fetchGenresBuyer } from "../services/buyerapis";

export interface Book {
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

export default function BuyerHomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    genres: new Set<string>(),
    minPrice: "",
    maxPrice: "",
    inStockOnly: false,
    minRating: 0,
    newArrivalsOnly: false,
    sortBy: "relevance",
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [booksData, genresData] = await Promise.all([
          fetchBooksBuyer(),
          fetchGenresBuyer(),
        ]);
        setBooks(booksData);
        setGenres(genresData);
      } catch (e) {
        console.error(e);
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  console.log(books);
  // console.log(genres);

  const filteredBooks = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const selected = filters.genres;
    const minP = filters.minPrice ? Number(filters.minPrice) : -Infinity;
    const maxP = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
    const today = new Date();

    const withinDays = (dateStr: string, days: number) => {
      const d = new Date(dateStr);
      const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= days;
    };

    

    let result = books.filter((b) => {

      // const stockCount = b.availableCount;

      console.log("available count",b.availableCount);

      const priceNum = Number(b.price);
      const ratingNum = typeof b.rating === "number" ? b.rating : 0;
      const hasStock = b.availableCount > 0;

      console.log("hasStock", hasStock);

      const genresList = b.genres
        ? b.genres.split(",").map((g) => g.trim().toLowerCase())
        : [];

      const matchesSearch =
        !search ||
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search) ||
        genresList.some((g) => g.includes(search));

      const matchesGenre =
        selected.size === 0 ||
        genresList.some((g) => selected.has(g)) ||
        Array.from(selected).some((sel) => b.genres.toLowerCase().includes(sel));

      const matchesPrice = priceNum >= minP && priceNum <= maxP;
      const matchesStock = !filters.inStockOnly || hasStock;
      const matchesRating = ratingNum >= (filters.minRating || 0);
      const matchesNew =
        !filters.newArrivalsOnly || withinDays(b.date_publish, 30);

      return (
        matchesSearch &&
        matchesGenre &&
        matchesPrice &&
        matchesStock &&
        matchesRating &&
        matchesNew
      );
    });

    const sortBy: SortOption = filters.sortBy;
    result = result.slice().sort((a, b) => {
      const pa = Number(a.price);
      const pb = Number(b.price);
      const ra = typeof a.rating === "number" ? a.rating : 0;
      const rb = typeof b.rating === "number" ? b.rating : 0;
      const da = new Date(a.date_publish).getTime();
      const db = new Date(b.date_publish).getTime();

      switch (sortBy) {
        case "price_low_high":
          return pa - pb;
        case "price_high_low":
          return pb - pa;
        case "rating_high_low":
          return rb - ra;
        case "date_new_old":
          return db - da;
        default:
          return 0; 
      }
    });

    return result;
  }, [books, filters]);

  return (
    <>
      <Navbar />
      <div className="buyer-page">
        <Advertisements />

        <div className="content-wrap">
          <aside className="sidebar">
            <FiltersSidebar
              genres={genres}
              value={filters}
              onChange={setFilters}
            />
          </aside>

          <main className="main">
            {loading && <div className="loading">Loading books…</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && (
              <>
                <div className="results-bar">
                  <div>
                    Showing <strong>{filteredBooks.length}</strong> of{" "}
                    <strong>{books.length}</strong> books
                  </div>
                  <div className="sort-inline">
                    <label htmlFor="sortBy" className="label">
                        Sort By
                        </label>
                        <select
                        id="sortBy"
                        value={filters.sortBy}
                        onChange={(e) =>
                            setFilters((f: any) => ({
                            ...f,
                            sortBy: e.target.value as SortOption,
                            }))
                        }
                        >
                      <option value="relevance">Relevance</option>
                      <option value="price_low_high">Price: Low to High</option>
                      <option value="price_high_low">Price: High to Low</option>
                      <option value="rating_high_low">Rating: High to Low</option>
                      <option value="date_new_old">Newest Arrivals</option>
                    </select>
                  </div>
                </div>

                <div className="books-grid">
                  {filteredBooks.map((b) => {
                    const isOutOfStock = b.availableCount <= 0;
                    return (
                      <Link
                        key={b.bookid}
                        to={`/api/books/${b.bookid}`}
                        className={`book-link ${isOutOfStock ? "out-of-stock" : ""}`}
                      >
                        <BookCard book={b} />
                        {isOutOfStock && <div className="out-of-stock-overlay">Out of Stock</div>}
                      </Link>
                    );
                  })}
                </div>

              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

