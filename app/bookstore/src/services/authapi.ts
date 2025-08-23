
const BASE_URL = 'http://localhost:5000';

export const signupUser = async (username: string, email: string, password: string, role: string, mobile: string, address: string) => {

    const data = {
        username: username,
        email: email,
        password: password,
        role: role,
        mobile: mobile,
        address: address
    }

  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || 'Sign up failed');
    }

    return resData;
  } catch (err: any) {
    throw new Error(err.message || 'Server error during sign up');
  }
};


export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // console.log("signin",data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

export const getSellerapprove = async (email: string) => {
  console.log("I am in approve ");
  try {
    console.log("here?");
    const response = await fetch(`${BASE_URL}/getapprove/${email}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log("next ",response);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'No Seller');
    }

    console.log("in api call",data);

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'No Seller');
  }
}


export const forgotPassword = async (email: string, password: string) => {
  // console.log("I am in forgot password api");
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Failed to update password");
  return res.json();
};