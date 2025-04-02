import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  UserCheck, 
  Gavel, 
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const getInitials = (name: string) => {
    if (!name) return "AD";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <div
      className={cn(
        "h-screen fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out border-r border-[#AA8F66]/20 bg-white flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-16 p-4 flex items-center justify-between border-b border-[#AA8F66]/20 bg-gradient-to-r from-[#5A3A31] to-[#AA8F66]">
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center w-full" : ""
          )}
        >
          <div className="h-10 w-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold ml-2 text-white">AuctionHub</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("p-0 h-8 w-8 text-white hover:bg-white/20 hover:text-white", collapsed ? "hidden" : "")}
        >
          <ChevronLeft size={18} />
        </Button>
      </div>

      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 h-6 w-6 rounded-full border border-[#AA8F66]/20 bg-white shadow-md text-[#5A3A31] hover:bg-[#5A3A31] hover:text-white"
        >
          <ChevronRight size={14} />
        </Button>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1.5">
          <li>
            <Link
              to="/admin/dashboard"
              className={cn(
                "flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200",
                isActive("/admin/dashboard")
                  ? "bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] text-white shadow-md"
                  : "hover:bg-[#AA8F66]/10 text-[#5A3A31]"
              )}
            >
              <LayoutDashboard size={20} className={isActive("/admin/dashboard") ? "text-white" : "text-[#AA8F66]"} />
              {!collapsed && <span className="ml-3 font-medium">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={cn(
                "flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200",
                isActive("/admin/users")
                  ? "bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] text-white shadow-md"
                  : "hover:bg-[#AA8F66]/10 text-[#5A3A31]"
              )}
            >
              <Users size={20} className={isActive("/admin/users") ? "text-white" : "text-[#AA8F66]"} />
              {!collapsed && <span className="ml-3 font-medium">Users</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/items"
              className={cn(
                "flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200",
                isActive("/admin/items")
                  ? "bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] text-white shadow-md" 
                  : "hover:bg-[#AA8F66]/10 text-[#5A3A31]"
              )}
            >
              <Package size={20} className={isActive("/admin/items") ? "text-white" : "text-[#AA8F66]"} />
              {!collapsed && <span className="ml-3 font-medium">Items</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/seller-applications"
              className={cn(
                "flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200",
                isActive("/admin/seller-applications")
                  ? "bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] text-white shadow-md"
                  : "hover:bg-[#AA8F66]/10 text-[#5A3A31]"
              )}
            >
              <UserCheck size={20} className={isActive("/admin/seller-applications") ? "text-white" : "text-[#AA8F66]"} />
              {!collapsed && <span className="ml-3 font-medium">Seller Applications</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/auction-approvals"
              className={cn(
                "flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200",
                isActive("/admin/auction-approvals")
                  ? "bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] text-white shadow-md"
                  : "hover:bg-[#AA8F66]/10 text-[#5A3A31]"
              )}
            >
              <Gavel size={20} className={isActive("/admin/auction-approvals") ? "text-white" : "text-[#AA8F66]"} />
              {!collapsed && <span className="ml-3 font-medium">Auction Approvals</span>}
            </Link>
          </li>
        </ul>

        <div className="pt-5 mt-5 border-t border-[#AA8F66]/20">
          <ul className="space-y-1.5">
            <li>
              <Link
                to={user?.role === 'ADMIN' ? "/admin/profile" : (user?.role === 'SELLER' ? "/seller/profile" : "/profile")}
                className={cn(
                  "flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200",
                  isActive(user?.role === 'ADMIN' ? "/admin/profile" : (user?.role === 'SELLER' ? "/seller/profile" : "/profile"))
                    ? "bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] text-white shadow-md"
                    : "hover:bg-[#AA8F66]/10 text-[#5A3A31]"
                )}
              >
                <User size={20} className={isActive(user?.role === 'ADMIN' ? "/admin/profile" : (user?.role === 'SELLER' ? "/seller/profile" : "/profile")) ? "text-white" : "text-[#AA8F66]"} />
                {!collapsed && <span className="ml-3 font-medium">Profile</span>}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Separator className="my-2 bg-[#AA8F66]/10" />

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center", collapsed ? "w-full justify-center" : "")}>
            <Avatar className="h-9 w-9 border-2 border-[#AA8F66]/20 bg-[#AA8F66]/10 mr-3 shadow-sm ring-2 ring-white ring-offset-1 ring-offset-[#AA8F66]/5">
              <AvatarFallback className="text-[#5A3A31] text-xs font-medium">
                {user ? getInitials(user.name) : "AD"}
              </AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col", collapsed ? "hidden" : "")}>
              <span className="text-sm font-medium text-[#5A3A31]">
                {user ? user.name : "Admin User"}
              </span>
              <span className="text-xs text-[#5A3A31]/70">Administrator</span>
            </div>
          </div>
          
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-500 text-[#5A3A31]/70"
              onClick={logout}
            >
              <LogOut size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
