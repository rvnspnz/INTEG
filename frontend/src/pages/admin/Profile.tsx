import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import MainLayout from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LogOut, Lock, Shield, AlertTriangle, User, Calendar, Mail, Edit, Star } from "lucide-react";

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPermission, setExpandedPermission] = useState<string | null>(null);
  
  // Fixed admin data
  const adminData = {
    id: "ADM001",
    username: user?.username || "admin",
    name: user?.name || "Admin User",
    email: user?.email || "admin@artauction.com",
    role: "ADMIN",
    joinDate: "January 15, 2023",
    lastLogin: "Today at 9:30 AM",
    permissions: [
      {
        name: "User Management",
        description: "Create, edit, and delete user accounts. Modify user roles and permissions."
      },
      {
        name: "Content Management",
        description: "Manage all content including auctions, items, and categories."
      },
      {
        name: "Auction Approvals",
        description: "Review and approve auction submissions from sellers."
      },
      {
        name: "Seller Verifications",
        description: "Verify seller identities and approve seller applications."
      },
      {
        name: "System Settings",
        description: "Configure system-wide settings and preferences."
      }
    ] as const
  };
  
  const getInitials = (name: string = "") => {
    if (!name) return "AD";
    
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const handleDeleteAccount = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast.success("Account deleted successfully");
      setIsLoading(false);
      logout();
    }, 1000);
  };
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
            <p className="mb-4">Please log in to view your profile</p>
            <Button className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white" asChild>
              <a href="/login">Log In</a>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const togglePermissionDetails = (permissionName: string) => {
    if (expandedPermission === permissionName) {
      setExpandedPermission(null);
    } else {
      setExpandedPermission(permissionName);
    }
  };
  
  return (
    <MainLayout>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card className="border-none shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow duration-300">
            <div className="h-32 bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] relative">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
                <svg className="absolute right-0 bottom-0 h-full w-64 text-white/10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,100 C30,90 70,50 100,100" fill="white" fillOpacity="0.1" />
                </svg>
              </div>
            </div>
            <CardContent className="pt-0 relative">
              <div className="flex flex-col items-center -mt-16">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg bg-[#5A3A31] ring-4 ring-[#AA8F66]/20 group-hover:ring-[#AA8F66]/40 transition-all duration-300">
                    <AvatarFallback className="text-3xl text-white font-semibold">
                      {getInitials(adminData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-1 right-1 h-8 w-8 bg-[#AA8F66] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md cursor-pointer">
                    <Edit size={14} />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mt-4 text-[#5A3A31]">
                  {adminData.name}
                </h2>
                <div className="mt-1 px-4 py-1 bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] text-white rounded-full text-xs font-medium shadow-sm flex items-center">
                  <Star size={12} className="mr-1" /> {adminData.role}
                </div>
                <p className="text-sm text-[#5A3A31]/70 mt-2 flex items-center">
                  <Mail size={14} className="mr-1.5 text-[#AA8F66]" /> {adminData.email}
                </p>
                
                <Button 
                  variant="outline" 
                  className="mt-4 w-full border-[#AA8F66]/30 text-[#5A3A31] hover:bg-[#AA8F66]/10 hover:text-[#5A3A31] shadow-sm transition-all duration-200"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-[#AA8F66]/10">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#5A3A31]/70 flex items-center">
                      <User size={14} className="mr-1.5 text-[#AA8F66]" /> User ID
                    </span>
                    <span className="text-sm font-medium text-[#5A3A31] bg-[#AA8F66]/10 px-2 py-0.5 rounded shadow-sm">{adminData.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#5A3A31]/70 flex items-center">
                      <Calendar size={14} className="mr-1.5 text-[#AA8F66]" /> Joined
                    </span>
                    <span className="text-sm font-medium text-[#5A3A31]">{adminData.joinDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#5A3A31]/70 flex items-center">
                      <Calendar size={14} className="mr-1.5 text-[#AA8F66]" /> Last Login
                    </span>
                    <span className="text-sm font-medium text-[#5A3A31]">{adminData.lastLogin}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Admin Permissions */}
          <Card className="border-none shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#AA8F66]"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#AA8F66]/5 rounded-full"></div>
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center">
                <Shield size={20} className="text-[#AA8F66] mr-2" />
                <CardTitle className="text-[#5A3A31]">Admin Permissions</CardTitle>
              </div>
              <CardDescription className="text-[#5A3A31]/70">
                Access rights granted to your admin account
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 gap-3">
                {adminData.permissions.map((permission, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col p-3 bg-[#AA8F66]/5 hover:bg-[#AA8F66]/10 transition-colors border border-[#AA8F66]/10 shadow-sm rounded-lg cursor-pointer ${expandedPermission === permission.name ? 'bg-[#AA8F66]/10' : ''}`}
                    onClick={() => togglePermissionDetails(permission.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[#AA8F66] rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-[#5A3A31]">{permission.name}</span>
                      </div>
                      <div className={`transform transition-transform duration-200 ${expandedPermission === permission.name ? 'rotate-180' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9L12 15L18 9" stroke="#5A3A31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className={`mt-2 text-xs text-[#5A3A31]/70 overflow-hidden transition-all duration-300 ${expandedPermission === permission.name ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                      {permission.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Security Settings */}
          <Card className="border-none shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#5A3A31]"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5A3A31]/5 rounded-full"></div>
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center">
                <Lock size={20} className="text-[#5A3A31] mr-2" />
                <CardTitle className="text-[#5A3A31]">Security Settings</CardTitle>
              </div>
              <CardDescription className="text-[#5A3A31]/70">
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex justify-between items-center p-4 bg-[#AA8F66]/5 rounded-lg border border-[#AA8F66]/10 hover:shadow-md transition-shadow group">
                <div>
                  <h3 className="font-medium text-[#5A3A31] flex items-center">
                    <Lock size={16} className="text-[#5A3A31]/70 mr-2" />
                    Change Password
                  </h3>
                  <p className="text-sm text-[#5A3A31]/70 mt-1">Update your password regularly for security</p>
                </div>
                <Button size="sm" className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white shadow-sm transition-all duration-200 group-hover:scale-105">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Danger Zone */}
          <Card className="border-none shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
              <svg className="absolute -right-4 top-8 opacity-5" width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M10.1209 2.53125L2.69565 15.2812C1.94665 16.5747 1.57215 17.2214 1.61748 17.7384C1.65713 18.1895 1.90312 18.598 2.28394 18.8418C2.72497 19.125 3.47168 19.125 4.96511 19.125H19.0349C20.5283 19.125 21.275 19.125 21.7161 18.8418C22.0969 18.598 22.3429 18.1895 22.3825 17.7384C22.4278 17.2214 22.0533 16.5747 21.3043 15.2812L13.8791 2.53125C13.1335 1.24169 12.7607 0.596918 12.2908 0.346771C11.8795 0.128521 11.4032 0.127387 10.9908 0.343771C10.5192 0.592271 10.1444 1.23563 9.39485 2.53125H10.1209Z" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center">
                <AlertTriangle size={20} className="text-red-500 mr-2" />
                <CardTitle className="text-red-700">Danger Zone</CardTitle>
              </div>
              <CardDescription className="text-red-600">
                These actions are irreversible
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full shadow-sm transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  >
                    <AlertTriangle size={16} className="mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border border-red-200 shadow-xl">
                  <div className="absolute -z-10 inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/5 rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-500/5 rounded-full"></div>
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center text-red-700">
                      <AlertTriangle size={18} className="mr-2 text-red-500" /> 
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-red-600/80">
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-red-200 text-red-700 hover:bg-red-50">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                      className="bg-red-600 text-white hover:bg-red-700 shadow-sm"
                    >
                      {isLoading ? "Deleting..." : "Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 