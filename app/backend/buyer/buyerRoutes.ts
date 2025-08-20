import express from 'express';
import { isBuyer, verifyToken } from '../utils/middleware.ts';
import { changeBuyerPassword, fetchAllBooksBuyer, fetchGenresBuyer, getBookDetailsBuyer, getBookReviewsBuyer, getBuyerStats, getProfileDetailsBuyer, updateBuyerProfileDetails } from './buyerController.ts';


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

export default router;