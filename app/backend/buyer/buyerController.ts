import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { clearCartDBService, createReview, fetchBookDetailsBuyer, fetchBookReviewsBuyer, fetchBuyerStats, getAllBooksBuyer, getAllBuyerOrders, getAllGenres, getBuyerById, getCartService, handleCartPurchase, handlePurchase, removeCartItemService, saveCartService, updateBuyerDetails, updateBuyerPassword, updateCartItemQuantityService, updateReview } from "./buyerServices.ts";



function decodeToken(token) {
  if (!token) throw new Error("No token provided");

  return jwt.verify(token, process.env.JWT_SECRET as string);
}


export const fetchAllBooksBuyer = async (req: Request, res: Response) => {
  try {
    const books = await getAllBooksBuyer();
    console.log("Controller", books);
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



export async function updatePurchase(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  const data = decodeToken(token);
  try {
    const { bookId, quantity, totalAmount } = req.body;
    let customerid = 0;
    if (data && typeof data !== 'string') {
    customerid = (data as JwtPayload).userid;
    } 
    else {
    throw new Error('Invalid token payload');
    }

    if (!bookId || !quantity || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await handlePurchase(customerid, bookId, quantity, totalAmount);

    res.status(201).json({ message: "Order placed successfully", order: result });
  } catch (error: any) {
    console.error("Error in updatePurchase:", error);
    res.status(500).json({ message: error.message || "Failed to place order" });
  }
}



export async function saveCart(req: Request, res: Response) {
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

    const { items } = req.body;

    await saveCartService(customerid, items);
    res.json({ message: "Cart saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save cart" });
  }
}



// export async function fetchCart(req: Request, res: Response) {
//   const token = req.headers.authorization?.split(' ')[1];
//   const data = decodeToken(token);
  
//   try {
//     let customerid = 0;
//     if (data && typeof data !== 'string') {
//     customerid = (data as JwtPayload).userid;
//     } 
//     else {
//     throw new Error('Invalid token payload');
//     }

//     const cart = await fetchCartService(customerid);
//     res.json(cart);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch cart" });
//   }
// }



export async function removeCartItem(req: Request, res: Response) {
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

    const bookid = Number(req.params.bookid);

    await removeCartItemService(customerid, bookid);
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item" });
  }
}



export async function clearCartDB(req: Request, res: Response) {
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

    await clearCartDBService(customerid);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
}


export async function updateCartItemQuantityDB(req: Request, res: Response) {
  const token = req.headers.authorization?.split(" ")[1];
  const data = decodeToken(token);

  try {
    let customerid = 0;
    if (data && typeof data !== "string") {
      customerid = (data as JwtPayload).userid;
    } else {
      throw new Error("Invalid token payload");
    }

    const { bookid } = req.params;
    const { quantity } = req.body;

    await updateCartItemQuantityService(customerid, Number(bookid), quantity);

    res.json({ message: "Quantity updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart quantity" });
  }
}



export async function updateCartPurchase(req: Request, res: Response) {
  const token = req.headers.authorization?.split(" ")[1];
  const data = decodeToken(token);

  try {
    let customerid = 0;
    if (data && typeof data !== "string") {
      customerid = (data as JwtPayload).userid;
    } else {
      throw new Error("Invalid token payload");
    }

    const { items } = req.body; 
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to purchase" });
    }

    const result = await handleCartPurchase(customerid, items);

    res.status(201).json({
      message: "Cart purchased successfully",
      order: result,
    });
  } catch (error: any) {
    console.error("Error in updateCartPurchase:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to purchase cart" });
  }
}


export const fetchAllBuyerOrders = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = decodeToken(token);

  try {
    let customerid = 0;
    if (data && typeof data !== "string") {
      customerid = (data as JwtPayload).userid;
    } else {
      throw new Error("Invalid token payload");
    }

    const orders = await getAllBuyerOrders(customerid);

    return res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching buyer orders:", err);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};



export const postReviewBuyer = async (req: Request, res: Response) => {
  // console.log("in review controller", req.body);
  const token = req.headers.authorization?.split(" ")[1];
  const data = decodeToken(token);

  try {
    let customerid = 0;
    if (data && typeof data !== "string") {
      customerid = (data as JwtPayload).userid;
    } else {
      throw new Error("Invalid token payload");
    }
    const { bookId, description, rating } = req.body;

    if (!customerid) return res.status(401).json({ error: "Unauthorized" });

    const newReview = await createReview(customerid, bookId, description, rating);
    // console.log("in review controller", newReview);
    res.status(201).json(newReview);
  } catch (error: any) {
    console.error("Error posting review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const putReviewBuyer = async (req: Request, res: Response) => {
  // console.log("in review controller", req.body);
  const token = req.headers.authorization?.split(" ")[1];
  const data = decodeToken(token);

  try {
    let customerid = 0;
    if (data && typeof data !== "string") {
      customerid = (data as JwtPayload).userid;
    } else {
      throw new Error("Invalid token payload");
    }
    const { reviewid } = req.params;
    const { bookId, description, rating } = req.body;
    if (!customerid) return res.status(401).json({ error: "Unauthorized" });

    const updatedReview = await updateReview(bookId, customerid, Number(reviewid), description, rating);
    // console.log("in review controller", updatedReview);
    if (!updatedReview) return res.status(404).json({ error: "Review not found or not yours" });

    res.json(updatedReview);
  } catch (error: any) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getCartController = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  const data = decodeToken(token);

  try {
    let customerid = 0;
    if (data && typeof data !== "string") {
      customerid = (data as JwtPayload).userid;
    } else {
      throw new Error("Invalid token payload");
    }

    const cartItems = await getCartService(customerid);
    console.log(cartItems);
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};