import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", color: "#2F4156" }}>
        Loading authorization...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toLowerCase();
  const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRole);

  if (!isAllowed) {
    // Redirect to their own dashboard
    if (userRole === "student") return <Navigate to="/student/dashboard" replace />;
    if (userRole === "alumni") return <Navigate to="/alumni/dashboard" replace />;
    if (userRole === "faculty") return <Navigate to="/faculty/dashboard" replace />;
    if (userRole === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
