export const fetchBooks = async (
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

  // // console.log(params);
  // console.log("this is genre1 filter",genre);
  // console.log("this is seller1 filter",seller);
  // console.log("this is title1 filter",title);

  const token = localStorage.getItem('token');

  const res = await fetch(`http://localhost:5000/admin/books?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response:", errorText);
    throw new Error(`Failed to fetch books: ${res.status} ${res.statusText}`);
  }

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } 
  else {
    const errorText = await res.text(); 
    console.error("Unexpected non-JSON response:", errorText);
    throw new Error("Expected JSON but received something else");
  }
};


export const fetchCustomers = async (
  sortBy: string,
  order: string,
  search: string
) => {
  const token = localStorage.getItem("token");

  const params = new URLSearchParams({
    sortBy,
    order,
    search,
  });

  const res = await fetch(
    `http://localhost:5000/admin/customers?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response:", errorText);
    throw new Error(`Failed to fetch customers: ${res.status} ${res.statusText}`);
  }

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } else {
    const errorText = await res.text();
    console.error("Unexpected non-JSON response:", errorText);
    throw new Error("Expected JSON but received something else");
  }
};


export const fetchSellers = async (
  sortBy: string,
  order: string,
  search: string
) => {
  const token = localStorage.getItem("token");

  const params = new URLSearchParams({
    sortBy,
    order,
    search,
  });

  const res = await fetch(
    `http://localhost:5000/admin/sellers?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response:", errorText);
    throw new Error(`Failed to fetch sellers: ${res.status} ${res.statusText}`);
  }

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } 
  else {
    const errorText = await res.text();
    console.error("Unexpected non-JSON response:", errorText);
    throw new Error("Expected JSON but received something else");
  }
};


export const topCustomers = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/admin/dashboard/topcustomers`, 
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch top customers');
  }

  return res.json();
};

export const topSellers = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/admin/dashboard/topsellers`, 
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch top sellers');
  }

  return res.json();
};

export const topBooks = async () => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`http://localhost:5000/admin/dashboard/topbooks`, 
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch top books');
  }

  return res.json();
};


export type Seller = {
  id: number;
  name: string;
  email: string;
  phoneNo: string;
  address: string;
  date_of_birth: Date;
  join_date: Date;
};

export const fetchPendingSellers = async (): Promise<Seller[]> => {

  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/admin/sellers/pending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch sellers: ${res.statusText}`);
  }

  return res.json();
};

export const decideSeller = async (
  id: number,
  action: "approve" | "reject"
): Promise<void> => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/admin/sellers/decision/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to ${action} seller: ${errorText}`);
  }
};


export const getAdminProfile = async () => {

  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/admin/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const updateAdminProfile = async (data: { name: string; email: string; phone: string; address: string; dob: string; }) => {

  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/admin/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const changeAdminPassword = async (password: string) => {

  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/admin/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });
  return res.json();
};



export const fetchBookDetails = async (bookid: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/admin/books/${bookid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const fetchBookReviews = async (bookid: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/admin/books/${bookid}/reviews`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
