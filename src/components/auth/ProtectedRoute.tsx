
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Define the specific admin UID that should always be recognized as admin
const ADMIN_UID = 'd14ac157-3e21-4b6e-89ea-ba40f842d6d4';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
  }

  if (!user) {
    toast.error("You must be logged in to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if admin access is required and whether user has admin privileges
  // Special case: User with specific UID is always granted admin access
  if (requireAdmin && !isAdmin && user.id !== ADMIN_UID) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
