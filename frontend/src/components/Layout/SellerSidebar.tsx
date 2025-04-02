import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';

interface SellerSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SellerSidebar = ({ collapsed, setCollapsed }: SellerSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/seller/dashboard'
    },
    {
      title: 'Market Insights',
      icon: TrendingUp,
      href: '/seller/market-insights'
    },
    {
      title: 'My Items',
      icon: Package,
      href: '/seller/my-items'
    },
    {
      title: 'Transaction Payment',
      icon: CreditCard,
      href: '/seller/transactions'
    },
    {
      title: 'Profile',
      icon: User,
      href: '/seller/profile'
    }
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-[#AA8F66]/20 bg-white transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between gap-2 border-b border-[#AA8F66]/20 px-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-[#5A3A31]">Art<span className="text-[#AA8F66]">Auction</span></span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-lg p-2 hover:bg-[#AA8F66]/10 text-[#5A3A31]"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center p-3 text-base font-normal rounded-lg transition-colors",
                  isActive(item.href)
                    ? "bg-[#AA8F66] text-white"
                    : "hover:bg-[#AA8F66]/10 text-[#5A3A31]"
                )}
              >
                <item.icon size={20} />
                {!collapsed && <span className="ml-3">{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SellerSidebar; 