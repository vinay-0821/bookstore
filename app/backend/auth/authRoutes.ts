import express from 'express';
import { changepassword, login, signup, verify } from './authController.ts';

const router = express.Router();
// console.log("authroutes");
router.post('/login', login);
router.post('/signup', signup);
router.post('/passwordchange', changepassword);
router.post('/auth/verify', verify);

export default router;
