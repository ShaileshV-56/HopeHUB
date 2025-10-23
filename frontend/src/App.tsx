import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Donate from "./pages/Donate";
import FindDonors from "./pages/FindDonors";
import RegisterDonor from "./pages/RegisterDonor";
import Organizations from "./pages/Organizations";
import RegisterOrganization from "./pages/RegisterOrganization";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import EmergencyResources from "./pages/EmergencyResources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const isAuthed = () => {
  try {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('auth_token');
  } catch {
    return false;
  }
};

const Protected = ({ children }: { children: JSX.Element }) => {
  return isAuthed() ? children : <Navigate to="/auth" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/donate" element={<Protected><Donate /></Protected>} />
          <Route path="/find-donors" element={<FindDonors />} />
          <Route path="/register-donor" element={<Protected><RegisterDonor /></Protected>} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/register-organization" element={<Protected><RegisterOrganization /></Protected>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/emergency-resources" element={<EmergencyResources />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
