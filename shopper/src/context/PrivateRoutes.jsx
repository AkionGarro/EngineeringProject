import { Outlet, Navigate } from "react-router-dom";
import React from "react";
import { useAuth } from "./AuthContext";
const PrivateRoutes = () => {
  let auth = useAuth();
  return auth.user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
