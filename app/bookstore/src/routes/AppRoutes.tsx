import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminDashboard from '../admin/AdminDashboard'
import Login from '../auth/Login'
import SignUp from '../auth/SignUp'
import PrivateRoute from './PrivateRoute'
import Home from '../components/Home'
import SellerApprovalPage from '../admin/SellerApprovalPage'
import AdminCustomers from '../admin/AdminCustomers'
import AdminSellers from '../admin/AdminSellers'
import AdminBooks from '../admin/AdminBooks'
import AdminProfile from '../admin/AdminProfile'
// import SellerNavbar from '../seller/SellerNavbar'
import SellerProfile from '../seller/SellerProfile'
import SellerDashboard from '../seller/SellerDashboard'
import SellerBooks from '../seller/SellerBook'
import SellerOrders from '../seller/SellersOrders'
import BookDetailsPage from '../components/BookDetailsPage'
import SellerBookDetailsPage from '../seller/SellerBookDetailsPage'
import SellerAddBook from '../seller/SellerAddBook'

export default function AppRoutes() {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/approvesellers" element={<PrivateRoute allowedRoles={['admin']}><SellerApprovalPage /></PrivateRoute>} />
        <Route path="/admin/customers" element={<PrivateRoute allowedRoles={['admin']}><AdminCustomers /></PrivateRoute>} />
        <Route path="/admin/sellers" element={<PrivateRoute allowedRoles={['admin']}><AdminSellers /></PrivateRoute>} />
        <Route path="/admin/books" element={<PrivateRoute allowedRoles={['admin']}><AdminBooks /></PrivateRoute>} />
        <Route path="/admin/profile" element={<PrivateRoute allowedRoles={['admin']}><AdminProfile /></PrivateRoute>} />
        <Route path="/admin/books/:bookid" element={<PrivateRoute allowedRoles={['admin']}><BookDetailsPage /></PrivateRoute>} />
        <Route path="/seller/dashboard" element={<PrivateRoute allowedRoles={['seller']}><SellerDashboard /></PrivateRoute>} />
        <Route path="/seller/profile" element={<PrivateRoute allowedRoles={['seller']}><SellerProfile /></PrivateRoute>} />
        <Route path="/seller/mybooks" element={<PrivateRoute allowedRoles={['seller']}><SellerBooks /></PrivateRoute>} />
        <Route path="/seller/orders" element={<PrivateRoute allowedRoles={['seller']}><SellerOrders /></PrivateRoute>} />
        <Route path="/seller/mybooks/:bookid" element={<PrivateRoute allowedRoles={['seller']}><SellerBookDetailsPage /></PrivateRoute>} />
        <Route path="/seller/addbook" element={<PrivateRoute allowedRoles={['seller']}><SellerAddBook /></PrivateRoute>} />
        {/* <Route path="/sellerhome" element={<SellerNavbar />} /> */}
    </Routes>
  )
}
