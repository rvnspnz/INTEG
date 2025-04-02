import React from 'react';
import { formatCurrency } from '../data/artworks';

interface LeaderboardEntry {
  name: string;
  bid: number;
}

interface LeaderboardsProps {
  entries: LeaderboardEntry[];
}

const Leaderboards: React.FC<LeaderboardsProps> = ({ entries }) => {
  // Find the highest bidder
  const highestBidder = entries.length > 0 
    ? entries.reduce((prev, current) => (prev.bid > current.bid) ? prev : current) 
    : null;

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-md p-5 mb-6">
      <h3 className="font-display text-xl font-medium mb-4 text-[#5D4037]">Top Bidder</h3>
      
      {highestBidder ? (
        <div className="flex justify-between items-center py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EFEBE9] border border-[#D7CCC8] flex items-center justify-center text-sm font-medium text-[#5D4037]">
              {highestBidder.name.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-[#3E2723]">{highestBidder.name}</span>
          </div>
          <span className="font-semibold text-[#5D4037]">{formatCurrency(highestBidder.bid)}</span>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic text-center py-3">
          No bids have been placed yet.
        </p>
      )}
    </div>
  );
};

export default Leaderboards;