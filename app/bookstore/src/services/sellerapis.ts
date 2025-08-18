export type SellerProfile = {
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
};
export type SellerStats = {
  totalAmount: number;
  totalBooksSold: number;
  topBook: string;
  rating: number;
};

export type SellerOrder = {
  id: number;
  book: string;
  buyer: string;
  date: string;
  amount: number;
};


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getSellerProfile = async (): Promise<SellerProfile> => {
  const res = await fetch(`http://localhost:5000/seller/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch seller profile: ${res.statusText}`);
  }

  return res.json();
};

export const updateSellerProfile = async (
  data: Partial<SellerProfile>
): Promise<SellerProfile> => {
  const res = await fetch(`http://localhost:5000/seller/profile`, {
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


export const changeSellerPassword = async (
  password: string
): Promise<{ success: boolean; message: string }> => {
  const res = await fetch(`http://localhost:5000/seller/password`, {
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

export const getSellerTotalAmount = async () => {
  const res = await fetch("http://localhost:5000/seller/dashboard/totalamount", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  return res.json();
};

export const getSellerTotalBooks = async () => {
  const res = await fetch("http://localhost:5000/seller/dashboard/totalbooks", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  return res.json();
};

export const getSellerTopBook = async () => {
  const res = await fetch("http://localhost:5000/seller/dashboard/topbook", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  return res.json();
};

export const getSellerRating = async () => {
  const res = await fetch("http://localhost:5000/seller/dashboard/rating", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  return res.json();
};


export const getRecentOrders = async (): Promise<SellerOrder[]> => {
  const res = await fetch(`http://localhost:5000/seller/orders/recent`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch recent orders: ${res.statusText}`);
  }

  return res.json();
};



export const fetchSellerBooks = async (
  genre: string,
  seller: string,
  title: string,
  sortBy: string,
  order: string
) => {
  const params = new URLSearchParams({
    genre,
    seller,
    title,
    sortBy,
    order
  });

  const token = localStorage.getItem('token');

  const res = await fetch(`http://localhost:5000/seller/mybooks?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const errorText = await res.text();
    // console.log("In sellerapis.ts");
    console.error("Error response:", errorText);
    throw new Error(`Failed to fetch books: ${res.status} ${res.statusText}`);
  }

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } else {
    const errorText = await res.text(); 
    console.error("Unexpected non-JSON response:", errorText);
    throw new Error("Expected JSON but received something else");
  }
};





export const fetchSellerOrders = async (
  orderId: string,
  buyer: string,
  book: string,
  sortBy: string,
  order: string
) => {
  const params = new URLSearchParams({
    orderId,
    buyer,
    book,
    sortBy,
    order
  });

  // // console.log(params);
  // console.log("this is genre1 filter",orderId);
  // console.log("this is seller1 filter",buyer);
  // console.log("this is title1 filter",book);

  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/seller/orders?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response:", errorText);
    throw new Error(`Failed to fetch seller orders: ${res.status} ${res.statusText}`);
  }

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } else {
    const errorText = await res.text();
    console.error("Unexpected non-JSON response:", errorText);
    throw new Error("Expected JSON but received something else");
  }
};


export const fetchSellerBookDetails = async (bookid: number | string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/seller/mybooks/${bookid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const fetchSellerBookReviews = async (bookid: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/seller/mybooks/${bookid}/reviews`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};



export const fetchGenres = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/seller/genres", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
};



export const addBook = async (formData: any) => {
  const token = localStorage.getItem("token");

  // console.log("api formdata: ", formData);

  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    // console.log(key);
    // console.log(value);
    if (value !== null){
      if(key === 'image'){
        value = formData.image.name;
        console.log(value);
      }
      data.append(key, value as any);
    } 
  });

  console.log("apis calling: ", data);
  // console.log(Array.from(data.entries()));
  // for (const pair of Array.from(data.entries())) {
  //   console.log(pair[0], pair[1]);
  // }

  const res = await fetch("http://localhost:5000/seller/addbook", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  if (!res.ok) throw new Error("Failed to add book");
  return res.json();
};



export const updateBook = async (bookid: number | string, formData: any) => {
  const token = localStorage.getItem("token");

  console.log("api formdata: ", formData);

  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    // console.log(key);
    // console.log(value);
    if (value !== null){
      if(key === 'image'){
        value = formData.image.name;
        console.log(value);
      }
      data.append(key, value as any);
    } 
  });

  console.log("apis calling: ", data);
  // console.log(Array.from(data.entries()));
  // for (const pair of Array.from(data.entries())) {
  //   console.log(pair[0], pair[1]);
  // }

  const res = await fetch(`http://localhost:5000/seller/mybooks/${bookid}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
};


export const deleteBook = async (bookid: number | string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/seller/mybooks/${bookid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete book");
  return res.json();
};
