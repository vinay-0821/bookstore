import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { fetchBookDetailsBuyer, fetchBookReviewsBuyer, fetchBuyerStats, getAllBooksBuyer, getAllGenres, getBuyerById, updateBuyerDetails, updateBuyerPassword } from "./buyerServices.ts";



function decodeToken(token) {
  if (!token) throw new Error("No token provided");

  return jwt.verify(token, process.env.JWT_SECRET as string);
}


export const fetchAllBooksBuyer = async (req: Request, res: Response) => {
  try {
    const books = await getAllBooksBuyer();
    res.json(books);
  } catch (error: any) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
};



export const fetchGenresBuyer = async (req: Request, res: Response) => {
  try {
    const genres = await getAllGenres();
    res.json(genres);
  } catch (error: any) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ message: "Failed to fetch genres" });
  }
};



export const getBookDetailsBuyer = async (req: Request, res: Response) => {
  try {
    const { bookid } = req.params;
    const book = await fetchBookDetailsBuyer(bookid);

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


export const getBookReviewsBuyer = async (req: Request, res: Response) => {
  try {
    const { bookid } = req.params;
    const reviews = await fetchBookReviewsBuyer(bookid);
    // console.log(reviews);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching book reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getProfileDetailsBuyer = async (req, res) => {
  // console.log("it came here");
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  // console.log("this f:", data);
  try {
    const customerId = data;
    // console.log("Seller Id", adminId);
    const customer = await getBuyerById(customerId);
    // console.log("SellerController: ",admin);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const updateBuyerProfileDetails = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  // console.log(data);
  try {
    const customerId = data;
    await updateBuyerDetails(customerId, req.body);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const changeBuyerPassword = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  try {
    const customerId = data;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password required" });
    await updateBuyerPassword(customerId, password);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export async function getBuyerStats(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  try {
    let customerid = 0;
    if (data && typeof data !== 'string') {
    customerid = (data as JwtPayload).userid;
    } 
    else {
    throw new Error('Invalid token payload');
    }
    
    const stats = await fetchBuyerStats(customerid);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching buyer stats:", error);
    res.status(500).json({ message: "Failed to fetch buyer stats" });
  }
}