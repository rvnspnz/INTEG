import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import SellerLayout from "@/components/Layout/SellerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, Search, Trash, Clock, CheckCircle, XCircle, AlertCircle, Hourglass, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuctionForm from "@/components/AuctionForm";

// Sample auction data with expanded status types
const sampleAuctions = [
  {
    id: "1",
    title: "Abstract Expressionism #45",
    description: "A vibrant piece showcasing modern abstract expressionism techniques",
    startingPrice: 950,
    currentBid: 1250,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3",
    endDate: "2023-12-28T23:59:59",
    status: "active",
    bidCount: 8
  },
  {
    id: "2",
    title: "Digital Landscape Series",
    description: "Digital art print featuring futuristic landscape",
    startingPrice: 650,
    currentBid: 850,
    image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?ixlib=rb-4.0.3",
    endDate: "2023-12-25T23:59:59",
    status: "active",
    bidCount: 5
  },
  {
    id: "3",
    title: "Vintage Portrait Collection",
    description: "Classic portrait in oil on canvas",
    startingPrice: 1800,
    currentBid: 2100,
    image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?ixlib=rb-4.0.3",
    endDate: "2023-12-20T23:59:59",
    status: "ended",
    bidCount: 12
  },
  {
    id: "4",
    title: "Modern Sculpture Series",
    description: "Contemporary sculpture made from recycled materials",
    startingPrice: 1200,
    currentBid: 0,
    image: "https://images.unsplash.com/photo-1576020799627-aeac74d58d8e?ixlib=rb-4.0.3",
    endDate: "2024-01-15T23:59:59",
    status: "pending",
    bidCount: 0
  },
  {
    id: "5",
    title: "Watercolor Landscape",
    description: "Beautiful watercolor painting of a mountain landscape",
    startingPrice: 850,
    currentBid: 0,
    image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af?ixlib=rb-4.0.3",
    endDate: "2024-01-20T23:59:59",
    status: "rejected",
    bidCount: 0,
    rejectionReason: "Image quality does not meet our standards. Please upload higher resolution photos."
  },
  {
    id: "6",
    title: "Abstract Painting Collection",
    description: "Series of abstract paintings with vibrant colors",
    startingPrice: 1500,
    currentBid: 0,
    image: "https://images.unsplash.com/photo-1569091791842-7cfb64e04797?ixlib=rb-4.0.3",
    endDate: "2024-02-05T23:59:59",
    status: "pending",
    bidCount: 0
  }
];

export default function MyAuctions() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter auctions based on search term and active tab
  const filteredAuctions = sampleAuctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && auction.status === "active";
    if (activeTab === "pending") return matchesSearch && auction.status === "pending";
    if (activeTab === "rejected") return matchesSearch && auction.status === "rejected";
    if (activeTab === "ended") return matchesSearch && auction.status === "ended";
    
    return false;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" /> Active
          </Badge>
        );
      case "ended":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <Clock className="w-3 h-3 mr-1" /> Ended
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Hourglass className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Unknown
          </Badge>
        );
    }
  };

  // Calculate time remaining
  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    
    if (now > end) return "Auction ended";
    
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    }
    
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
  };

  const handleAuctionSubmit = () => {
    setIsDialogOpen(false);
    // Here you would add the actual logic to create an auction
    // For demonstration, we're just closing the dialog
  };

  if (!user) {
    return (
      <SellerLayout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">My Auctions</h1>
            <p className="mb-4">Please log in to view your auctions</p>
            <Button className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white" asChild>
              <a href="/login">Log In</a>
            </Button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  // Count items by status
  const statusCounts = {
    active: sampleAuctions.filter(item => item.status === "active").length,
    pending: sampleAuctions.filter(item => item.status === "pending").length,
    rejected: sampleAuctions.filter(item => item.status === "rejected").length,
    ended: sampleAuctions.filter(item => item.status === "ended").length,
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Auctions</h1>
            <p className="text-muted-foreground">
              Manage all your auction items in one place
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Auction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Create New Auction</DialogTitle>
              </DialogHeader>
              <div className="max-h-[80vh] overflow-y-auto py-4">
                <AuctionForm onSubmit={handleAuctionSubmit} isEditable={true} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Active Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.active}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Hourglass className="w-4 h-4 mr-2 text-yellow-600" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <XCircle className="w-4 h-4 mr-2 text-red-600" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.rejected}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-600" />
                Ended
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.ended}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search auctions..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-5 w-full sm:w-[500px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Your Auction Items */}
        <Card>
          <CardHeader>
            <CardTitle>Your Auction Items</CardTitle>
            <CardDescription>
              Manage your active, pending, rejected, and ended auctions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAuctions.length > 0 ? (
              <div className="space-y-4">
                {filteredAuctions.map((auction) => (
                  <div key={auction.id} className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={auction.image} 
                        alt={auction.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-base font-medium truncate">{auction.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{auction.description}</p>
                        </div>
                        <div>{getStatusBadge(auction.status)}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground">Starting Price: </span>
                          <span className="text-xs font-medium ml-1">
                            ${auction.startingPrice.toLocaleString()}
                          </span>
                        </div>
                        {auction.status !== "pending" && auction.status !== "rejected" && (
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground">Current Bid: </span>
                            <span className="text-xs font-medium ml-1">
                              {auction.currentBid > 0 ? `$${auction.currentBid.toLocaleString()}` : "No bids yet"}
                            </span>
                          </div>
                        )}
                        {auction.status === "active" && (
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground">Bid Count: </span>
                            <span className="text-xs font-medium ml-1">{auction.bidCount}</span>
                          </div>
                        )}
                        {auction.status === "active" && (
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground">Time: </span>
                            <span className="text-xs font-medium ml-1">{getTimeRemaining(auction.endDate)}</span>
                          </div>
                        )}
                        {auction.status === "rejected" && "rejectionReason" in auction && (
                          <div className="col-span-2 mt-1">
                            <span className="text-xs text-red-600">Reason: {(auction as any).rejectionReason}</span>
                          </div>
                        )}
                        {auction.status === "pending" && (
                          <div className="text-xs text-yellow-600 col-span-2 mt-1">
                            Your item is awaiting review by our team
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No auctions found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? "No results match your search criteria." : "You haven't created any auctions yet."}
                </p>
                <Button 
                  className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white" 
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Auction
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
}