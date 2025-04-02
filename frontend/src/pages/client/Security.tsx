import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import ClientLayout from "@/components/ClientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Lock } from "lucide-react";

export default function Security() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  if (!user) {
    return (
      <ClientLayout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
            <p className="mb-4">Please log in to view your security settings</p>
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
            backgroundImage: "url('https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#5A3A31]/60 to-[#AA8F66]/40"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl text-white font-medium">
                <span className="inline-flex items-center gap-3">
                  <Shield className="w-8 h-8 text-white/90" />
                  <span>Security Settings</span>
                  <Shield className="w-8 h-8 text-white/90" />
                </span>
              </h1>
              <p className="text-white/90 mt-3 text-base">
                Manage your account security
              </p>
            </div>
          </div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 relative -mt-12">
          <div className="bg-white rounded-xl shadow-xl border border-[#AA8F66]/20 overflow-hidden mb-6">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center border-b border-[#AA8F66]/10 pb-4">
                  <Lock className="h-5 w-5 mr-2 text-[#AA8F66]" />
                  <h2 className="text-xl font-bold">Change Password</h2>
                </div>
                
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="current-password" 
                        type="password" 
                        required 
                        className="pl-10 border border-[#AA8F66]/20 focus-visible:ring-[#AA8F66]"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#AA8F66]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input 
                        id="new-password" 
                        type="password" 
                        required 
                        className="pl-10 border border-[#AA8F66]/20 focus-visible:ring-[#AA8F66]"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#AA8F66]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        required 
                        className="pl-10 border border-[#AA8F66]/20 focus-visible:ring-[#AA8F66]"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#AA8F66]" />
                    </div>
                  </div>
                  <div>
                    <Button 
                      className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white" 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-xl border border-red-200 overflow-hidden mb-6">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center border-b border-red-200 pb-4">
                  <Shield className="h-5 w-5 mr-2 text-red-500" />
                  <h2 className="text-xl font-bold text-red-600">Delete Account</h2>
                </div>
                
                <div className="py-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount}>
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 