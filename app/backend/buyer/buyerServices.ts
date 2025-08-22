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
        b.stock as availableCount,
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

        console.log(row.availableCount);
        console.log(typeof row.availableCount);

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



export async function handlePurchase(
  userId: number,
  bookId: number,
  quantity: number,
  totalAmount: number
) {
  const conn = await db;
  try {
    await conn.beginTransaction();

    const [book] = await conn.query("SELECT stock, price FROM books WHERE bookid = ?", [bookId]);
    if (!Array.isArray(book) || book.length === 0) {
      throw new Error("Book not found");
    }

    const currentStock = (book as any)[0].stock;
    const bookPrice = (book as any)[0].price;

    if (currentStock < quantity) {
      throw new Error("Not enough stock available");
    }

    await conn.query("UPDATE books SET stock = stock - ? WHERE bookid = ?", [quantity, bookId]);

    const [orderResult]: any = await conn.query(
      "INSERT INTO orders (userid, total_amount) VALUES (?, ?)",
      [userId, totalAmount]
    );
    const orderId = orderResult.insertId;

    await conn.query(
      "INSERT INTO order_item (orderid, bookid, quantity, price) VALUES (?, ?, ?, ?)",
      [orderId, bookId, quantity, bookPrice]
    );

    await conn.commit();

    return { orderId, bookId, quantity, totalAmount };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    console.log("Purchase Completed");
  }
}


export interface CartItem {
  bookid: number;
  title: string;
  price: number;
  quantity: number;
}

async function getOrCreateCart(userId: number) {
  const conn = await db;

  const [rows]: any = await conn.query(
    "SELECT cartid FROM cart WHERE userid = ?",
    [userId]
  );

  if (rows.length > 0) {
    return rows[0].cartid;
  }

  const [result]: any = await conn.query(
    "INSERT INTO cart (userid) VALUES (?)",
    [userId]
  );
  return result.insertId;
}

export async function saveCartService(userId: number, items: CartItem[]) {
  const conn = await db;

  let cartId = await getOrCreateCart(userId);

  for (const item of items) {
    const [itemRows]: any = await conn.query(
      "SELECT * FROM cartitem WHERE cartid = ? AND bookid = ?",
      [cartId, item.bookid]
    );

    if (itemRows.length > 0) {
      await conn.query(
        "UPDATE cartitem SET quantity = quantity + ? WHERE cartid = ? AND bookid = ?",
        [item.quantity, cartId, item.bookid]
      );
    } else {
      await conn.query(
        "INSERT INTO cartitem (cartid, bookid, quantity) VALUES (?, ?, ?)",
        [cartId, item.bookid, item.quantity]
      );
    }
  }
}



export async function fetchCartService(userId: number) {
  const [rows] = await (await db).query(
    `SELECT ci.bookid, b.title, b.price, ci.quantity
     FROM cartitem ci
     JOIN cart c ON ci.cartid = c.cartid
     JOIN books b ON ci.bookid = b.bookid
     WHERE c.userid = ?`,
    [userId]
  );
  return rows;
}

export async function removeCartItemService(userId: number, bookid: number) {
  const conn = await db;
  try {
    await conn.beginTransaction();

    await conn.query(
      `DELETE ci FROM cartitem ci
       JOIN cart c ON ci.cartid = c.cartid
       WHERE c.userid = ? AND ci.bookid = ?`,
      [userId, bookid]
    );

    await conn.query(
      `DELETE c FROM cart c
       LEFT JOIN cartitem ci ON c.cartid = ci.cartid
       WHERE c.userid = ? AND ci.cartid IS NULL`,
      [userId]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  }
}


export async function clearCartDBService(userId: number) {
  await (await db).query(
    `DELETE ci FROM cartitem ci
     JOIN cart c ON ci.cartid = c.cartid
     WHERE c.userid = ?`,
    [userId]
  );
}


export async function updateCartItemQuantityService(userId: number, bookid: number, quantity: number) {
  const conn = await db;

  await conn.query(
    `UPDATE cartitem ci
     JOIN cart c ON ci.cartid = c.cartid
     SET ci.quantity = ?
     WHERE c.userid = ? AND ci.bookid = ?`,
    [quantity, userId, bookid]
  );
}



export async function handleCartPurchase(
  userId: number,
  items: { bookid: number; quantity: number }[]
) {
  const conn = await db;

  try {
    await conn.beginTransaction();

    let totalAmount = 0;

    for (const item of items) {
      const [book]: any = await conn.query(
        "SELECT stock, price FROM books WHERE bookid = ?",
        [item.bookid]
      );

      if (!book || book.length === 0) {
        throw new Error(`Book with id ${item.bookid} not found`);
      }

      const currentStock = book[0].stock;
      const bookPrice = book[0].price;

      if (currentStock < item.quantity) {
        throw new Error(
          `Not enough stock for bookid ${item.bookid}. Available: ${currentStock}, Required: ${item.quantity}`
        );
      }

      totalAmount += bookPrice * item.quantity;
    }

    const [orderResult]: any = await conn.query(
      "INSERT INTO orders (userid, total_amount) VALUES (?, ?)",
      [userId, totalAmount]
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      const [book]: any = await conn.query(
        "SELECT price FROM books WHERE bookid = ?",
        [item.bookid]
      );
      const bookPrice = book[0].price;

      await conn.query(
        "INSERT INTO order_item (orderid, bookid, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.bookid, item.quantity, bookPrice]
      );

      await conn.query(
        "UPDATE books SET stock = stock - ? WHERE bookid = ?",
        [item.quantity, item.bookid]
      );
    }

    await conn.query(
      `DELETE ci FROM cartitem ci
       JOIN cart c ON ci.cartid = c.cartid
       WHERE c.userid = ?`,
      [userId]
    );

    await conn.commit();

    return { orderId, totalAmount, items };
  } catch (err) {
    await conn.rollback();
    throw err;
  }
}



export const getAllBuyerOrders = async (buyerId: number) => {
  const [orders]: any = await (await db).query(
    `SELECT o.orderid, o.dateoforder, o.total_amount
     FROM orders o
     WHERE o.userid = ?
     ORDER BY o.dateoforder DESC`,
    [buyerId]
  );

  for (let order of orders) {
    const [items]: any = await (await db).query(
      `SELECT 
          oi.orderitemid, 
          oi.quantity, 
          oi.price, 
          b.bookid, 
          b.title, 
          b.author, 
          b.imageurl,
          r.reviewid,
          r.review_description AS review_description,
          r.rating AS review_rating,
          r.review_date
       FROM order_item oi
       JOIN books b 
         ON oi.bookid = b.bookid
       LEFT JOIN review r 
         ON r.bookid = b.bookid 
        AND r.userid = ?   
       WHERE oi.orderid = ?`,
      [buyerId, order.orderid]
    );

    order.items = items;
  }

  return orders;
};



export const createReview = async (
  userid: number,
  bookid: number,
  review_description: string,
  rating: number
) => {
    // console.log(bookid,userid,review_description, rating);
  const [result]: any = await (await db).query(
    `INSERT INTO review (userid, bookid, review_description, rating)
     VALUES (?, ?, ?, ?)`,
    [userid, bookid, review_description, rating]
  );

  // console.log(result);

  return {
    reviewid: result.insertId,
    userid,
    bookid,
    review_description,
    rating,
  };
};



export const updateReview = async (
  bookid: number,
  userid: number,
  reviewid: number,
  review_description: string,
  rating: number
) => {
  // console.log(bookid,userid,review_description,reviewid, rating);
  const [result]: any = await (await db).query(
    `UPDATE review
     SET review_description = ?, rating = ?
     WHERE reviewid = ? AND userid = ? AND bookid = ?`,
    [review_description, rating, reviewid, userid, bookid]
  );
  // console.log(result);

  if (result.affectedRows === 0) return null;

  return {
    reviewid,
    userid,
    review_description,
    rating,
  };
};