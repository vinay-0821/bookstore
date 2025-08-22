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


export async function placeOrder(bookId: number, quantity: number, totalAmount: number) {
  const res = await fetch("http://localhost:5000/api/purchase", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ bookId, quantity, totalAmount }),
  });

  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}



interface CartItem {
  bookid: number;
  title: string;
  price: number;
  quantity: number;
}


export async function saveCart(cartItems: CartItem[]) {
  const res = await fetch("http://localhost:5000/api/cart/save", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ items: cartItems }),
  });

  if (!res.ok) throw new Error("Failed to save cart");
  return res.json();
}

export async function fetchCart() {
  const res = await fetch("http://localhost:5000/api/cart", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function removeCartItem(bookid: number) {
  const res = await fetch(`http://localhost:5000/api/cart/${bookid}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to remove item from cart");
  return res.json();
}

export async function clearCartDB() {
  const res = await fetch("http://localhost:5000/api/cart", {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to clear cart");
  return res.json();
}


export async function updateCartItemQuantity(bookid: number, quantity: number) {
  const res = await fetch(`http://localhost:5000/api/cart/${bookid}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) throw new Error("Failed to update cart item quantity");
  return res.json();
}



export async function purchaseCart(items: { bookid: number; quantity: number }[]) {
  // console.log("api calling", items);
  const res = await fetch("http://localhost:5000/api/cart/purchasecart", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    throw new Error("Purchase failed");
  }

  return res.json();
}


export const getBuyerOrders = async () => {
  // console.log("Im in buyerapi");
  const res = await fetch("http://localhost:5000/api/orders/buyer", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch buyer orders");
  }

  return await res.json();
};



export const postReview = async (bookId: number, description: string, rating: number) => {
  console.log("in post api call",bookId, description, rating);
  const res = await fetch("http://localhost:5000/api/reviews", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      bookId,
      description,
      rating,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to post review");
  }

  return await res.json();
};



export const putReview = async (bookId: number, reviewId: number, description: string, rating: number) => {
  const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      bookId,
      description,
      rating,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update review");
  }

  return await res.json();
};