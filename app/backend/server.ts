import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './auth/authRoutes.ts';
import adminRoutes from './admin/adminRoutes.ts';
import sellerRoutes from './seller/sellerRoutes.ts';  
import buyerRoutes from './buyer/buyerRoutes.ts';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
// console.log("server.ts");
app.use(authRoutes);
app.use('/admin',adminRoutes);
app.use('/seller',sellerRoutes);
app.use('/api', buyerRoutes);

// app.get('/test', (req, res) => {
//   res.send('Backend is working!');
// });

app.listen(5000, () => {
  console.log("Sever is running on 'http://localhost:5000'");
});

