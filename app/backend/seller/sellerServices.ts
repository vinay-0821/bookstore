import { db } from '../database.ts';
import bcrypt from "bcrypt";

export const fetchAllSellerBooks = async (
  sellerid: number,
  orderId?: string,
  buyer?: string,
  book?: string,
  sortBy: string = 'created_at',
  order: string = 'desc'
) => {
    const id = sellerid;
  let baseQuery = `
    SELECT 
      b.bookid, 
      b.author,
      b.title, 
      b.price, 
      b.date_publish, 
      u.email AS seller_email, 
      b.stock AS avaliableCount,
      GROUP_CONCAT(DISTINCT g.name) AS genre,
      IFNULL(SUM(oi.quantity), 0) AS soldCount
    FROM books b
    JOIN users u ON b.userid = u.userid
    LEFT JOIN bookgenre bg ON b.bookid = bg.bookid
    LEFT JOIN genre g ON bg.genreid = g.genreid
    LEFT JOIN order_item oi ON b.bookid = oi.bookid
    WHERE u.userid = ${id}
  `;

  const params: any[] = [];
  // console.log("this is genre filter",orderId);
  // console.log("this is seller filter",buyer);
  // console.log("this is title filter",book);

  if (orderId) {
    baseQuery += ` AND g.name LIKE ?`;
    params.push(`%${orderId}%`);
  }

  if (buyer) {
    baseQuery += ` AND u.email LIKE ?`;
    params.push(`%${buyer}%`);
  }

  if (book) {
    baseQuery += ` AND b.title LIKE ?`;
    params.push(`%${book}%`);
  }

  baseQuery += `
    GROUP BY 
      b.bookid, 
      b.title, 
      b.price, 
      b.date_publish, 
      u.email, 
      b.stock
  `;

  const validSortFields: Record<string, string> = {
    title: 'b.title',
    genre: 'genre',
    available: 'b.stock',
    sold: 'soldCount',
  };

  const sortField = validSortFields[sortBy] || 'b.title';
  const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  baseQuery += ` ORDER BY ${sortField} ${sortOrder}`;

  const [rows] = await (await db).query(baseQuery, params);
  return rows;
};



export const getSellerById = async (sellerId) => {
  const id = sellerId.userid;
  // console.log("Services in Id:", id);
  const [rows] = await (await db).query(
    "SELECT userid, name, email, phoneNo, address, date_of_birth FROM users WHERE userid = ?",
    [id]
  );
  console.log(rows);
  return rows[0];
};



export const updateSellerDetails = async (sellerId, { name, email, phone, address, dob }) => {
  const id = sellerId.userid;
  // console.log("Services in Id:", id);
  await (await db).query(
    "UPDATE users SET name = ?, email = ?, phoneNo = ?, address = ?, date_of_birth = ? WHERE userid = ?",
    [name, email, phone, address, dob, id]
  );
};


export const updateSellerPassword = async (sellerId, password) => {
  const id = sellerId.userid;
  const hashedPassword = await bcrypt.hash(password, 10);
  await (await db).query("UPDATE users SET password = ? WHERE userid = ?", [hashedPassword, id]);
};


export const getSellerTotalAmount = async (sellerId: number) => {
  const [[result]]: any = await (await db).execute(
    `
    SELECT IFNULL(SUM(oi.quantity * oi.price), 0) AS totalAmount
    FROM books b
    LEFT JOIN order_item oi ON b.bookid = oi.bookid
    WHERE b.userid = ?
    `,
    [sellerId]
  );
  return Number(result.totalAmount) || 0;
};

export const getSellerTotalBooksSold = async (sellerId: number) => {
  const [[result]]: any = await (await db).execute(
    `
    SELECT IFNULL(SUM(oi.quantity), 0) AS totalBooksSold
    FROM books b
    LEFT JOIN order_item oi ON b.bookid = oi.bookid
    WHERE b.userid = ?
    `,
    [sellerId]
  );
  return Number(result.totalBooksSold) || 0;
};

export const getSellerTopBook = async (sellerId: number) => {
  const [[result]]: any = await (await db).execute(
    `
    SELECT b.title
    FROM books b
    JOIN order_item oi ON b.bookid = oi.bookid
    WHERE b.userid = ?
    GROUP BY b.bookid
    ORDER BY SUM(oi.quantity) DESC
    LIMIT 1
    `,
    [sellerId]
  );
  return result?.title || "";
};

export const getSellerRating = async (sellerId: number) => {
  const [[result]]: any = await (await db).execute(
    `
    SELECT IFNULL(AVG(r.rating), 0) AS rating
    FROM books b
    LEFT JOIN review r ON b.bookid = r.bookid
    WHERE b.userid = ?
    `,
    [sellerId]
  );
  return Number(parseFloat(result.rating).toFixed(1)) || 0;
};



export const getRecentOrdersService = async (sellerId: number) => {
  const [orders] = await (await db).execute(
    `
    SELECT 
      o.orderid AS id,
      b.title AS book,
      u.email AS buyer,
      DATE_FORMAT(o.dateoforder, '%Y-%m-%d') AS date,
      oi.price * oi.quantity AS amount
    FROM orders o
    JOIN order_item oi ON o.orderid = oi.orderid
    JOIN books b ON oi.bookid = b.bookid
    JOIN users u ON o.userid = u.userid
    WHERE b.userid = ?
    ORDER BY o.dateoforder DESC
    LIMIT 5
    `,
    [sellerId]
  );

  return orders;
};


export const fetchAllSellerOrdersServices = async (
  sellerId: number,
  orderIdFilter?: string,
  buyerIdFilter?: string,
  bookFilter?: string,
  sortBy: string = "o.orderid",
  order: string = "ASC"
) => {
  let query = `
    SELECT 
      o.orderid AS id,
      b.title AS book,
      u.email AS buyer,
      DATE_FORMAT(o.dateoforder, '%Y-%m-%d') AS date,
      oi.price * oi.quantity AS amount
    FROM orders o
    JOIN order_item oi ON o.orderid = oi.orderid
    JOIN books b ON oi.bookid = b.bookid
    JOIN users u ON o.userid = u.userid
    WHERE b.userid = ?
  `;

  const params: any[] = [sellerId];

  if (orderIdFilter) {
    query += ` AND o.orderid LIKE ?`;
    params.push(`%${orderIdFilter}%`);
  }

  if (buyerIdFilter) {
    query += ` AND u.email LIKE ?`;
    params.push(`%${buyerIdFilter}%`);
  }

  if (bookFilter) {
    query += ` AND b.title LIKE ?`;
    params.push(`%${bookFilter}%`);
  }

  const sortMap: Record<string, string> = {
    id: "o.orderid",
    book: "b.title",
    buyer: "u.email",
    date: "o.dateoforder",
    amount: "amount",
  };

  const sortColumn = sortMap[sortBy] ?? sortMap.id;
  const sortOrder = order && order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  query += ` ORDER BY ${sortColumn} ${sortOrder}`;

  const [rows] = await (await db).execute(query, params);
  return rows;
};



export const fetchBookDetails = async (bookid: string) => {
  const [rows]: any = await (await db).query(
    `
    SELECT 
      b.bookid, 
      b.title, 
      b.author, 
      b.isbn,
      b.description,
      b.price, 
      b.date_publish,
      b.stock AS availableCount,
      u.userid AS seller_id,
      u.name AS seller_name,
      u.email AS seller_email,
      b.imageurl AS images,
      GROUP_CONCAT(DISTINCT g.name) AS genres,
      IFNULL(SUM(oi.quantity), 0) AS soldCount
    FROM books b
    JOIN users u ON b.userid = u.userid
    LEFT JOIN bookgenre bg ON b.bookid = bg.bookid
    LEFT JOIN genre g ON bg.genreid = g.genreid
    LEFT JOIN order_item oi ON b.bookid = oi.bookid
    WHERE b.bookid = ?
    GROUP BY b.bookid, b.title, b.author, b.description, b.price, b.date_publish, b.stock, u.userid, u.name, u.email
    `,
    [bookid]
  );

  return rows[0];
};



export const fetchBookReviews = async (bookid: string) => {
  const [rows]: any = await (await db).query(
    `SELECT r.reviewid, r.rating, r.review_description, u.name AS userName
     FROM review r
     JOIN users u ON r.userid = u.userid
     WHERE r.bookid = ?`,
    [bookid]
  );
  // console.log(rows);
  return rows;
};



export const getAllGenres = async (): Promise<string[]> => {
  const [rows] = await (await db).query("SELECT name FROM genre");
  return (rows as { name: string }[]).map((row) => row.name);
};


interface AddBookInput {
  title: string;
  author: string;
  isbn: string;
  price: number;
  description: string;
  stock: number;
  genre: string;
  image: string;
  sellerid: number;
}

export const addBook = async (book: AddBookInput) => {
  const conn = await db;
  try {
    await conn.beginTransaction();

    // console.log(book);

    const [result]: any = await conn.query(
      `INSERT INTO books (title, author, isbn, price, description, stock, imageurl, userid) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        book.title,
        book.author,
        book.isbn,
        book.price,
        book.description,
        book.stock,
        book.image,
        book.sellerid,
      ]
    );

    const bookId = result.insertId;

    const [genreRows]: any = await conn.query(
      `SELECT genreid FROM genre WHERE name = ? LIMIT 1`,
      [book.genre]
    );

    if (genreRows.length === 0) {
      throw new Error(`Genre ${book.genre} not found`);
    }

    const genreId = genreRows[0].genreid;

    await conn.query(
      `INSERT INTO bookgenre (bookid, genreid) VALUES (?, ?)` ,
      [bookId, genreId]
    );

    await conn.commit();
    return { id: bookId, ...book };
  } catch (err) {
    await (await db).rollback();
    throw err;
  } finally {
    console.log("Finished adding book!!");
  }
};



interface UpdateBookInput {
  bookid: number | string;
  title: string;
  author: string;
  isbn: string;
  price: number;
  description: string;
  stock: number;
  genre: string;
  image: string;
  sellerid: number;
}


export const updateBookService = async (bookx: UpdateBookInput) => {

  const [bookRows] = await (await db).query(
    "SELECT * FROM books WHERE bookid = ? AND userid = ?", 
    [bookx.bookid, bookx.sellerid]
  );

  const book = bookRows[0];
  if (!book) throw new Error("Book not found or not authorized");

  await (await db).query(
    `UPDATE books 
     SET title=?, author=?, isbn=?, price=?, description=?, stock=? 
     WHERE bookid=?`,
    [bookx.title, bookx.author, bookx.isbn, bookx.price, bookx.description, bookx.stock, bookx.bookid]
  );

  if (bookx.genre && Array.isArray(bookx.genre)) {
    await (await db).query("DELETE FROM bookgenre WHERE bookid = ?", [bookx.bookid]);

    for (const genreId of bookx.genre) {
      await (await db).query(
        "INSERT INTO bookgenre (bookid, genreid) VALUES (?, ?)",
        [bookx.bookid, genreId]
      );
    }
  }

  const [updatedBookRows] = await (await db).query("SELECT * FROM books WHERE bookid = ?", [bookx.bookid]);
  return updatedBookRows[0];
};




export const deleteBookService = async (bookid: string | number, sellerId: number) => {
  const [book] = await (await db).query("SELECT * FROM books WHERE bookid = ? AND userid = ?", [bookid, sellerId]);
  if (!book) throw new Error("Book not found or not authorized");

  await (await db).query("DELETE FROM books WHERE bookid = ?", [bookid]);
  return { bookid };
};