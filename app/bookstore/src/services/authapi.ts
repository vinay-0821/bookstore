

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

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

