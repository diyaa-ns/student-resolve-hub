import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/Dashboard";
import StudentComplaints from "./pages/student/Complaints";
import NewComplaint from "./pages/student/NewComplaint";
import StudentComplaintDetail from "./pages/student/ComplaintDetail";
import StudentNotifications from "./pages/student/Notifications";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminComplaints from "./pages/admin/Complaints";
import AdminComplaintDetail from "./pages/admin/ComplaintDetail";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import ManageUsers from "./pages/superadmin/Users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/dashboard/complaints" element={<StudentComplaints />} />
            <Route path="/dashboard/complaints/:id" element={<StudentComplaintDetail />} />
            <Route path="/dashboard/new-complaint" element={<NewComplaint />} />
            <Route path="/dashboard/notifications" element={<StudentNotifications />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/complaints/:id" element={<AdminComplaintDetail />} />
            <Route path="/admin/notifications" element={<StudentNotifications />} />
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/users" element={<ManageUsers />} />
            <Route path="/super-admin/analytics" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/settings" element={<SuperAdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
