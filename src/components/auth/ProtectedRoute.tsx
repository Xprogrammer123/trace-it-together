
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Define the specific admin UID that should always be recognized as admin
const ADMIN_UID = 'd14ac157-3e21-4b6e-89ea-ba40f842d6d4';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();

  // Simple loading indicator
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin check - simple condition
  if (requireAdmin && !isAdmin && user.id !== ADMIN_UID) {
    return <Navigate to="/" replace />;
  }

  // Everything is good, render children
  return <>{children}</>;
};

export default ProtectedRoute;
