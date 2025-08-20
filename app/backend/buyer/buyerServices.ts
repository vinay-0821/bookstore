import { db } from '../database.ts';
import bcrypt from "bcrypt";


export const getAllBooksBuyer = async () => {
    const [rows] = await (await db).query(
      `
      SELECT 
        b.bookid,
        b.title,
        b.author,
        b.isbn,
        b.description,
        b.price,
        b.date_publish,
        b.stock as avaliableCount,
        b.imageurl as images,
        s.userid as seller_id,
        s.name AS seller_name,
        s.email AS seller_email,
        GROUP_CONCAT(DISTINCT g.name) AS genres,
        AVG(r.rating) AS rating
      FROM books b
      JOIN users s ON b.userid = s.userid
      LEFT JOIN bookgenre bg ON b.bookid = bg.bookid
      JOIN genre g ON bg.genreid = g.genreid
      LEFT JOIN review r ON b.bookid = r.bookid
      GROUP BY b.bookid
      ORDER BY b.date_publish DESC
      `
    );

    // console.log("Services Buyer: ", rows);

    return (rows as any[]).map((row) => {
    const ratingNum = row.rating !== null && row.rating !== undefined 
        ? Number(row.rating) 
        : null;

    return {
        bookid: row.bookid,
        title: row.title,
        author: row.author,
        isbn: row.isbn,
        description: row.description,
        price: row.price,
        date_publish: row.date_publish,
        availableCount: row.availableCount,
        seller_id: row.seller_id,
        seller_name: row.seller_name,
        seller_email: row.seller_email,
        genres: row.genres,
        images: row.images ? row.images.split(",") : [],
        rating: ratingNum !== null ? parseFloat(ratingNum.toFixed(1)) : null,
    };
    });
};



export const getAllGenres = async (): Promise<string[]> => {
  const [rows] = await (await db).query("SELECT name FROM genre");
  console.log(rows);
  return (rows as { name: string }[]).map((row) => row.name);
};



export const fetchBookDetailsBuyer = async (bookid: string) => {
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



export const fetchBookReviewsBuyer = async (bookid: string) => {
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



export const getBuyerById = async (customerId) => {
  const id = customerId.userid;
  // console.log("Services in Id:", id);
  const [rows] = await (await db).query(
    "SELECT userid, name, email, phoneNo, address, date_of_birth FROM users WHERE userid = ?",
    [id]
  );
  console.log(rows);
  return rows[0];
};



export const updateBuyerDetails = async (customerId, { name, email, phone, address, dob }) => {
  const id = customerId.userid;
  // console.log("Services in Id:", id);
  await (await db).query(
    "UPDATE users SET name = ?, email = ?, phoneNo = ?, address = ?, date_of_birth = ? WHERE userid = ?",
    [name, email, phone, address, dob, id]
  );
};



export const updateBuyerPassword = async (customerId, password) => {
  const id = customerId.userid;
  const hashedPassword = await bcrypt.hash(password, 10);
  await (await db).query("UPDATE users SET password = ? WHERE userid = ?", [hashedPassword, id]);
};



export async function fetchBuyerStats(userId: number) {
  const [booksOwnedResult] = await (await db).execute(
    `SELECT 
        COUNT(DISTINCT oi.bookid) AS booksOwned
    FROM orders o
    JOIN order_item oi ON o.orderid = oi.orderid
    WHERE o.userid = ?;`,
    [userId]
  );

  const [moneySpentResult] = await (await db).execute(
    `SELECT IFNULL(SUM(total_amount), 0) as moneySpent FROM orders WHERE userid = ?`,
    [userId]
  );

  return {
    booksOwned: (booksOwnedResult as any[])[0].booksOwned || 0,
    moneySpent: (moneySpentResult as any[])[0].moneySpent || 0,
  };
}