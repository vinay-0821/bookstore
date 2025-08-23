import type { Request, Response } from 'express';
import { validateUser, generateToken, findUserByEmail, insertUser, verifyToken, updateUserPassword } from './authServices.ts';


export async function login(req: Request, res: Response) {
  // console.log(req);
  const { email, password } = req.body;

  const user = await validateUser(email, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user);
  return res.json({ user, token });
}

export async function signup(req: Request, res: Response) {
    console.log("signup  controller");
  try {
    console.log("Signup request body:", req.body);
    const { username, email, password, role, mobile, address} = req.body;

    const checkUser = await findUserByEmail(email);
    if (checkUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await insertUser(username, email, password, role, mobile, address);

    if (!newUser) {
        return res.status(500).json({ message: 'User could not be created' });
    }

    return res.status(201).json({ message: 'Signup successful', user: newUser });
  } 
  catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}



export async function verify(req: Request, res: Response) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false, message: 'Invalid token format' });
  }

  const result = verifyToken(token);

  if (!result.valid) {
    return res.status(401).json(result);
  }

  return res.json(result);
}


export async function getSellerByEmail(req: Request, res: Response) {
  try {
    const { email } = req.params;

    // console.log(email);

    const seller = await findUserByEmail(email);

    // console.log("controeller", seller);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json(seller);
  } catch (err) {
    console.error("Error fetching seller:", err);
    res.status(500).json({ message: "Server error" });
  }
}


export async function forgotPasswordController(req: Request, res: Response) {
  const { email, password } = req.body;

  // console.log("controller", email,  password);

  try {
    const result = await updateUserPassword(email, password);
    // console.log(result);
    res.json(result);
  } catch (err: any) {
    console.error("Error in forgot password:", err.message);
    res.status(err.message === "Email does not exist" ? 404 : 500).json({
      message: err.message || "Server error",
    });
  }
}