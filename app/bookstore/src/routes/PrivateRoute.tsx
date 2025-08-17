import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../utils/store';
import { JSX } from 'react';
import { jwtDecode } from 'jwt-decode';

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const token = useSelector((state: RootState) => state.auth.token) || localStorage.getItem('token');

  if(!token){
    return <Navigate to="/login" replace />;
  }

  let role: string;

  try {
    const decoded: any = jwtDecode(token);

    role = decoded.role;

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return <Navigate to="/login" replace />;
    }
  }
  catch (error) {
    console.error("Invalid token", error);
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
  


};

export default PrivateRoute;
