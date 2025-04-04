import React from 'react';
import { Bid } from '../data/artworks';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency } from '../data/artworks';


interface TopBiddersListProps {
  bids: Bid[];
  maxDisplay?: number;
}


const TopBiddersList: React.FC<TopBiddersListProps> = ({
  bids,
  maxDisplay = 5
}) => {
  // Sort bids by amount (highest first) and then by most recent
  const sortedBids = [...bids].sort((a, b) => {
    if (b.amount !== a.amount) {
      return b.amount - a.amount;
    }
    // If amounts are equal, sort by most recent
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });


  // Take only the top N bids (maxDisplay)
  const topBids = sortedBids.slice(0, maxDisplay);


  if (topBids.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-gray-500">
        No bids have been placed yet.
      </div>
    );
  }


  return (
    <div className="space-y-3">
      {topBids.map((bid, index) => (
        <div key={bid.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brown-100 rounded-full text-xs font-semibold text-brown-700">
              {index + 1}
            </div>
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-[#5D4037]/10 text-[#5D4037]">
                  {bid.userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{bid.userName}</span>
            </div>
          </div>
          <span className="font-semibold text-[#5D4037]">
            {formatCurrency(bid.amount)}
          </span>
        </div>
      ))}
    </div>
  );
};


export default TopBiddersList;
