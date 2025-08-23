import express from 'express';
import { forgotPasswordController, getSellerByEmail, login, signup, verify } from './authController.ts';
import { findUserByEmail } from './authServices.ts';

const router = express.Router();
// console.log("authroutes");
router.post('/login', login);
router.post('/signup', signup);
router.post('/forgot-password', forgotPasswordController);
router.post('/auth/verify', verify);
router.get('/getapprove/:email', getSellerByEmail);

export default router;
