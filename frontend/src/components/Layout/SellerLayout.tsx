import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "@/lib/auth-context";
import { 
  LayoutDashboard, 
  Package,
  CreditCard,
  User,
  Shield,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from '@/components/Navbar';

const SellerLayout = ({ children }: { children: React.ReactNode }) => {
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
    if (!name) return "SU";
    
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  // Define tab structure
  const tabs = [
    {
      name: "Profile",
      path: "/seller/profile",
      icon: User,
      isActiveFn: (path: string) => isActive(path) && !location.pathname.includes("/payment") && !location.pathname.includes("/security")
    },
    {
      name: "Security",
      path: "/seller/profile/security",
      icon: Lock,
      isActiveFn: (path: string) => isActive(path)
    },
    {
      name: "Dashboard",
      path: "/seller/dashboard",
      icon: LayoutDashboard,
      isActiveFn: (path: string) => isActive(path)
    },
    {
      name: "Item Status",
      path: "/seller/item-status",
      icon: Package,
      isActiveFn: (path: string) => isActive(path),
      subTabs: [
        { name: "Pending", path: "/seller/item-status/pending" },
        { name: "Approved", path: "/seller/item-status/approved" },
        { name: "Rejected", path: "/seller/item-status/rejected" },
        { name: "Sold", path: "/seller/item-status/sold" },
        { name: "Expired", path: "/seller/item-status/expired" }
      ]
    },
    {
      name: "Auction Status",
      path: "/seller/auction-status",
      icon: Package,
      isActiveFn: (path: string) => isActive(path),
      subTabs: [
        { name: "Not Started", path: "/seller/auction-status/not-started" },
        { name: "Active", path: "/seller/auction-status/active" },
        { name: "Ended", path: "/seller/auction-status/ended" }
      ]
    },
    {
      name: "Transaction Payment",
      path: "/seller/transactions",
      icon: CreditCard,
      isActiveFn: (path: string) => isActive(path)
    }
  ];
  
  return (
    <div className="min-h-screen bg-[#f9f7f5]">
      {/* Use the Navbar component */}
      <Navbar />
      
      {/* Main Content - Add pt-16 to account for the fixed navbar height */}
      <div className="pt-16">
        <div 
          className="bg-cover bg-center relative"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            height: "180px"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
          <div className="container mx-auto px-4 relative h-full flex items-end pb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white/20 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-[#AA8F66] to-[#8c7352] text-white text-xl font-semibold">
                  {getInitials(user?.name || "Seller User")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-white text-2xl font-bold tracking-tight">Seller Portal</h1>
                <p className="text-white/80 mt-1">Manage your auctions and seller details</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`sticky top-[70px] z-30 transition-all duration-300 backdrop-blur-lg border-b ${scrolled ? 'bg-white/90 shadow-sm' : 'bg-transparent'}`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center h-16 -mb-px overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <Link 
                  key={tab.name}
                  to={tab.path} 
                  className={`flex items-center gap-2 px-5 h-full border-b-2 transition-all duration-200 whitespace-nowrap ${
                    tab.isActiveFn(tab.path) 
                      ? "text-[#AA8F66] border-[#AA8F66] font-medium" 
                      : "text-[#5A3A31]/70 border-transparent hover:text-[#5A3A31] hover:border-[#AA8F66]/30"
                  }`}
                >
                  <tab.icon className={`h-4 w-4 ${
                    tab.isActiveFn(tab.path) ? "text-[#AA8F66]" : "text-[#5A3A31]/60"
                  }`} />
                  <span>{tab.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6 text-sm text-[#5A3A31]/60">
            <Link to="/" className="hover:text-[#AA8F66] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <Link to="/seller/dashboard" className="hover:text-[#AA8F66] transition-colors">Overview</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <span className="text-[#5A3A31]/90">
              {tabs.find(tab => tab.isActiveFn(tab.path))?.name || 'Dashboard'}
            </span>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-[#AA8F66]/10 overflow-hidden">
            <div className="p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;