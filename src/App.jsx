import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Users from "./pages/Users";
import Layout from "./pages/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (

    <>
          <Toaster position="top-right" reverseOrder={false} />

    <Routes>
      
      <Route path="/login" element={<Login />} />

      {/* App layout with navbar and sidebar */}
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* POS - accessible to cashiers and admins */}
        <Route
          path="pos"
          element={
            <RoleRoute allowedRoles={["cashier", "admin"]}>
              <POS />
            </RoleRoute>
          }
        />

        {/* Products - admin only */}
        <Route
          path="products"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Products />
            </RoleRoute>
          }
        />

        {/* Sales - admin and cashier can view, but admin manages */}
        <Route
          path="sales"
          element={
            <RoleRoute allowedRoles={["admin", "cashier"]}>
              <Sales />
            </RoleRoute>
          }
        />

        {/* Users management - admin only */}
        <Route
          path="users"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Users />
            </RoleRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </>
  );
}
