
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Check if user is authenticated (in a real app, this would validate the Supabase token)
  const isAuthenticated = localStorage.getItem("auth_token") !== null;

  if (!isAuthenticated) {
    toast.error("You must be logged in to access this page");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
