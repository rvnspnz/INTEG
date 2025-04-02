import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import Navbar from "./Navbar";
import { User, Trophy, Shield, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll effect for tab bar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 180);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const getInitials = (name: string = "") => {
    if (!name) return "CU";
    
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Define tabs for navigation
  const tabs = [
    { 
      name: 'Profile', 
      path: '/client/profile', 
      icon: <User className="h-4 w-4" /> 
    },
    { 
      name: 'Bidding History', 
      path: '/client/bidding-history', 
      icon: <Trophy className="h-4 w-4" /> 
    },
    { 
      name: 'Security', 
      path: '/client/security', 
      icon: <Shield className="h-4 w-4" /> 
    }
  ];
  
  // Check if the current path matches the tab path
  const isTabActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F5]">
      <Navbar />
      
      {/* Main content with potential header image */}
      <main className="flex-1 pt-[70px]">
        {/* Tab navigation that becomes sticky on scroll */}
        {user && (
          <div className={`sticky top-[70px] z-30 bg-white shadow-md transition-all duration-300 ${
            scrolled ? 'shadow-lg border-b border-[#AA8F66]/10' : ''
          }`}>
            <div className="container max-w-7xl mx-auto">
              <div className="flex items-center overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all relative whitespace-nowrap ${
                      isTabActive(tab.path)
                        ? 'text-[#5A3A31] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#AA8F66]'
                        : 'text-gray-500 hover:text-[#AA8F66]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                    {isTabActive(tab.path) && (
                      <ChevronRight className="h-3 w-3 ml-1 text-[#AA8F66]" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {children}
      </main>
      
      {/* Footer section */}
      <footer className="py-8 px-4 border-t border-[#AA8F66]/10 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ArtAuction. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-[#AA8F66] transition-colors">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-[#AA8F66] transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-[#AA8F66] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 