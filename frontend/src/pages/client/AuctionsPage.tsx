import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import Navbar from "../../components/Navbar";
<<<<<<< Updated upstream
import ArtworkCard from "../../components/ArtworkCard";
import { artworks, ArtworkType } from "../../data/artworks";
import { Search, Filter, Plus } from "lucide-react";
=======
import { Search, Filter } from "lucide-react";
>>>>>>> Stashed changes
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateAuctionDialog from "@/components/CreateAuctionDialog";
<<<<<<< Updated upstream
=======
import ArtworkCard from "@/components/ArtworkCard";
import axios from "axios";
import { ArtworkType } from "@/data/artworks";

interface Artwork {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  image: string;
  artist: string;
  type: ArtworkType;
  auctionEnds: Date;
  startingBid: number;
  bids: Array<{ id: string; userId: string; userName: string; amount: number; timestamp: Date }>;
  chat: Array<{ id: string; userId: string; userName: string; message: string; timestamp: Date }>;
  featured: boolean;
  createdAt: Date;
  auctionStatus: 'NOT_STARTED' | 'ACTIVE' | 'ENDED';
  itemStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}
>>>>>>> Stashed changes

const AuctionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ArtworkType | "all">("all");
  const [sortBy, setSortBy] = useState<
<<<<<<< Updated upstream
    "ending-soon" | "price-high" | "price-low" | "newest"
  >("ending-soon");
  const { user } = useAuth();

=======
    "ending-soon" | "price-high" | "price-low" | "newest" | "featured"
  >("newest");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch artworks from backend
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/item");
        const data = response.data.data;
  
        // Map backend data to Artwork interface and filter by status
        const mappedArtworks = data
          .filter(
            (item: any) =>
              item.status === "APPROVED" && 
              (item.auctionStatus === "ACTIVE" || item.auctionStatus === "NOT_STARTED")
          )
          .map((item: any) => ({
            id: item.id,
            artist: `${item.seller.firstName} ${item.seller.lastName}`,
            title: item.name,
            description: item.description,
            startingPrice: item.startingPrice,
            currentBid: item.currentBid || item.startingPrice,
            image: item.imageBase64 || "/placeholder.svg",
            type: item.category.name as ArtworkType,
            auctionEnds: new Date(item.endTime),
            startingBid: item.startingPrice,
            bids: [], // Initialize with an empty array or map actual bids if available
            chat: [], // Initialize with an empty array or map actual chat if available
            featured: item.featured || false,
            createdAt: new Date(item.createdAt),
            auctionStatus: item.auctionStatus,
            itemStatus: item.status
          }));
  
        setArtworks(mappedArtworks);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchArtworks();
  }, []);

>>>>>>> Stashed changes
  // Initialize search term from URL
  useEffect(() => {
    const urlSearchTerm = searchParams.get("search");
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [searchParams]);

  const artworkTypes: { value: ArtworkType | "all"; label: string }[] = [
    { value: "all", label: "All Types" },
    { value: "painting", label: "Paintings" },
    { value: "sculpture", label: "Sculptures" },
    { value: "handicraft", label: "Handicrafts" },
    { value: "photography", label: "Photography" },
    { value: "digital", label: "Digital Art" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "ending-soon", label: "Ending Soon" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "featured", label: "Featured" },
  ];

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || artwork.type === selectedType;
    const isActiveOrUpcoming = artwork.auctionStatus === 'ACTIVE' || artwork.auctionStatus === 'NOT_STARTED';

    return matchesSearch && matchesType && isActiveOrUpcoming;
  });

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case "ending-soon":
        return a.auctionEnds.getTime() - b.auctionEnds.getTime();
      case "price-high":
        return b.currentBid - a.currentBid;
      case "price-low":
        return a.currentBid - b.currentBid;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "featured":
        // Featured items first, then sort by newest
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL
    setSearchParams({ search: searchTerm });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSortBy("newest");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-medium mb-4">
            Browse Auctions
          </h1>
          <p className="text-gallery-text/70">
            Discover and bid on exceptional artworks from talented artists
            around the world
          </p>
          {user && (user.role === "SELLER" || user.role === "ADMIN") && (
            <div className="mt-6">
              <CreateAuctionDialog className="inline-flex items-center gap-2" />
            </div>
          )}
        </div>

        {/* Search filters */}
        <div className="mb-8 bg-white rounded-lg shadow-subtle p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="relative md:col-span-5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gallery-text/40" />
                </div>
                <Input
                  type="search"
                  placeholder="Search artworks, artists, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 focus:ring-gallery-accent"
                />
              </div>

              {/* Type Filter */}
              <div className="relative md:col-span-3">
                <select
                  value={selectedType}
                  onChange={(e) =>
                    setSelectedType(e.target.value as ArtworkType | "all")
                  }
                  className="w-full px-4 py-2 h-10 border border-input bg-background rounded-md focus:outline-none focus:ring-1 focus:ring-gallery-accent appearance-none"
                >
                  {artworkTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter size={18} className="text-gallery-text/40" />
                </div>
              </div>

              {/* Sort Options */}
              <div className="relative md:col-span-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2 h-10 border border-input bg-background rounded-md focus:outline-none focus:ring-1 focus:ring-gallery-accent appearance-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter size={18} className="text-gallery-text/40" />
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="md:col-span-1 flex items-center">
                <Button
                  type="submit"
                  className="w-full h-10 bg-gallery-accent text-white hover:bg-gallery-accent/90"
                >
                  Go
                </Button>
              </div>
            </div>

            {/* Active filters */}
            {(searchTerm || selectedType !== "all" || sortBy !== "newest") && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-gallery-text/60">
                  Active filters:
                </span>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-gallery-beige/50 text-gallery-text"
                    >
                      Search: {searchTerm}
                    </Badge>
                  )}
                  {selectedType !== "all" && (
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-gallery-beige/50 text-gallery-text"
                    >
                      Type: {selectedType}
                    </Badge>
                  )}
                  {sortBy !== "newest" && (
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-gallery-beige/50 text-gallery-text"
                    >
                      Sort: {sortOptions.find(o => o.value === sortBy)?.label}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs text-gallery-accent hover:text-gallery-accent/80 hover:bg-transparent underline h-auto p-0"
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-gallery-text/60">
          Found {sortedArtworks.length}{" "}
          {sortedArtworks.length === 1 ? "artwork" : "artworks"}
        </div>

        {/* Results */}
        {sortedArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedArtworks.map((artwork) => (
              <ArtworkCard 
                key={artwork.id} 
                artwork={artwork} 
                status={artwork.auctionStatus === 'NOT_STARTED' ? 'Upcoming' : 'Active'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gallery-beige/10 rounded-lg">
            <p className="text-xl text-gallery-text/70 mb-2">
              No artworks found
            </p>
            <p className="text-gallery-text/60">
              Try adjusting your search filters or browse all artworks
            </p>
            <Button
              onClick={clearFilters}
              className="mt-4 bg-gallery-accent hover:bg-gallery-accent/90 text-white"
            >
              View all artworks
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionsPage;