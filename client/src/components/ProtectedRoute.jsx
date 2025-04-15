import React from 'react'
import { Navigate } from 'react-router';


const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem("token_expiry");
    const isTokenExpired = !expiry || Date.now() > parseInt(expiry);

    if (!token || isTokenExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiry');
      return <Navigate to="/login" replace />;
    }
  
    return children;
  
}

export default ProtectedRoute