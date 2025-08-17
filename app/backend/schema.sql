DROP DATABASE IF EXISTS bookstore;
CREATE DATABASE bookstore;
USE bookstore;

-- USERS
CREATE TABLE users (
  userid INT PRIMARY KEY AUTO_INCREMENT,
  password VARCHAR(255) NOT NULL,
  role ENUM('buyer', 'admin', 'seller'),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phoneNo VARCHAR(20),
  address VARCHAR(255),
  date_of_birth DATE,
  join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  isapproved BOOLEAN DEFAULT False
);

-- BOOKS
CREATE TABLE books (
  bookid INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  userid INT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  date_publish DATE,
  FOREIGN KEY (userid) REFERENCES users(userid)
);

-- GENRES
CREATE TABLE genre (
  genreid INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

-- BOOK-GENRE RELATIONSHIP
CREATE TABLE bookgenre (
  bookgenreid INT PRIMARY KEY AUTO_INCREMENT,
  bookid INT,
  genreid INT,
  FOREIGN KEY (bookid) REFERENCES books(bookid),
  FOREIGN KEY (genreid) REFERENCES genre(genreid)
);

-- CART
CREATE TABLE cart (
  cartid INT PRIMARY KEY AUTO_INCREMENT,
  userid INT,
  FOREIGN KEY (userid) REFERENCES users(userid)
);

-- CART ITEM
CREATE TABLE cartitem (
  cartitemid INT PRIMARY KEY AUTO_INCREMENT,
  cartid INT,
  bookid INT,
  quantity INT,
  FOREIGN KEY (cartid) REFERENCES cart(cartid),
  FOREIGN KEY (bookid) REFERENCES books(bookid)
);

-- ORDERS
CREATE TABLE orders (
  orderid INT PRIMARY KEY AUTO_INCREMENT,
  userid INT,
  date DATE DEFAULT CURRENT_DATE,
  total_amount DECIMAL(10,2),
  FOREIGN KEY (userid) REFERENCES users(userid)
);

-- ORDER ITEMS
CREATE TABLE order_item (
  orderitemid INT PRIMARY KEY AUTO_INCREMENT,
  orderid INT,
  bookid INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (orderid) REFERENCES orders(orderid),
  FOREIGN KEY (bookid) REFERENCES books(bookid)
);

-- REVIEWS
CREATE TABLE review (
  reviewid INT PRIMARY KEY AUTO_INCREMENT,
  userid INT,
  bookid INT,
  rating DECIMAL(2,1),
  review_description TEXT,
  review_date DATE,
  FOREIGN KEY (userid) REFERENCES users(userid),
  FOREIGN KEY (bookid) REFERENCES books(bookid)
);
