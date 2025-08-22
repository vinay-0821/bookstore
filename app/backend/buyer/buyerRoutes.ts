import express from 'express';
import { isBuyer, verifyToken } from '../utils/middleware.ts';
import { changeBuyerPassword, clearCartDB, fetchAllBooksBuyer, fetchAllBuyerOrders, fetchCart, fetchGenresBuyer, getBookDetailsBuyer, getBookReviewsBuyer, getBuyerStats, getProfileDetailsBuyer, postReviewBuyer, putReviewBuyer, removeCartItem, saveCart, updateBuyerProfileDetails, updateCartItemQuantityDB, updateCartPurchase, updatePurchase } from './buyerController.ts';


const router = express.Router();

router.use(verifyToken, isBuyer);

router.get('/books', fetchAllBooksBuyer);

router.get('/genres', fetchGenresBuyer);

router.get("/books/:bookid", getBookDetailsBuyer);

router.get("/books/:bookid/reviews", getBookReviewsBuyer);

router.get('/profile', getProfileDetailsBuyer);

router.put('/profile', updateBuyerProfileDetails);

router.put('/password', changeBuyerPassword);

router.get('/stats', getBuyerStats);

router.post('/purchase', updatePurchase);

router.post("/cart/save", saveCart);

router.get("/cart", fetchCart);

router.delete("/cart/:bookid", removeCartItem);

router.delete("/cart", clearCartDB);

router.put('/cart/:bookid', updateCartItemQuantityDB);

router.post('/cart/purchasecart', updateCartPurchase);

router.get('/orders/buyer', fetchAllBuyerOrders);

router.post('/reviews', postReviewBuyer);

router.put('/reviews/:reviewid', putReviewBuyer);

export default router;