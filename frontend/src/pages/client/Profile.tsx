import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import ClientLayout from "@/components/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Trophy, Shield, Lock } from "lucide-react";
import { Link } from "react-router-dom";

// Mock auction history data
const auctionHistory = [
  {
    id: "1",
    title: "Abstract Expressionism #45",
    artist: "Emma Johnson",
    date: "12/15/2023",
    dimensions: "24x36 inches",
    price: 1250,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3"
  },
  {
    id: "2",
    title: "Digital Landscape Series",
    artist: "Carlos Mendez",
    date: "12/18/2023",
    dimensions: "18x24 inches",
    price: 850,
    image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?ixlib=rb-4.0.3"
  },
  {
    id: "3",
    title: "Vintage Portrait Collection",
    artist: "Sophia Chen",
    date: "01/05/2024",
    dimensions: "16x20 inches",
    price: 2100,
    image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?ixlib=rb-4.0.3"
  }
];

export default function Profile() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
    bio: "Art collector with a passion for contemporary works. Building a diverse collection since 2015.",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
  });
  
  const getInitials = (name: string = "") => {
    if (!name) return "CU";
    
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfileData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real application, you would call an API here
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsLoading(false);
    }, 1000);
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real application, you would call an API here
    setTimeout(() => {
      toast.success("Password changed successfully");
      setIsLoading(false);
      
      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1000);
  };
  
  const handleDeleteAccount = () => {
    setIsLoading(true);
    
    // In a real application, you would call an API here
    setTimeout(() => {
      toast.success("Account deleted successfully");
      setIsLoading(false);
      logout();
    }, 1000);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  if (!user) {
    return (
      <ClientLayout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
            <p className="mb-4">Please log in to view your profile</p>
            <Button className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white" asChild>
              <a href="/login">Log In</a>
            </Button>
          </div>
        </div>
      </ClientLayout>
    );
  }
  
  return (
    <ClientLayout>
      {/* Header Section */}
      <div>
        <div 
          className="h-60 w-full relative overflow-hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#5A3A31]/70 to-[#AA8F66]/50"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl text-white font-medium drop-shadow-md">
                <span className="inline-flex items-center gap-3">
                  <User className="w-8 h-8 text-white/90" />
                  <span>My Profile</span>
                  <Trophy className="w-8 h-8 text-white/90" />
                </span>
              </h1>
              <p className="text-white/90 mt-3 text-base max-w-md mx-auto drop-shadow">
                Manage your personal information and bidding preferences
              </p>
            </div>
          </div>
        </div>
      
        <div className="container max-w-7xl mx-auto px-4 relative -mt-12">
          <div className="flex flex-col md:flex-row gap-6 relative z-10">
            {/* Profile Card */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-[#AA8F66]/20 transition-all duration-300 hover:shadow-2xl">
                {/* Profile Picture Section */}
                <div className="relative bg-gradient-to-br from-[#AA8F66]/20 to-[#5A3A31]/20 p-6 flex flex-col items-center">
                  <div className="absolute inset-0 opacity-10 bg-pattern"></div>
                  
                  <div className="w-36 h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white/80 relative mb-4 hover:scale-105 transition-transform duration-300">
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-gradient-to-br from-[#AA8F66] to-[#5A3A31] text-white text-5xl font-medium">
                        {getInitials(user?.name || "Customer User")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                {/* Profile Info Section */}
                <div className="p-6 bg-card rounded-b-2xl">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-1">
                      {user?.name || user?.username}
                    </h1>
                    <p className="text-muted-foreground text-sm mb-3">@{user?.username}</p>
                    <div className="inline-flex items-center justify-center px-3 py-1 mb-3 text-xs font-medium rounded-full bg-[#AA8F66]/10 text-[#AA8F66] border border-[#AA8F66]/20">
                      {user?.role || "CUSTOMER"}
                    </div>
                    <p className="text-muted-foreground text-center text-sm mb-4 italic">{profileData.bio}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="bg-white rounded-xl shadow-lg border border-[#AA8F66]/20 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Account Information Card */}
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center border-b border-[#AA8F66]/10 pb-4">
                      <User className="h-6 w-6 mr-2 text-[#AA8F66]" />
                      <h2 className="text-xl font-bold">Account Information</h2>
                    </div>
                    
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileInputChange}
                            className="border border-[#AA8F66]/20 focus-visible:ring-[#AA8F66] rounded-md shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileInputChange}
                            className="border border-[#AA8F66]/20 focus-visible:ring-[#AA8F66] rounded-md shadow-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileInputChange}
                            className="border border-[#AA8F66]/20 focus-visible:ring-[#AA8F66] rounded-md shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileInputChange}
                            className="border border-[#AA8F66]/20 focus-visible:ring-[#AA8F66] rounded-md shadow-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleProfileInputChange}
                          rows={4}
                          placeholder="Tell us about your interests in art and collecting..."
                          className="border border-[#AA8F66]/20 focus-visible:ring-[#AA8F66] rounded-md shadow-sm"
                        />
                      </div>
                      
                      <div className="pt-4 border-t border-[#AA8F66]/10">
                        <Button 
                          className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white shadow-md hover:shadow-lg transition-all" 
                          type="submit" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Updating..." : "Update Profile"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}