import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

export default function SellerApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showAlreadySubmittedDialog, setShowAlreadySubmittedDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Split user name into first and last name if available
  const getUserNames = () => {
    if (!user) return { firstName: "", lastName: "" };
    
    // If user has a name property, try to split it
    if (user.name) {
      const nameParts = user.name.split(' ');
      return {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || ""
      };
    }
    
    return { firstName: "", lastName: "" };
  };

  const { firstName, lastName } = getUserNames();

  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    username: user?.username || "",
    email: user?.email || "",
    background: "",
    agreesToTerms: false,
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      const { firstName, lastName } = getUserNames();
      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        username: user.username || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [backgroundValid, setBackgroundValid] = useState(true);

  // Redirect if not logged in
  if (!user) {
    toast.error("You must be logged in to apply as a seller");
    navigate("/login");
    return null;
  }

  const validateName = (name) => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/.test(email);
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstName") {
      setFirstNameValid(validateName(value));
    }
    if (name === "lastName") {
      setLastNameValid(validateName(value));
    }

    if (name === "background") {
      if (countWords(value) > 200) {
        setBackgroundValid(false);
        toast.error("Background must not exceed 200 words.");
      } else {
        setBackgroundValid(true);
      }
    }

    if (name === "email") {
      setEmailValid(validateEmail(value));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameBlur = (name: "firstName" | "lastName") => {
    if (!validateName(formData[name])) {
      if (name === "firstName") {
        setFirstNameValid(false);
        toast.error("First name must contain only letters.");
      } else {
        setLastNameValid(false);
        toast.error("Last name must contain only letters.");
      }
    } else {
      if (name === "firstName") setFirstNameValid(true);
      if (name === "lastName") setLastNameValid(true);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (!emailValid) {
      toast.error("Please enter a valid email before agreeing to the terms.");
      return;
    }
    setFormData((prev) => ({ ...prev, agreesToTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailValid) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (!formData.agreesToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Only store the background information
      const description = formData.background.substring(0, 200);
      
      // Create application data matching the database schema
      const applicationData = {
        user_id: parseInt(user.id),  // user_id field as per database schema
        description: description      // description field as required in the schema
      };

      console.log("Sending application data:", applicationData);

      // Send the application to the backend using the simple endpoint
      const response = await fetch("http://localhost:8080/seller-applications/simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
        credentials: "include" // Important: include cookies/session
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", response.status, errorText);
        
        // Check if error is due to already submitted application
        if (errorText.includes("already submitted") || response.status === 409) {
          setShowAlreadySubmittedDialog(true);
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      } else {
        // Show success dialog
        setShowSuccessDialog(true);
        
        // Success toast notification
        toast.success("Application submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting seller application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    navigate("/");
  };

  const handleCloseAlreadySubmittedDialog = () => {
    setShowAlreadySubmittedDialog(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F5]">
      {/* Include Navbar directly instead of ClientLayout */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex-1 pt-[70px]">
        <div className="container max-w-4xl py-12">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4 text-[#5A3A31]">Become a Seller</h1>
            <div className="w-20 h-1 bg-[#AA8F66] mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Complete this form to apply as a seller on our platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Provide your contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} onBlur={() => handleNameBlur("firstName")} required disabled />
                    {!firstNameValid && <p className="text-red-500 text-sm">First name must contain only letters.</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} onBlur={() => handleNameBlur("lastName")} required disabled />
                    {!lastNameValid && <p className="text-red-500 text-sm">Last name must contain only letters.</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={formData.username} onChange={handleInputChange} required disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required disabled />
                    {!emailValid && <p className="text-red-500 text-sm">Please input registered email.</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
                <CardDescription>Share your art experience and background.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="background">What interests you in becoming a seller?</Label>
                    <Textarea
                      id="background"
                      name="background"
                      value={formData.background}
                      onChange={handleInputChange}
                      placeholder="Tell us about your art background, achievements, and experience..."
                      className="min-h-[100px]"
                      required
                    />
                    {!backgroundValid && (
                      <p className="text-red-500 text-sm">Background must not exceed 200 words.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreesToTerms}
                    onCheckedChange={handleCheckboxChange}
                    disabled={!emailValid || !firstNameValid || !lastNameValid}
                  />
                  <Label htmlFor="terms">I agree to the terms and conditions</Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-[#AA8F66] hover:bg-[#9A805D] text-white"
                size="lg" 
                disabled={
                  isSubmitting ||
                  !formData.firstName || 
                  !formData.lastName || 
                  !formData.username || 
                  !formData.email || 
                  !formData.background || 
                  !formData.agreesToTerms ||
                  !firstNameValid || 
                  !lastNameValid || 
                  !emailValid || 
                  !backgroundValid
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
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

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-4 pb-2">
              <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <span className="text-xl">Application Submitted!</span>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 pb-4">
              <p className="mb-4">
                Thank you for applying to become a seller on our platform.
              </p>
              <div className="bg-amber-50 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
                  <Clock className="h-5 w-5" />
                  <span>Pending Admin Approval</span>
                </div>
                <p className="text-sm text-amber-600 text-left">
                  Your application is now being reviewed by our admin team. This process typically takes 1-3 business days. 
                  You'll receive an email notification once your application has been approved.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>What's Next?</span>
                </div>
                <ul className="text-sm text-blue-600 text-left list-disc pl-5 space-y-1">
                  <li>Our team will review your profile and seller information</li>
                  <li>You may be contacted for additional information if needed</li>
                  <li>Once approved, you'll gain access to seller features</li>
                  <li>You can check your application status in your profile</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              className="w-full bg-[#AA8F66] hover:bg-[#9A805D] text-white" 
              onClick={handleCloseDialog}
            >
              Got it, thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Already Submitted Dialog */}
      <Dialog open={showAlreadySubmittedDialog} onOpenChange={setShowAlreadySubmittedDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-4 pb-2">
              <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-amber-500" />
              </div>
              <span className="text-xl">Application Already Submitted</span>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 pb-4">
              <p className="mb-4">
                You have already submitted a seller application.
              </p>
              <div className="bg-amber-50 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
                  <Clock className="h-5 w-5" />
                  <span>Application Status</span>
                </div>
                <p className="text-sm text-amber-600 text-left">
                  Your application is currently being reviewed by our admin team. This process typically takes 1-3 business days.
                  You'll receive an email notification once your application has been approved.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Need Assistance?</span>
                </div>
                <p className="text-sm text-blue-600 text-left">
                  If you believe there's been an error or you need to update your application, please contact our support team for assistance.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              className="w-full bg-[#AA8F66] hover:bg-[#9A805D] text-white" 
              onClick={handleCloseAlreadySubmittedDialog}
            >
              Got it, thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}