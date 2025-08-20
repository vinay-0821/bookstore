interface Book {
  bookid: number;
  title: string;
  author: string;
  isbn: number | string;
  description: string;
  price: string; 
  date_publish: string;
  availableCount: number;
  seller_id: number;
  seller_name: string;
  seller_email: string;
  genres: string;
  images?: string[];
  rating?: number; 
}


export type BuyerProfile = {
  id: number;
  name: string;
  businessName: string;
  email: string;
  phoneNo: string; 
  address: string; 
  date_of_birth: string;
  bio: string;
  profilePicture: string;
  joined: string;
  booksOwned: number;
  moneySpent: number;
};



const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};



export const fetchBooksBuyer = async (): Promise<Book[]> => {
  const res = await fetch("http://localhost:5000/api/books", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch books: ${errorText}`);
  }

  return res.json();
};



export const fetchGenresBuyer = async (): Promise<string[]> => {
  const res = await fetch("http://localhost:5000/api/genres", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch genres: ${errorText}`);
  }

  return res.json();
};



export const fetchBookDetailsBuyer = async (bookid: string): Promise<Book> => {
  const res = await fetch(`http://localhost:5000/api/books/${bookid}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch book details: ${errorText}`);
  }

  return res.json();
};



export const fetchBookReviewsBuyer = async (bookid: string): Promise<any[]> => {
  const res = await fetch(`http://localhost:5000/api/books/${bookid}/reviews`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch book reviews: ${errorText}`);
  }

  return res.json();
};



export const getBuyerProfile = async (): Promise<BuyerProfile> => {
  // console.log("api");
  const res = await fetch(`http://localhost:5000/api/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch buyer profile: ${res.statusText}`);
  }

  return res.json();
};


export const updateBuyerProfile = async (
  data: Partial<BuyerProfile>
): Promise<BuyerProfile> => {
  const res = await fetch(`http://localhost:5000/api/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update profile: ${errorText}`);
  }

  return res.json();
};



export const changeBuyerPassword = async (
  password: string
): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`http://localhost:5000/api/password`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to change password: ${errorText}`);
  }

  return res.json();
};


export async function getBuyerStats() {
  const res = await fetch("http://localhost:5000/api/stats",  {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch buyer stats");
  return res.json();
}