import { db } from '../database.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { User } from '../types.ts';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


interface User {
  userid: number;
  password: string;
  role: string;
  name: string;
  email: string;
  phoneNo: string;
  address?: string;
  date_of_birth?: Date; 
  join_date?: Date;     
}

interface UserToken {
  userid: number;
  role: string;
  email: string;  
}


export async function findUserByEmail(email: string): Promise<User | null> {
  const [rows]: any = await (await db).query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (user && await bcrypt.compare(password, user.password)) {
    const { password, ...safeUser } = user;
    return safeUser as User;
  }
  return null;
}

export function generateToken(user: UserToken): string {
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export async function insertUser(username: string, email: string, password: string, role: string, mobile: string, address: string): Promise<User | null> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await (await db).query(
      'INSERT INTO users (name, email, password, role, phoneNo, address) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role, mobile, address]
    );

    const newUser: User = {
      userid: result.insertId,
      name: username,
      email,
      password: '',
      role: role,
      phoneNo: mobile,
      address: address
    };

    return newUser;
  } 
  catch (error) {
    console.error('Error inserting user:', error);
    return null;
  }
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (err) {
    return { valid: false, message: 'Token is invalid or expired' };
  }
}