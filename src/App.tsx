import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TrackingPage from "./pages/TrackingPage";
import TrackingAdd from "./pages/admin/TrackingAdd";
import TrackingEdit from "./pages/admin/TrackingEdit";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/track" element={<TrackingPage />} />
                <Route path="/track/:trackingId" element={<TrackingPage />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/tracking/add" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <TrackingAdd />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/tracking/edit/:trackingId" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <TrackingEdit />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
