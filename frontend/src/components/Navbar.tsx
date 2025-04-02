import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Search, User, LogOut, UserCircle, ClipboardList } from 'lucide-react';
import { Input } from './ui/input';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { toast } from './ui/use-toast';
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isSeller } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  // Handle keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey) && (isSeller() || user?.role === 'ADMIN')) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isSeller, user]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      toast({
        title: "Searching...",
        description: `Finding results for "${searchQuery}"`,
      });
      
      // Navigate to auctions page with search query
      navigate(`/auctions?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const performSearch = (value: string) => {
    setIsSearchOpen(false);
    if (value) {
      navigate(`/auctions?search=${encodeURIComponent(value)}`);
      toast({
        title: "Search results",
        description: `Showing results for "${value}"`,
      });
    }
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const getInitials = (name: string) => {
    if (!name) return "";
    
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-subtle py-2' 
          : 'bg-transparent py-4'
      }`}
      style={{ height: '70px' }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl font-bold tracking-tight mr-4">
          Art<span className="text-[#AA8F66]">Auction</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8 flex-1">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'text-[#AA8F66] after:w-full' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/auctions" 
            className={`nav-link ${location.pathname === '/auctions' ? 'text-[#AA8F66] after:w-full' : ''}`}
          >
            Auctions
          </Link>
          <Link 
            to="/artists" 
            className={`nav-link ${location.pathname.startsWith('/artist') ? 'text-[#AA8F66] after:w-full' : ''}`}
          >
            Artists
          </Link>
          {user && isSeller() && (
            <Link 
              to="/seller/profile" 
              className={`nav-link ${location.pathname.startsWith('/seller') ? 'text-[#AA8F66] after:w-full' : ''}`}
            >
              Overview
            </Link>
          )}
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'text-[#AA8F66] after:w-full' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/faqs" 
            className={`nav-link ${location.pathname === '/faqs' ? 'text-[#AA8F66] after:w-full' : ''}`}
          >
            FAQs
          </Link>
          
        </nav>

        {/* Search and Profile */}
        <div className="flex items-center gap-4">
          {user && !isSeller() && (
            <Button 
              variant="outline" 
              className="border-[#AA8F66] text-[#AA8F66] hover:bg-[#AA8F66]/10"
              asChild
            >
              <Link to="/seller-application">Become a Seller</Link>
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="rounded-full p-0 h-9 w-9 overflow-hidden border-2 border-[#AA8F66]/20 hover:border-[#AA8F66]/40 transition-colors"
                  size="icon"
                >
                  <Avatar className="h-full w-full">
                    <AvatarFallback className="bg-[#AA8F66]/10 text-[#5A3A31] font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 border border-[#AA8F66]/20 shadow-lg rounded-xl">
                <div className="px-3 py-2 border-b border-[#AA8F66]/10 mb-1">
                  <p className="font-medium text-[#5A3A31]">{user.name}</p>
                  <p className="text-xs text-[#5A3A31]/70 mt-0.5">{user.email}</p>
                </div>
                
                <DropdownMenuItem asChild className="rounded-lg flex items-center gap-2 h-9 px-3 py-2 text-sm text-[#5A3A31]/90 hover:text-[#5A3A31] hover:bg-[#AA8F66]/10 cursor-pointer">
                  <Link to={user?.role === 'ADMIN' ? "/admin/profile" : (user?.role === 'SELLER' ? "/seller/profile" : "/profile")}>
                    <UserCircle className="h-4 w-4 text-[#AA8F66]" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                {user?.role === 'CUSTOMER' && (
                  <DropdownMenuItem asChild className="rounded-lg flex items-center gap-2 h-9 px-3 py-2 text-sm text-[#5A3A31]/90 hover:text-[#5A3A31] hover:bg-[#AA8F66]/10 cursor-pointer">
                    <Link to="/bids">
                      <ClipboardList className="h-4 w-4 text-[#AA8F66]" />
                      <span>My Bids</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator className="my-1 bg-[#AA8F66]/10" />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="rounded-lg flex items-center gap-2 h-9 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-[#AA8F66] text-[#AA8F66] hover:bg-[#AA8F66]/10" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} className="text-[#5A3A31]" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/" className="font-serif text-2xl font-bold tracking-tight">
                Art<span className="text-[#AA8F66]">Auction</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <X size={24} className="text-[#5A3A31]" />
              </button>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/" 
                    className="block p-2 hover:bg-[#AA8F66]/10 rounded-lg"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/auctions" 
                    className="block p-2 hover:bg-[#AA8F66]/10 rounded-lg"
                  >
                    Auctions
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/artists" 
                    className="block p-2 hover:bg-[#AA8F66]/10 rounded-lg"
                  >
                    Artists
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="block p-2 hover:bg-[#AA8F66]/10 rounded-lg"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/faqs" 
                    className="block p-2 hover:bg-[#AA8F66]/10 rounded-lg"
                  >
                    FAQs
                  </Link>
                </li>
                {user && isSeller() && (
                  <li>
                    <Link 
                      to="/seller/dashboard" 
                      className="block p-2 hover:bg-[#AA8F66]/10 rounded-lg"
                    >
                      Overview
                    </Link>
                  </li>
                )}
                {user && !isSeller() && (
                  <li>
                    <Link 
                      to="/seller-application" 
                      className="block p-2 hover:bg-[#AA8F66]/10 rounded-lg text-[#AA8F66] font-medium"
                    >
                      Become a Seller
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            {user ? (
              <div className="p-4 border-t">
                <div className="flex items-center p-2">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-[#AA8F66]/10 text-[#5A3A31] font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start" size="sm">
                    <Link to={user?.role === 'ADMIN' ? "/admin/profile" : (user?.role === 'SELLER' ? "/seller/profile" : "/profile")}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  {user?.role === 'CUSTOMER' && (
                    <Button asChild variant="outline" className="w-full justify-start" size="sm">
                      <Link to="/bids">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        My Bids
                      </Link>
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button className="flex-1 bg-[#AA8F66] hover:bg-[#AA8F66]/90" asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Global search dialog for sellers */}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <div className="p-2">
          <CommandInput placeholder="Search for artworks, auctions, artists..." className="border-none focus:ring-0" />
        </div>
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-10">
              <Search className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-center text-muted-foreground">No results found.</p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Quick links">
            <CommandItem onSelect={() => {
              performSearch("recent");
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Recent auctions</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CommandItem>
            <CommandItem onSelect={() => {
              performSearch("popular");
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Popular artworks</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
};

export default Navbar;