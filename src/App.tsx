import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import InvestmentPlans from "./pages/InvestmentPlans";
import Earnings from "./pages/Earnings";
import TransactionHistory from "./pages/TransactionHistory";
import MyInvestments from "./pages/MyInvestments";
import PortfolioPerformance from "./pages/PortfolioPerformance";
import BotTrading from "./pages/BotTrading";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminInvestments from "./pages/admin/AdminInvestments";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminBots from "./pages/admin/AdminBots";
import AdminWallets from "./pages/admin/AdminWallets";
import AdminNotificationsPage from "./pages/admin/AdminNotifications";
import AdminKyc from "./pages/admin/AdminKyc";
import KycVerification from "./pages/KycVerification";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/deposit" element={<Deposit />} />
            <Route path="/dashboard/withdraw" element={<Withdraw />} />
            <Route path="/dashboard/plans" element={<InvestmentPlans />} />
            <Route path="/dashboard/earnings" element={<Earnings />} />
            <Route path="/dashboard/history" element={<TransactionHistory />} />
            <Route path="/dashboard/investments" element={<MyInvestments />} />
            <Route path="/dashboard/portfolio" element={<PortfolioPerformance />} />
            <Route path="/dashboard/bots" element={<BotTrading />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/admin/investments" element={<AdminInvestments />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/bots" element={<AdminBots />} />
            <Route path="/admin/wallets" element={<AdminWallets />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/kyc" element={<AdminKyc />} />
            <Route path="/dashboard/kyc" element={<KycVerification />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
