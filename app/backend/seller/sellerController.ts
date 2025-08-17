import type { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { addBook, deleteBookService, fetchAllSellerBooks, fetchAllSellerOrdersServices, fetchBookDetails, fetchBookReviews, getAllGenres, getRecentOrdersService, getSellerById, getSellerRating, getSellerTopBook, getSellerTotalAmount, getSellerTotalBooksSold, updateBookService, updateSellerDetails, updateSellerPassword } from './sellerServices.ts';



function decodeToken(token) {
  if (!token) throw new Error("No token provided");

  return jwt.verify(token, process.env.JWT_SECRET as string);
}

export const getAllSellerBooks = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  try {
    const { genre, seller, title, sortBy, order } = req.query;
    let sellerid = 0;
    if (data && typeof data !== 'string') {
    sellerid = (data as JwtPayload).userid;
    } 
    else {
    throw new Error('Invalid token payload');
    }

    const books = await fetchAllSellerBooks(
      sellerid as number,
      genre as string,
      seller as string,
      title as string,
      sortBy as string,
      order as string
    );

    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
};



export const getSellerProfile = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  // console.log("this f:", data);
  try {
    const sellerId = data;
    // console.log("Seller Id", adminId);
    const seller = await getSellerById(sellerId);
    // console.log("SellerController: ",admin);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateSellerProfile = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  // console.log(data);
  try {
    const sellerId = data;
    await updateSellerDetails(sellerId, req.body);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const changeSellerPassword = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  try {
    const sellerId = data;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password required" });
    await updateSellerPassword(sellerId, password);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getSellerIdFromToken = (req: Request): number => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = decodeToken(token);
  if (data && typeof data !== "string") {
    return (data as JwtPayload).userid;
  }
  throw new Error("Invalid token payload");
};

export const sellerTotalAmountController = async (req: Request, res: Response) => {
  try {
    const sellerId = getSellerIdFromToken(req);
    const totalAmount = await getSellerTotalAmount(sellerId);
    res.json({ totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching total amount" });
  }
};

export const sellerTotalBooksController = async (req: Request, res: Response) => {
  try {
    const sellerId = getSellerIdFromToken(req);
    const totalBooksSold = await getSellerTotalBooksSold(sellerId);
    res.json({ totalBooksSold });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching total books sold" });
  }
};

export const sellerTopBookController = async (req: Request, res: Response) => {
  try {
    const sellerId = getSellerIdFromToken(req);
    const topBook = await getSellerTopBook(sellerId);
    res.json({ topBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching top book" });
  }
};

export const sellerRatingController = async (req: Request, res: Response) => {
  try {
    const sellerId = getSellerIdFromToken(req);
    const rating = await getSellerRating(sellerId);
    res.json({ rating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching rating" });
  }
};


export const getRecentOrdersController = async (req: any, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  try {
    let sellerId = 0;
    if (data && typeof data !== 'string') {
    sellerId = (data as JwtPayload).userid;
    } 
    else {
    throw new Error('Invalid token payload');
    } 
    const orders = await getRecentOrdersService(sellerId);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recent orders" });
  }
};


export const fetchSellerAllOrders = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  // console.log("this from controller ",req.query);
  try {
    const { orderId, buyer, book, sortBy, order } = req.query;
    let sellerid = 0;
    if (data && typeof data !== 'string') {
    sellerid = (data as JwtPayload).userid;
    } 
    else {
    throw new Error('Invalid token payload');
    }

    const books = await fetchAllSellerOrdersServices(
      sellerid as number,
      orderId as string,
      buyer as string,
      book as string,
      sortBy as string,
      order as string
    );

    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
}


export const getBookDetails = async (req: Request, res: Response) => {
  try {
    const { bookid } = req.params;
    const book = await fetchBookDetails(bookid);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    // console.log(book);
    res.json(book);
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getBookReviews = async (req: Request, res: Response) => {
  try {
    const { bookid } = req.params;
    const reviews = await fetchBookReviews(bookid);
    // console.log(reviews);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching book reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const fetchGenres = async (req: Request, res: Response) => {
  try {
    const genres = await getAllGenres();
    return res.status(200).json({ success: true, data: genres });
  } catch (error) {
    console.error("Error fetching genres:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export const addNewBook = async (req: any, res: any) => {
  // console.log("in Controller addNewBook: ", req.body);
  try {
    const { title, author, isbn, price, description, stock, genre, image } = req.body;

    // const image = req.file ? req.file.filename : null;

    // console.log("Book data:", { title, author, isbn, price, description, stock, genre, image });

    if (!title || !author || !isbn || !price || !description || !stock || !genre || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const token = req.headers.authorization?.split(' ')[1];
    const datax = decodeToken(token);
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    let sellerid = 0;
    if (datax && typeof datax !== 'string') {
    sellerid = (datax as JwtPayload).userid;
    } 
    else {
    throw new Error('Invalid token payload');
    }

    // console.log(sellerid);
    

    const newBook = await addBook({
      title,
      author,
      isbn,
      price,
      description,
      stock,
      genre,
      image, 
      sellerid,
    });

    res.status(201).json({
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const updateBookController = async (req: any, res: any) => {
  // console.log("in Controller addNewBook: ", req.body);
  try {

     const { title, author, isbn, price, description, stock, genre, image } = req.body;


     if (!title || !author || !isbn || !price || !description || !stock || !genre || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const token = req.headers.authorization?.split(' ')[1];
    const datax = decodeToken(token);
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    let sellerid = 0;
    if (datax && typeof datax !== 'string') {
    sellerid = (datax as JwtPayload).userid;
    } 
    else {
    throw new Error('Invalid token payload');
    }

    const { bookid } = req.params;

    const updatedBook = await updateBookService({
      bookid, 
      title,
      author,
      isbn,
      price,
      description,
      stock,
      genre,
      image, 
      sellerid, 
    });

    console.log("results: ",res);
    res.status(200).json(updatedBook);
  } catch (err: any) {
    console.error("Update book error:", err);
    res.status(500).json({ message: err.message || "Failed to update book" });
  }
};

export const deleteBookController = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  const datax = decodeToken(token);
  const { bookid } = req.params;

  try {
    let sellerid = 0;
    if (datax && typeof datax !== 'string') {
    sellerid = (datax as JwtPayload).userid;
    } 
    else {
    throw new Error('Invalid token payload');
    }
    const result = await deleteBookService(bookid, sellerid);
    res.status(200).json({ message: "Book deleted successfully", result });
  } catch (err: any) {
    console.error("Delete book error:", err);
    res.status(500).json({ message: err.message || "Failed to delete book" });
  }
};