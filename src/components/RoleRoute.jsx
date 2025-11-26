import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ allowedRoles = [], children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow text-center">
        <h3 className="text-xl font-bold">Access Denied</h3>
        <p className="mt-2 text-gray-600">You don't have permission to view this page.</p>
      </div>
    </div>;
  }
  return children;
}
