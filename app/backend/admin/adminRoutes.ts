import express from 'express';
import { changeAdminPassword, getAdminProfile, getAllBooks, getAllCustomers, getAllSellers, getBookDetails, getBookReviews, getPendingSellers, getTopBooks, getTopCustomers, getTopSellers, handleSeller, updateAdminProfile } from './adminController.ts';
import { verifyToken, isAdmin } from '../utils/middleware.ts';

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get('/books', getAllBooks);

router.get('/customers', getAllCustomers);

router.get('/sellers', getAllSellers);

router.get('/dashboard/topcustomers', getTopCustomers);

router.get('/dashboard/topsellers', getTopSellers);

router.get('/dashboard/topbooks', getTopBooks);

router.get('/sellers/pending', getPendingSellers);

router.post('/sellers/decision/:id', handleSeller);

router.get("/profile", getAdminProfile);

router.put("/profile", updateAdminProfile);

router.put("/password", changeAdminPassword);

router.get("/books/:bookid", getBookDetails);

router.get("/books/:bookid/reviews", getBookReviews);


export default router;
