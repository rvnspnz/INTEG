import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);
  
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/admin/dashboard':
        return 'Dashboard';
      case '/admin/users':
        return 'Users Management';
      case '/admin/items':
        return 'Items Management';
      case '/admin/seller-applications':
        return 'Seller Applications';
      case '/admin/auction-approvals':
        return 'Auction Approvals';
      case '/admin/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F9F7F5] relative">
      {/* Background Pattern Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-72 h-72 bg-[#5A3A31]/3 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-[15%] left-[8%] w-80 h-80 bg-[#AA8F66]/3 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-[35%] left-[25%] w-64 h-64 bg-[#5A3A31]/2 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      
      <main 
        className={`pt-16 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-20' : 'ml-0 md:ml-64'
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8 animate-in fade-in">
          <div className="mb-8 bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-15">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute left-0 bottom-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>
              <div className="absolute right-1/4 top-1/2 w-12 h-12 bg-white/20 rounded-full"></div>
              <svg className="absolute right-8 bottom-0 h-full w-64 text-white/10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wave" gradientTransform="rotate(45)">
                    <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,100 C30,50 70,50 100,100" fill="url(#wave)" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="absolute -left-1 top-0 h-full w-1.5 bg-white/30 rounded-full"></div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight ml-3">{getPageTitle()}</h1>
              <p className="text-white/80 mt-1 ml-3">Manage your auction platform with ease</p>
            </div>
          </div>
          
          <div className="animate-in slide-in-from-right duration-500 bg-white rounded-xl p-6 md:p-8 shadow-md border border-[#AA8F66]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#F9F7F5]/70 rounded-bl-full pointer-events-none"></div>
            {children}
          </div>
        </div>
      </main>
      
      {/* Subtle Footer Line */}
      <div className="h-1 bg-gradient-to-r from-[#5A3A31]/10 via-[#AA8F66]/10 to-[#5A3A31]/10 fixed bottom-0 w-full pointer-events-none"></div>
    </div>
  );
};

export default MainLayout;
