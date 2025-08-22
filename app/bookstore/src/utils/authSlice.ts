import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';


interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

// const decodeToken = (token: string): User => {
//   const decoded: any = jwtDecode(token);
//   return {
//     id: decoded.email,
//     email: decoded.email,
//     role: decoded.role,
//   };
// };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      // localStorage.removeItem("cart"); 
    },
    getUser: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();
          if (isExpired) {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
          } else {
            state.token = token;
            state.user = {
              id: decoded.id,
              email: decoded.email,
              role: decoded.role,
            };
          }
        } catch (err) {
          console.error('Invalid token');
          localStorage.removeItem('token');
          state.user = null;
          state.token = null;
        }
      }
    },
  },
});

export const { login, logout, getUser } = authSlice.actions;
export default authSlice.reducer;
