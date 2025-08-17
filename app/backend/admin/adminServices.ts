import { db } from '../database.ts';
import bcrypt from "bcrypt";

export const fetchAllBooks = async (
  genre?: string,
  seller?: string,
  title?: string,
  sortBy: string = 'created_at',
  order: string = 'desc'
) => {
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
    JOIN Users u ON b.userid = u.userid
    LEFT JOIN bookgenre bg ON b.bookid = bg.bookid
    LEFT JOIN genre g ON bg.genreid = g.genreid
    LEFT JOIN order_item oi ON b.bookid = oi.bookid
    WHERE 1 = 1
  `;

  const params: any[] = [];

  // console.log("this is genre filter",genre);
  // console.log("this is seller filter",seller);
  // console.log("this is title filter",title);

  if (genre) {
    baseQuery += ` AND g.name LIKE ?`;
    params.push(`%${genre}%`);
  }

  if (seller) {
    baseQuery += ` AND u.email LIKE ?`;
    params.push(`%${seller}%`);
  }

  if (title) {
    baseQuery += ` AND b.title LIKE ?`;
    params.push(`%${title}%`);
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
  // console.log("returned query data: ", rows);
  return rows;
};


export const fetchAllCustomers = async (
  sortBy: string = 'name',
  order: string = 'asc',
  search: string = ''
) => {
  const validSortFields: Record<string, string> = {
    name: 'u.name',
    email: 'u.email',
    regdate: 'u.join_date',
    amount: 'amount_spent',
  };

  const sortField = validSortFields[sortBy] || 'u.name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let query = `
    SELECT 
      u.userid,
      u.name,
      u.email,
      u.phoneNo,
      u.join_date,
      IFNULL(SUM(o.total_amount), 0) AS amount_spent
    FROM Users u
    LEFT JOIN orders o ON u.userid = o.userid
    WHERE u.role = 'customer'
  `;

  const params: any[] = [];

  if (search) {
    query += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += `
    GROUP BY u.userid
    ORDER BY ${sortField} ${sortOrder}
  `;

  const [rows] = await (await db).query(query, params);
  return rows;
};



export const fetchAllSellers = async (
  sortBy: string = 'name',
  order: string = 'asc',
  search: string = ''
) => {
  const validSortFields: Record<string, string> = {
    name: 'u.name',
    email: 'u.email',
    regdate: 'u.join_date',
    amount: 'amount_received',
  };

  const sortField = validSortFields[sortBy] || 'u.name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let query = `
    SELECT 
      u.userid,
      u.name,
      u.email,
      u.phoneNo,
      u.join_date,
      IFNULL(SUM(oi.quantity * oi.price), 0) AS amount_received
    FROM Users u
    LEFT JOIN books b ON b.userid = u.userid
    LEFT JOIN order_item oi ON oi.bookid = b.bookid
    WHERE u.role = 'seller'
  `;

  const params: any[] = [];

  if (search) {
    query += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += `
    GROUP BY u.userid
    ORDER BY ${sortField} ${sortOrder}
  `;

  const [rows] = await (await db).query(query, params);
  return rows;
};

export const fetchTopCustomers = async () => {
  const query = `
    SELECT u.name, u.email, SUM(o.total_amount) AS spent
    FROM users u
    JOIN orders o ON u.userid = o.userid
    WHERE u.role = 'customer'
    GROUP BY u.userid
    ORDER BY spent DESC
    LIMIT 10
  `;
  const [rows] = await (await db).query(query);
  return rows;
};


export const fetchTopSellers = async () => {
  const query = `
    SELECT u.name, u.email, SUM(oi.price * oi.quantity) AS revenue
    FROM users u
    JOIN books b ON u.userid = b.userid
    JOIN order_item oi ON b.bookid = oi.bookid
    JOIN orders o ON o.orderid = oi.orderid
    WHERE u.role = 'seller'
    GROUP BY u.userid
    ORDER BY revenue DESC
    LIMIT 10
  `;
  const [rows] = await (await db).query(query);
  return rows;
};


export const fetchTopBooks = async () => {
  const query = `
    SELECT b.title, b.author, SUM(oi.quantity) AS copiesSold
    FROM books b
    JOIN order_item oi ON b.bookid = oi.bookid
    GROUP BY b.bookid
    ORDER BY copiesSold DESC
    LIMIT 10
  `;
  const [rows] = await (await db).query(query);
  return rows;
};


export const fetchPendingSellers = async () => {
  
    const [rows] = await (await db).query(
      `SELECT userid AS id, name, email, phoneNo, address, date_of_birth, join_date
      FROM Users
      WHERE role = 'seller' AND isapproved = 0`
    );
    
    return rows;
};


export const updateSellerStatus = async (
  id: number,
  action: "approve" | "reject"
) => {
  if (action === "approve") {
    await (await db).query(
      "UPDATE Users SET isapproved = 1 WHERE userid = ? AND role = 'seller'",
      [id]
    );
    return 1; 
  } else {
    await (await db).query(
      "DELETE FROM Users WHERE userid = ? AND role = 'seller'",
      [id]
    );
    return 0; 
  }
};


export const getAdminById = async (adminId) => {
  const id = adminId.userid;
  // console.log("Services in Id:", id);
  const [rows] = await (await db).query(
    "SELECT userid, name, email, phoneNo, address, date_of_birth FROM users WHERE userid = ?",
    [id]
  );
  // console.log(rows);
  return rows[0];
};

export const updateAdminDetails = async (adminId, { name, email, phone, address, dob }) => {
  const id = adminId.userid;
  // console.log("Services in Id:", id);
  await (await db).query(
    "UPDATE users SET name = ?, email = ?, phoneNo = ?, address = ?, date_of_birth = ? WHERE userid = ?",
    [name, email, phone, address, dob, id]
  );
};

export const updateAdminPassword = async (adminId, password) => {
  const id = adminId.userid;
  const hashedPassword = await bcrypt.hash(password, 10);
  await (await db).query("UPDATE users SET password = ? WHERE userid = ?", [hashedPassword, id]);
};



export const fetchBookDetails = async (bookid: string) => {
  const [rows]: any = await (await db).query(
    `
    SELECT 
      b.bookid, 
      b.title, 
      b.author, 
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
