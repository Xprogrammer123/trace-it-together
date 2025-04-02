
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Define the specific admin UID that should always be recognized as admin
const ADMIN_UID = 'd14ac157-3e21-4b6e-89ea-ba40f842d6d4';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();

  // Show loading indicator when actively checking auth status
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin access is required and whether user has admin privileges
  if (requireAdmin && !isAdmin && user.id !== ADMIN_UID) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
