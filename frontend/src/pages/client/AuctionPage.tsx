import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Clock,
  MessageSquare,
  TrendingUp,
  Tag,
  Trophy,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Navbar from "../../components/Navbar";
import AuctionChat from "../../components/AuctionChat";
import BiddingInterface from "../../components/BiddingInterface";
import Leaderboards from "../../components/LeaderboardsInterface";
import {
  Artwork,
  formatCurrency,
  formatTimeRemaining,
  ArtworkType,
} from "../../data/artworks";
import { useAuth } from "@/lib/auth-context";
import TopBiddersList from "@/components/TopBiddersList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


const AuctionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState<any[]>([]);
  const { user } = useAuth();


  useEffect(() => {
    // First check if the API is reachable
    const checkApiAvailability = async () => {
      console.log("Checking API availability...");
      const endpoints = [
        "http://localhost:8081/api",
        "http://localhost:8080/api",
        "http://localhost:8081",
        "http://localhost:8080"
      ];
     
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying to reach ${endpoint}`);
          const response = await axios.get(endpoint, { timeout: 3000 });
          console.log(`API endpoint ${endpoint} is available:`, response.status);
          return true;
        } catch (error) {
          console.log(`API endpoint ${endpoint} is not available:`, error.message);
        }
      }
     
      console.error("Could not reach any API endpoint - backend may be down or not properly configured");
      toast({
        title: "API Connection Error",
        description: "Could not connect to the backend API. Please check if the server is running.",
        variant: "destructive"
      });
      return false;
    };


    const fetchArtworkData = async () => {
      if (!id) return;
     
      // Check API availability first
      const apiAvailable = await checkApiAvailability();
      if (!apiAvailable) {
        setLoading(false);
        return;
      }
     
      try {
        setLoading(true);
       
        console.log("Fetching item data for ID:", id);
       
        // Update the API endpoints to more directly match your MySQL database structure
        const possibleEndpoints = [
          // Direct MySQL field mapping endpoints
          `http://localhost:8080/api/auction/item/${id}`,
          `http://localhost:8080/api/auction/items/${id}`,
          `http://localhost:8080/api/item/details/${id}`,
          `http://localhost:8080/api/items/details/${id}`,
          // Try specific endpoints first
          `http://localhost:8080/api/items/${id}`,
          `http://localhost:8080/api/item/${id}`,
          // Add endpoints for your exact database structure
          `http://localhost:8080/api/getItem/${id}`,
          `http://localhost:8080/api/getItemDetails/${id}`,
          // More variations
          `http://localhost:8081/api/items/${id}`,
          `http://localhost:8081/api/item/${id}`
        ];
       
        let itemData;
        let apiSuccess = false;
       
        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            const response = await axios.get(endpoint);
            console.log(`Response from ${endpoint}:`, response);
           
            // Check if we got HTML instead of JSON
            if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
              console.log("Received HTML instead of JSON data. This endpoint is not a valid API.");
              continue; // Skip this endpoint and try the next one
            }
           
            if (response.data) {
              itemData = response.data;
              apiSuccess = true;
              console.log("Successfully fetched data from:", endpoint);
              break;
            }
          } catch (error) {
            console.log(`Endpoint ${endpoint} failed:`, error);
          }
        }
       
        if (!apiSuccess || !itemData) {
          console.error("All API endpoints failed. No data retrieved.");
          throw new Error("Failed to connect to any API endpoint");
        }
       
        console.log("Final item data:", itemData);
       
        // Inside the fetchArtworkData function, after getting the response
        // This is a standard Spring Boot response structure handling
        if (itemData && itemData.data) {
          console.log("Standard Spring response with data property found");
          itemData = itemData.data;
        }


        // Check for success response wrapper (common in Java backends)
        if (itemData && itemData.status === true && itemData.data) {
          console.log("Success response wrapper found, extracting data");
          itemData = itemData.data;
        }


        console.log("Raw API response structure:", JSON.stringify(itemData, null, 2));
       
        // Now try to get the bids
        let bidsData = [];
        const possibleBidEndpoints = [
          `http://localhost:8080/api/bids/item/${id}`,
          `http://localhost:8080/api/bid/item/${id}`,
          `http://localhost:8082/api/bids/item/${id}`,
          `http://localhost:8082/api/bid/item/${id}`,
          `http://localhost:8081/api/bids/item/${id}`,
          `http://localhost:8081/api/bid/item/${id}`,
          // Add API paths without /api prefix
          `http://localhost:8080/bids/item/${id}`,
          `http://localhost:8080/bid/item/${id}`
        ];
       
        for (const endpoint of possibleBidEndpoints) {
          try {
            console.log(`Trying bids endpoint: ${endpoint}`);
            const response = await axios.get(endpoint);
           
            // Check if we got HTML instead of JSON
            if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
              console.log("Received HTML instead of JSON data. This endpoint is not a valid API.");
              continue; // Skip this endpoint and try the next one
            }
           
            console.log(`Bids response from ${endpoint}:`, response);
            if (response.data) {
              bidsData = response.data || [];
              console.log("Successfully fetched bids from:", endpoint);
              break;
            }
          } catch (error) {
            console.log(`Bids endpoint ${endpoint} failed:`, error);
          }
        }
       
        console.log("Final bids data:", bidsData);
       
        // Now update the mapping to handle more possible structures
        const mappedArtwork: Artwork = {
          id: (itemData.item_id || itemData.id || id || "0").toString(),
          title: itemData.name || "Untitled Item",
          description: itemData.description || "No description available",
          artist: getUserName(itemData),
          type: getCategoryName(itemData),
          image: getItemImage(itemData),
          // Improve starting price extraction
          startingBid: extractStartingPrice(itemData),
          currentBid: findHighestBid(bidsData) || extractCurrentBid(itemData),
          auctionEnds: new Date(itemData.end_time || itemData.endTime || Date.now() + 3600000),
          bids: Array.isArray(bidsData) ? bidsData.map((bid: any) => ({
            id: (bid.bid_id || bid.id || Math.random()).toString(),
            userId: (bid.customer_id || bid.user_id || (bid.customer?.id) || "").toString(),
            userName: bid.username || bid.customer_name || getUserNameFromBid(bid) || "Anonymous Bidder",
            amount: parseFloat(bid.bid_amount || bid.bidAmount) || 0,
            timestamp: new Date(bid.bid_time || bid.bidTime || Date.now())
          })) : [],
          chat: [], // No chat functionality yet
          featured: Boolean(itemData.featured),
          createdAt: new Date(itemData.created_at || itemData.createdAt || Date.now()),
          auctionStatus: itemData.auction_status || itemData.auctionStatus || "ACTIVE"
        };
       
        // Set up a refresh interval for time remaining and bid updates
        const refreshInterval = setInterval(async () => {
          // Refresh bids to get latest data
          for (const endpoint of possibleBidEndpoints) {
            try {
              const response = await axios.get(endpoint);
              if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
                continue;
              }
             
              if (response.data) {
                const freshBids = response.data || [];
                const highestBid = findHighestBid(freshBids);
               
                // Only update if we have a higher bid or new bids
                if (highestBid > mappedArtwork.currentBid || freshBids.length > mappedArtwork.bids.length) {
                  console.log("Updating with new bid data:", freshBids);
                 
                  // Map new bids to the right format
                  const mappedBids = freshBids.map((bid: any) => ({
                    id: (bid.bid_id || bid.id || Math.random()).toString(),
                    userId: (bid.customer_id || (bid.customer?.id) || "").toString(),
                    userName: bid.customer_name || (bid.customer ?
                      `${bid.customer.firstName || ''} ${bid.customer.lastName || ''}` :
                      "Anonymous Bidder"),
                    amount: parseFloat(bid.bid_amount || bid.bidAmount) || 0,
                    timestamp: new Date(bid.bid_time || bid.bidTime || Date.now())
                  }));
                 
                  // Update artwork with new data
                  setArtwork(prevArtwork => {
                    if (!prevArtwork) return mappedArtwork;
                    return {
                      ...prevArtwork,
                      currentBid: highestBid,
                      bids: mappedBids
                    };
                  });
                }
                break;
              }
            } catch (error) {
              // Silent error on refresh - just try again next interval
            }
          }
        }, 10000); // Refresh every 10 seconds
       
        setArtwork(mappedArtwork);
       
        // Cleanup interval on unmount
        return () => clearInterval(refreshInterval);
       
      } catch (error) {
        console.error("Failed to fetch artwork data:", error);
        if (axios.isAxiosError(error)) {
          console.error("Response status:", error.response?.status);
          console.error("Response data:", error.response?.data);
          console.error("Request URL:", error.config?.url);
        }
       
        // Display empty artwork structure with explanation
        const emptyArtwork: Artwork = {
          id: id || "0",
          title: "Database Connection Error",
          description: "We couldn't retrieve the item data from the database. This is what would normally appear here if the connection was working properly.",
          artist: "Unknown Artist",
          type: "Uncategorized" as ArtworkType,
          image: "/placeholder.svg",
          startingBid: 0,
          currentBid: 0,
          auctionEnds: new Date(Date.now() + 3600000),
          bids: [],
          chat: [],
          featured: false,
          createdAt: new Date(),
          auctionStatus: "ACTIVE"
        };
       
        // Set empty artwork to show structure
        setArtwork(emptyArtwork);
       
        toast({
          title: "Database Error",
          description: "Failed to load auction data from the database. Please verify your backend connection.",
          variant: "destructive"
        });
      } finally {
      setLoading(false);
    }
    };


    // Helper function to find highest bid amount
    const findHighestBid = (bids: any[]): number => {
      if (!bids || bids.length === 0) return 0;
     
      let highest = 0;
      for (const bid of bids) {
        const amount = parseFloat(bid.bid_amount || bid.bidAmount) || 0;
        if (amount > highest) highest = amount;
      }
      return highest;
    };


    // Add these helper functions right after the findHighestBid function
    function extractStartingPrice(data: any): number {
      console.log("Extracting starting price from:", data);
     
      // Try all possible field names for starting price
      const startingPrice =
        data.starting_price ||
        data.startingPrice ||
        data.initial_price ||
        data.initialPrice ||
        data.start_price ||
        (data.details && data.details.starting_price) ||
        (data.details && data.details.startingPrice);
       
      console.log("Found starting price:", startingPrice);
     
      // If found, parse it to float, otherwise default to 0
      return parseFloat(startingPrice) || 0;
    }


    function extractCurrentBid(data: any): number {
      // Try all possible field names for current bid
      return parseFloat(
        data.current_bid ||
        data.currentBid ||
        data.highest_bid ||
        data.highest_bid_amount ||
        data.highestBid ||
        data.starting_price ||
        data.startingPrice ||
        0
      );
    }


    fetchArtworkData();
  }, [id]);


  const handleSendMessage = (message: string) => {
    if (!artwork) return;


    // In a real app, this would be sent to a backend API
    const newMessage = {
      id: `c${Date.now()}`,
      userId: "current-user",
      userName: "You",
      message,
      timestamp: new Date(),
    };


    setArtwork({
      ...artwork,
      chat: [...artwork.chat, newMessage],
    });


    toast({
      title: "Message sent",
      description: "Your message has been sent to the auction chat",
    });
  };


  const handlePlaceBid = async (amount: number) => {
    if (!artwork || !user) return;


    try {
      // Try multiple API endpoints for placing a bid
      let bidResponse;
      let success = false;
      const bidEndpoints = [
        'http://localhost:8080/api/bid',
        'http://localhost:8080/api/bids',
        'http://localhost:8081/api/bid',
        'http://localhost:8081/api/bids'
      ];
     
      for (const endpoint of bidEndpoints) {
        try {
          console.log(`Trying to place bid at endpoint: ${endpoint}`);
         
          // Try with camelCase fields
          bidResponse = await axios.post(endpoint, {
            itemId: parseInt(artwork.id),
            customerId: user.id,
            bidAmount: amount
          }, {
            withCredentials: true
          });
         
          console.log(`Bid successful at ${endpoint} with camelCase fields`);
          success = true;
          break;
        } catch (error) {
          console.log(`Failed with camelCase at ${endpoint}, trying snake_case`);
         
          try {
            // Try with snake_case fields
            bidResponse = await axios.post(endpoint, {
              item_id: parseInt(artwork.id),
              customer_id: user.id,
              bid_amount: amount
            }, {
              withCredentials: true
            });
           
            console.log(`Bid successful at ${endpoint} with snake_case fields`);
            success = true;
            break;
          } catch (secondError) {
            console.log(`Failed with snake_case at ${endpoint} as well`);
          }
        }
      }
     
      if (!success) {
        throw new Error("All bid endpoints failed");
      }
     
      console.log("Bid response:", bidResponse.data);
     
      // If successful, update the local state
    const newBid = {
        id: bidResponse.data.id?.toString() || bidResponse.data.bid_id?.toString() || Date.now().toString(),
        userId: user.id.toString(),
        userName: user.username || "You",
        amount: amount,
      timestamp: new Date(),
    };


      // Update artwork with new bid
    setArtwork({
      ...artwork,
      currentBid: amount,
      bids: [...artwork.bids, newBid],
    });


    toast({
      title: "Bid placed",
      description: `Your bid of ${formatCurrency(amount)} has been placed`,
    });
    } catch (error) {
      console.error("Failed to place bid:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
      }
     
      toast({
        title: "Bid Failed",
        description: "There was an error placing your bid. Please try again.",
        variant: "destructive"
      });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-32 pb-16 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gallery-beige h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gallery-beige rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gallery-beige rounded"></div>
                  <div className="h-4 bg-gallery-beige rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (!artwork) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-32 pb-16 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-display font-medium mb-4">
              Artwork Not Found
            </h1>
            <p className="text-gallery-text/70 mb-6">
              The artwork you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gallery-accent hover:text-gallery-accent/80"
            >
              <ArrowLeft size={16} />
              Return to Home
            </Link>
           
            {/* Debug Panel */}
            <div className="mt-12 p-4 bg-gray-100 text-left rounded-md">
              <h2 className="text-lg font-bold mb-2">Debug Information</h2>
              <div className="space-y-2 text-sm">
                <p>Requested Item ID: {id}</p>
                <p>Backend Status: Check browser console for details</p>
                <p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs"
                  >
                    Refresh Page
                  </button>
                </p>
                <div className="mt-4">
                  <h3 className="font-bold text-xs mb-1">Troubleshooting:</h3>
                  <ol className="list-decimal pl-4 text-xs">
                    <li>Verify backend server is running at http://localhost:8080 or http://localhost:8081</li>
                    <li>Check database connection in the backend</li>
                    <li>Ensure the item with ID {id} exists in the database</li>
                    <li>Examine browser console for API errors</li>
                    <li>Clear browser cache and try again</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white">
      <Navbar />


      <div className="container mx-auto pt-32 pb-16 px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/auctions"
            className="inline-flex items-center gap-1 text-sm text-gallery-text/70 hover:text-gallery-accent transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Auctions
          </Link>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Artwork Image and Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="aspect-[4/3] relative">
                {artwork.image && artwork.image !== "/placeholder.svg" ? (
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-contain bg-[#EFEBE9]/20"
                  onError={(e) => {
                      console.log("Image failed to load, using placeholder");
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#EFEBE9]/20">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
            </div>


            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-display text-[#5D4037] font-medium mb-2">
                  {artwork.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-[#5D4037]/70">
                  <User size={14} />
                  <span>{artwork.artist}</span>
                </div>
              </div>


              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1 text-xs bg-[#EFEBE9] px-2 py-1 rounded">
                  <Tag size={12} />
                  {artwork.type}
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-[#EFEBE9] text-[#5D4037] px-2 py-1 rounded">
                  <Clock size={12} />
                  {formatTimeRemaining(artwork.auctionEnds)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-[#EFEBE9] px-2 py-1 rounded">
                  <MessageSquare size={12} />
                  {artwork.chat.length} messages
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-[#EFEBE9] px-2 py-1 rounded">
                  <TrendingUp size={12} />
                  {artwork.bids.length} bids
                </span>
              </div>


              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-lg font-medium mb-3 text-[#5D4037]">Description</h2>
                <p className="text-[#3E2723]/80 leading-relaxed">
                  {artwork.description}
                </p>
              </div>
            </div>
          </div>


          {/* Bidding Interface and Chat */}
          <div className="space-y-8 relative pb-16">
            <BiddingInterface artwork={artwork} onPlaceBid={handlePlaceBid} />
           
            {/* Top Bidder Leaderboard */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Trophy size={18} />
                    <span>Top Bidder</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {artwork.bids && artwork.bids.length > 0 ? (
                  <TopBiddersList bids={artwork.bids} maxDisplay={5} />
                ) : (
                  <div className="text-center text-gray-500 py-2">
                    No bids have been placed yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
       
        {/* Auction Chat integrated directly in the page */}
        <AuctionChat
          artwork={artwork}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};


// Helper function to extract user name from different formats
function getUserName(data: any): string {
  // Try all seller mappings for MySQL structure
  if (data.seller_id) {
    // There's a seller ID reference but no joined data
    return `Seller #${data.seller_id}`;
  }
 
  // Try other field formats based on your MySQL tables
  if (data.seller_username) {
    return data.seller_username;
  }
 
  if (data.username) {
    return data.username;
  }
 
  // Try name fields
  if (data.first_name && data.last_name) {
    return `${data.first_name} ${data.last_name}`;
  }
 
  // Try standard structure
  if (data.seller) {
    if (data.seller.first_name && data.seller.last_name) {
      return `${data.seller.first_name} ${data.seller.last_name}`;
    } else if (data.seller.firstName && data.seller.lastName) {
      return `${data.seller.firstName} ${data.seller.lastName}`;
    } else if (data.seller.username) {
      return data.seller.username;
    }
  }
 
  // Last resort
  return "Unknown Artist";
}


// Helper function to extract username from bid
function getUserNameFromBid(bid: any): string {
  if (bid.customer) {
    if (bid.customer.first_name && bid.customer.last_name) {
      return `${bid.customer.first_name} ${bid.customer.last_name}`;
    } else if (bid.customer.firstName && bid.customer.lastName) {
      return `${bid.customer.firstName} ${bid.customer.lastName}`;
    } else if (bid.customer.username) {
      return bid.customer.username;
    }
  }
 
  if (bid.username) {
    return bid.username;
  }
 
  if (bid.first_name && bid.last_name) {
    return `${bid.first_name} ${bid.last_name}`;
  }
 
  if (bid.customer_name) {
    return bid.customer_name;
  }
 
  return "Anonymous Bidder";
}


// Helper function to extract category name from MySQL structure
function getCategoryName(data: any): ArtworkType {
  // Check for direct category_id reference
  if (data.category_id) {
    // Map category IDs to names based on your MySQL structure
    // In a real app, you would fetch category names from the database
    const categoryMap: {[key: number]: ArtworkType} = {
      1: "painting",
      2: "sculpture",
      3: "handicraft",
      4: "photography",
      5: "digital"
    };
   
    return categoryMap[data.category_id] || "Uncategorized" as ArtworkType;
  }
 
  // Try other formats
  if (data.category && data.category.name) {
    return data.category.name as ArtworkType;
  }
 
  if (data.category_name) {
    return data.category_name as ArtworkType;
  }
 
  return "Uncategorized" as ArtworkType;
}


// Helper function to extract image
function getItemImage(data: any): string {
  if (data.image_base64 && data.image_base64.startsWith('http')) {
    return data.image_base64;
  }
 
  if (data.imageBase64 && data.imageBase64.startsWith('http')) {
    return data.imageBase64;
  }
 
  if (data.image && data.image.startsWith('http')) {
    return data.image;
  }
 
  // Attempt to decode base64 if it's actually base64
  if (data.image_base64 && !data.image_base64.startsWith('http')) {
    return `data:image/jpeg;base64,${data.image_base64}`;
  }
 
  return "/placeholder.svg";
}


export default AuctionPage;
