import { useState } from "react";
import { Routes, Route, Navigate, useLocation, Link, Outlet } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "./Dashboard";
import TrackingAdd from "./tracking/Add";
import TrackingEdit from "./tracking/Edit";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/admin"
    },
    {
      title: "Add Tracking",
      icon: <Package size={18} />,
      path: "/admin/tracking/add"
    }
  ];

  // Get the current page title based on the route
  const getPageTitle = () => {
    if (location.pathname === "/admin") return "Dashboard";
    if (location.pathname === "/admin/tracking/add") return "Add Tracking";
    if (location.pathname.startsWith("/admin/tracking/edit")) return "Edit Tracking";
    return "Admin";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="font-semibold text-xl">TraceIt Admin</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </Button>
          </div>

          {/* Sidebar content */}
          <ScrollArea className="flex-1">
            <nav className="p-4 space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  <ChevronRight size={16} className="ml-auto text-gray-400" />
                </Link>
              ))}
            </nav>
          </ScrollArea>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                  {profile?.full_name ? profile.full_name.charAt(0) : user?.email?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-medium text-sm">{profile?.full_name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-center"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
          <h1 className="ml-4 lg:ml-0 text-lg font-medium">{getPageTitle()}</h1>
        </header>

        {/* Content area with nested routes */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="tracking">
              <Route path="add" element={<TrackingAdd />} />
              <Route path="edit/:trackingCode" element={<TrackingEdit />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
