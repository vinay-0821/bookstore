import express from 'express';
import multer from "multer";
import { isSeller, verifyToken } from '../utils/middleware.ts';
import { addNewBook, changeSellerPassword, deleteBookController, fetchGenres, fetchSellerAllOrders, getAllSellerBooks, getBookDetails, getBookReviews, getRecentOrdersController, getSellerProfile,  sellerRatingController,  sellerTopBookController,  sellerTotalAmountController,  sellerTotalBooksController,  updateBookController,  updateSellerProfile } from './sellerController.ts';


const router = express.Router();

router.use(verifyToken, isSeller);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get('/mybooks', getAllSellerBooks);

router.get('/profile', getSellerProfile);

router.put('/profile', updateSellerProfile);

router.put('/password', changeSellerPassword);

router.get("/dashboard/totalamount", sellerTotalAmountController);

router.get("/dashboard/totalbooks", sellerTotalBooksController);

router.get("/dashboard/topbook", sellerTopBookController);

router.get("/dashboard/rating", sellerRatingController)

router.get('/orders/recent', getRecentOrdersController);

router.get('/orders', fetchSellerAllOrders);

router.get("/mybooks/:bookid", getBookDetails);

router.get("/mybooks/:bookid/reviews", getBookReviews);

router.get("/genres", fetchGenres);

router.post("/addbook", upload.single("image"), addNewBook);

router.put("/mybooks/:bookid", upload.single("image"), updateBookController);

router.delete("/mybooks/:bookid", deleteBookController);

export default router;