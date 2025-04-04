import React, { useState, useEffect } from 'react';
import { Artwork, formatCurrency } from '../data/artworks';
import { Clock, TrendingUp, Trophy } from 'lucide-react';
import { useAuth } from "@/lib/auth-context";


interface BiddingInterfaceProps {
  artwork: Artwork;
  onPlaceBid: (amount: number) => void;
}


const BiddingInterface: React.FC<BiddingInterfaceProps> = ({ artwork, onPlaceBid }) => {
  // Define timeRemaining function first so it can be used in state initialization
  const timeRemaining = () => {
    const now = new Date();
    const endTime = new Date(artwork.auctionEnds);
    const diff = endTime.getTime() - now.getTime();
   
    // If auction has ended
    if (diff <= 0) return { ended: true, display: "Auction ended", seconds: 0 };
   
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const totalSeconds = Math.floor(diff / 1000);
   
    return {
      ended: false,
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      display: `${days}d ${hours}h ${minutes}m ${seconds}s`
    };
  };


  const minBid = artwork.currentBid + Math.ceil(artwork.currentBid * 0.05); // Minimum 5% increase
  const [bidAmount, setBidAmount] = useState(minBid);
  const [isWinner, setIsWinner] = useState(false);
  const [isLoadingWinner, setIsLoadingWinner] = useState(false);
  const { user } = useAuth();
 
  // Add a state for the time remaining to update it in real-time
  const [remainingTime, setRemainingTime] = useState(timeRemaining());
 
  // Update the time remaining every second
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(timeRemaining());
    }, 1000);
   
    return () => clearInterval(timer);
  }, [artwork.auctionEnds]);
 
  // Use the updated remaining time state throughout the component
  const remaining = remainingTime;
 
  // Check if current user is the winner from the backend
  useEffect(() => {
    const checkIfWinner = async () => {
      if (!user || !remaining.ended) return false;
     
      setIsLoadingWinner(true);
      try {
        // Check if user is the highest bidder and auction ended
        const isUserHighestBidder = artwork.bids.length > 0 &&
          artwork.bids.sort((a, b) => b.amount - a.amount)[0].userId === user.id.toString();
       
        if (isUserHighestBidder && remaining.ended) {
          setIsWinner(true);
          return true;
        }
       
        setIsWinner(false);
        return false;
      } catch (error) {
        console.error("Error checking winner status:", error);
        setIsWinner(false);
        return false;
      } finally {
        setIsLoadingWinner(false);
      }
    };
   
    checkIfWinner();
  }, [user, remaining.ended, artwork.bids]);
 
  const incrementOptions = getBidIncrements();
 
  // Update the UI to always display meaningful values even if database returns zeros
  const displayStartingPrice = 500; // Static starting price without fetching from database
  const displayCurrentBid = artwork.currentBid > 0 ? artwork.currentBid : displayStartingPrice;
  const displayBidIncrement = minBid - artwork.currentBid > 0 ? minBid - artwork.currentBid : displayStartingPrice * 0.05;
 
  // Show login prompt if not logged in
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#5D4037]">Place Your Bid</h2>
        <p className="text-[#3E2723]/60 mb-6">
          Please sign in to place a bid on this item.
        </p>
       
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <span className="text-sm text-[#5D4037]/80">Starting Price</span>
          <span className="font-medium text-[#3E2723]">
            {typeof displayStartingPrice === 'number' ? formatCurrency(displayStartingPrice) : displayStartingPrice}
          </span>
        </div>
       
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <span className="text-sm text-[#5D4037]/80">Current Bid</span>
          <span className="font-semibold text-[#5D4037]">
            {typeof displayCurrentBid === 'number' ? formatCurrency(displayCurrentBid) : displayCurrentBid}
          </span>
        </div>
       
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <span className="text-sm text-[#5D4037]/80">Bid Increment</span>
          <span className="font-medium text-[#3E2723]">
            {typeof displayBidIncrement === 'number' ? formatCurrency(displayBidIncrement) : displayBidIncrement}
          </span>
        </div>
       
        <div className="flex justify-between items-center py-3 mb-4">
          <div className="flex items-center text-sm">
            <Clock size={14} className="mr-1 text-[#5D4037]/60" />
            <span className="text-[#5D4037]/80">Time Remaining:</span>
          </div>
          <span className="font-semibold text-[#3E2723]">
            {remaining.display}
          </span>
        </div>
       
        <button
          className="w-full py-3 px-4 bg-[#5D4037] text-white rounded-lg hover:bg-[#5D4037]/90 transition flex items-center justify-center gap-2 font-medium"
        >
          Sign In to Bid
        </button>
      </div>
    );
  }
 
  // Show congratulations if user won
  if (isWinner) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-6">
          <Trophy size={48} className="mx-auto mb-4 text-[#F9A825]" />
          <h2 className="text-2xl font-semibold mb-2 text-[#5D4037]">
            Congratulations!
          </h2>
          <p className="text-[#3E2723]/70 mb-6">
            You won this auction with a bid of {formatCurrency(artwork.currentBid)}
          </p>
         
          <button
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium"
          >
            You Won!
          </button>
        </div>
      </div>
    );
  }
 
  // If auction ended but user didn't win
  if (remaining.ended) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#5D4037]">Auction Ended</h2>
        <p className="text-[#3E2723]/60 mb-6">
          This auction has ended with a final bid of {formatCurrency(artwork.currentBid)}
        </p>
       
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <span className="text-sm text-[#5D4037]/80">Starting Price</span>
          <span className="font-medium text-[#3E2723]">
            {typeof displayStartingPrice === 'number' ? formatCurrency(displayStartingPrice) : displayStartingPrice}
          </span>
        </div>
       
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <span className="text-sm text-[#5D4037]/80">Final Bid</span>
          <span className="font-semibold text-[#5D4037]">
            {typeof displayCurrentBid === 'number' ? formatCurrency(displayCurrentBid) : displayCurrentBid}
          </span>
        </div>
       
        <div className="flex justify-between items-center py-3 mb-4">
          <div className="flex items-center text-sm">
            <Clock size={14} className="mr-1 text-[#5D4037]/60" />
            <span className="text-[#5D4037]/80">Auction Status:</span>
          </div>
          <span className="font-semibold text-[#3E2723]">
            Ended
          </span>
        </div>
      </div>
    );
  }
 
  // Normal bidding interface
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-[#5D4037]">Place Your Bid</h2>
     
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <span className="text-sm text-[#5D4037]/80">Starting Price</span>
        <span className="font-medium text-[#3E2723]">
          {typeof displayStartingPrice === 'number' ? formatCurrency(displayStartingPrice) : displayStartingPrice}
        </span>
      </div>
     
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <span className="text-sm text-[#5D4037]/80">Current Bid</span>
        <span className="font-semibold text-[#5D4037]">
          {typeof displayCurrentBid === 'number' ? formatCurrency(displayCurrentBid) : displayCurrentBid}
        </span>
      </div>
     
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <span className="text-sm text-[#5D4037]/80">Bid Increment</span>
        <span className="font-medium text-[#3E2723]">
          {typeof displayBidIncrement === 'number' ? formatCurrency(displayBidIncrement) : displayBidIncrement}
        </span>
      </div>
     
      <div className="flex justify-between items-center py-3 mb-4">
        <div className="flex items-center text-sm">
          <Clock size={14} className="mr-1 text-[#5D4037]/60" />
          <span className="text-[#5D4037]/80">Time Remaining:</span>
        </div>
        <span className="font-semibold text-[#3E2723]">
          {remaining.display}
        </span>
      </div>
     
      <div className="mb-4">
        <label className="block text-sm text-[#5D4037]/80 mb-2">
          Your Bid
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5D4037]/60">
            $
          </span>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Math.max(minBid, parseFloat(e.target.value) || 0))}
            min={minBid}
            step="0.01"
            className="w-full pl-6 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037]"
          />
        </div>
      </div>
     
      <div className="grid grid-cols-3 gap-2 mb-4">
        {incrementOptions.map((amount) => (
          <button
            key={amount}
            onClick={() => setBidAmount(amount)}
            className="py-1 px-2 border border-gray-200 rounded text-center text-sm hover:bg-[#EFEBE9] transition"
          >
            ${amount}
          </button>
        ))}
      </div>
     
      <button
        onClick={() => onPlaceBid(bidAmount)}
        className="w-full py-3 px-4 bg-[#5D4037] text-white rounded-lg hover:bg-[#5D4037]/90 transition flex items-center justify-center gap-2 font-medium"
      >
        <TrendingUp size={16} />
        Place Bid
      </button>
    </div>
  );
 
  // Calculate bid increment suggestions
  function getBidIncrements() {
    const current = artwork.currentBid;
    const increment = Math.ceil(current * 0.05); // 5% increment
   
    return [
      current + increment,
      current + increment * 2,
      current + increment * 3
    ];
  }
}


export default BiddingInterface;
