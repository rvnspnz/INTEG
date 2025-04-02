import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import ClientLayout from "@/components/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Clock, DollarSign, ChevronRight } from "lucide-react";

// Mock auction history data
const mockAuctionHistory = [
  {
    id: "1",
    title: "Abstract Expressionism #45",
    artist: "Emma Johnson",
    date: "12/15/2023",
    timeLeft: "Ended",
    dimensions: "24x36 inches",
    currentBid: 1250,
    yourBid: 1250,
    status: "won",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3"
  },
  {
    id: "2",
    title: "Digital Landscape Series",
    artist: "Carlos Mendez",
    date: "12/18/2023",
    timeLeft: "Ended",
    dimensions: "18x24 inches",
    currentBid: 950,
    yourBid: 850,
    status: "outbid",
    image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?ixlib=rb-4.0.3"
  },
  {
    id: "3",
    title: "Vintage Portrait Collection",
    artist: "Sophia Chen",
    date: "01/05/2024",
    timeLeft: "2 days",
    dimensions: "16x20 inches",
    currentBid: 2100,
    yourBid: 2100,
    status: "leading",
    image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?ixlib=rb-4.0.3"
  },
  {
    id: "4",
    title: "Modern Sculpture Series #7",
    artist: "David Wagner",
    date: "01/10/2024",
    timeLeft: "5 days",
    dimensions: "12x15x20 inches",
    currentBid: 3450,
    yourBid: 3200,
    status: "outbid",
    image: "https://images.unsplash.com/photo-1576020799627-aeac74d58d8d?ixlib=rb-4.0.3"
  }
];

export default function Auction() {
  const { user } = useAuth();
  const [auctionHistory, setAuctionHistory] = useState(mockAuctionHistory);
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Simulate fetching auction history data
  useEffect(() => {
    // In a real application, you would fetch the user's auction history here
    const timer = setTimeout(() => {
      setAuctionHistory(mockAuctionHistory);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter auction history based on active filter
  const filteredAuctions = auctionHistory.filter(auction => {
    if (activeFilter === "all") return true;
    return auction.status === activeFilter;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-100 text-green-800 border-green-200";
      case "outbid":
        return "bg-red-100 text-red-800 border-red-200";
      case "leading":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "won":
        return "Won";
      case "outbid":
        return "Outbid";
      case "leading":
        return "Leading";
      default:
        return status;
    }
  };
  
  if (!user) {
    return (
      <ClientLayout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
            <p className="mb-4">Please log in to view your auction history</p>
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
            backgroundImage: "url('https://images.unsplash.com/photo-1576020799627-aeac74d58d8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#5A3A31]/60 to-[#AA8F66]/40"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl text-white font-medium">
                <span className="inline-flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-white/90" />
                  <span>My Auctions</span>
                  <Trophy className="w-8 h-8 text-white/90" />
                </span>
              </h1>
              <p className="text-white/90 mt-3 text-base">
                Track your bids and auction activities
              </p>
            </div>
          </div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={activeFilter === "all" ? "default" : "outline"} 
              className={activeFilter === "all" ? "bg-[#AA8F66] hover:bg-[#AA8F66]/90" : "border-[#AA8F66]/20 text-[#5A3A31]"}
              onClick={() => setActiveFilter("all")}
            >
              All Auctions
            </Button>
            <Button 
              variant={activeFilter === "leading" ? "default" : "outline"} 
              className={activeFilter === "leading" ? "bg-[#AA8F66] hover:bg-[#AA8F66]/90" : "border-[#AA8F66]/20 text-[#5A3A31]"}
              onClick={() => setActiveFilter("leading")}
            >
              Leading
            </Button>
            <Button 
              variant={activeFilter === "outbid" ? "default" : "outline"} 
              className={activeFilter === "outbid" ? "bg-[#AA8F66] hover:bg-[#AA8F66]/90" : "border-[#AA8F66]/20 text-[#5A3A31]"}
              onClick={() => setActiveFilter("outbid")}
            >
              Outbid
            </Button>
            <Button 
              variant={activeFilter === "won" ? "default" : "outline"} 
              className={activeFilter === "won" ? "bg-[#AA8F66] hover:bg-[#AA8F66]/90" : "border-[#AA8F66]/20 text-[#5A3A31]"}
              onClick={() => setActiveFilter("won")}
            >
              Won
            </Button>
          </div>
          
          {/* Auction List */}
          <div className="space-y-4">
            {filteredAuctions.length === 0 ? (
              <div className="text-center py-12 bg-[#AA8F66]/5 rounded-xl border border-[#AA8F66]/10">
                <Trophy className="mx-auto h-12 w-12 text-[#AA8F66]/40" />
                <h3 className="mt-4 text-xl font-semibold text-[#5A3A31]">No auction activity found</h3>
                <p className="mt-2 text-[#5A3A31]/60">You haven't participated in any auctions matching this filter yet.</p>
                <Button className="mt-6 bg-[#AA8F66] hover:bg-[#AA8F66]/90" asChild>
                  <a href="/auctions">Browse Auctions</a>
                </Button>
              </div>
            ) : (
              filteredAuctions.map((auction) => (
                <Card key={auction.id} className="overflow-hidden border border-[#AA8F66]/20 hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 bg-[#AA8F66]/10 flex-shrink-0">
                      <img 
                        src={auction.image} 
                        alt={auction.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/200x200/e9e3dd/aa8f66?text=Artwork";
                        }}
                      />
                    </div>
                    <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row justify-between">
                      <div>
                        <div className="flex items-center justify-between md:justify-start">
                          <h3 className="text-xl font-bold">{auction.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={`ml-2 capitalize ${getStatusColor(auction.status)}`}
                          >
                            {getStatusText(auction.status)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">by {auction.artist}</p>
                        
                        <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-[#AA8F66]" />
                            <div>
                              <p className="text-muted-foreground">Time Left</p>
                              <p>{auction.timeLeft}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Trophy className="w-4 h-4 mr-2 text-[#AA8F66]" />
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p>{auction.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                        <div className="text-right">
                          <div className="flex items-center justify-end">
                            <DollarSign className="w-4 h-4 mr-1 text-[#AA8F66]" />
                            <span className="text-xl font-bold">${auction.currentBid.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Your bid: ${auction.yourBid.toLocaleString()}
                          </p>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="mt-4 border-[#AA8F66] text-[#AA8F66] hover:bg-[#AA8F66]/10"
                          asChild
                        >
                          <a href={`/auctions/${auction.id}`}>
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 