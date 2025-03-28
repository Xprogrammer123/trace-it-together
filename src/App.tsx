
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TrackingPage from "./pages/TrackingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTrackingAdd from "./pages/admin/TrackingAdd";
import AdminTrackingEdit from "./pages/admin/TrackingEdit";
import AdminLayout from "./pages/admin/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider, createAdminUser } from "./contexts/AuthContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Create default admin user on app start
    createAdminUser();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/track/:trackingId" element={<TrackingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Admin Routes (Protected) */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="add" element={<AdminTrackingAdd />} />
                <Route path="edit/:trackingId" element={<AdminTrackingEdit />} />
              </Route>
              
              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
