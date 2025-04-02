import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header = ({ sidebarCollapsed }: HeaderProps) => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <header className={`h-16 fixed top-0 right-0 z-30 bg-gradient-to-r from-white via-white to-[#F9F6F3] backdrop-filter backdrop-blur-md border-b border-[#AA8F66]/20 shadow-sm transition-all duration-300 ${sidebarCollapsed ? 'left-20' : 'left-64'}`}>
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center">
          <div className="text-sm font-medium text-[#5A3A31]/70 flex items-center space-x-2">
            <div className="flex space-x-1 items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#AA8F66]"></span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5A3A31]/60"></span>
            </div>
            <span className="relative">
              Admin Portal
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#AA8F66]/0 via-[#AA8F66]/50 to-[#AA8F66]/0"></div>
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">  
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center ml-2 cursor-pointer p-1 hover:bg-[#AA8F66]/10 rounded-full transition-colors">
                <div className="relative">
                  <img 
                    src="https://randomuser.me/api/portraits/men/1.jpg" 
                    alt="User" 
                    className="h-9 w-9 rounded-full border-2 border-[#AA8F66]/20 shadow-sm hover:shadow-md transition-shadow ring-2 ring-white/90" 
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-3 hidden md:block">
                  <p className="text-sm font-medium text-[#5A3A31]">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-[#5A3A31]/70">{user?.email || 'admin@example.com'}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border border-[#AA8F66]/20 shadow-lg rounded-xl w-56 p-1">
              <div className="px-4 py-2 border-b border-[#AA8F66]/10">
                <p className="font-medium text-[#5A3A31] text-sm">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-[#5A3A31]/70 mt-0.5">{user?.email || 'admin@example.com'}</p>
              </div>
              <DropdownMenuItem asChild className="text-[#5A3A31]/90 hover:text-[#5A3A31] hover:bg-[#AA8F66]/10 mt-1 rounded-lg">
                <Link to={user?.role === 'ADMIN' ? "/admin/profile" : (user?.role === 'SELLER' ? "/seller/profile" : "/profile")} className="cursor-pointer">
                  <div className="flex items-center py-0.5">
                    <div className="h-7 w-7 rounded-full bg-[#AA8F66]/10 flex items-center justify-center mr-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#AA8F66]">
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 21V19C4 17.9391 4.42143 16.9217 5.17157 16.1716C5.92172 15.4214 6.93913 15 8 15H16C17.0609 15 18.0783 15.4214 18.8284 16.1716C19.5786 16.9217 20 17.9391 20 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm">Profile Settings</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-[#5A3A31]/90 hover:text-[#5A3A31] hover:bg-red-50 rounded-lg">
                <div className="flex items-center py-0.5">
                  <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center mr-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm">Logout</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
