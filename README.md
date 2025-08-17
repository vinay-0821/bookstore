# Online Bookstore

A full-stack web application for managing an online bookstore.  
This project is divided into two main parts: **Frontend (React + TypeScript)** and **Backend (Node.js + Express + MySQL)**.

---

## Features

- User Authentication (JWT-based login/signup for Customers & Sellers)
- Role-based Dashboards (Admin, Seller, Customer)
- Book Management (Add, Edit, Delete, View Books)
- Genre Management
- Admin Controls (Seller approvals, user stats, book stats)
- Responsive UI built with React & Redux

---

## Project Structure

```
app/
│── bookstore/    # Frontend (React + TypeScript)
│── backend/      # Backend (Node.js + Express + MySQL)
```

---

## Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone 
cd ./app
```

### 2️⃣ Run the Frontend
```bash
cd ./bookstore
npm install
npm start
```
Frontend will be running on: **http://localhost:3000**

### 3️⃣ Run the Backend
```bash
cd backend
node --experimental-transform-types server.ts
```
Backend will be running on: **http://localhost:5000**

---

## Tech Stack

- **Frontend:** React, TypeScript, Redux, React Router, Bootstrap
- **Backend:** Node.js, Express, JWT, MySQL
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT)

---

## 📌 Notes

- Make sure MySQL server is running before starting the backend.
- Create a `.env` file in the backend folder with required configurations (DB connection, JWT secret, etc.).
- Use two separate terminals: one for frontend and one for backend.

