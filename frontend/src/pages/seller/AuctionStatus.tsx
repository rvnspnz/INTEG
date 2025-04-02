import { useState } from 'react';
import SellerLayout from '@/components/Layout/SellerLayout';
import { Calendar, PlayCircle, StopCircle, Image, Clock, CreditCard } from 'lucide-react';

interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'active' | 'ended';
  bidCount: number;
  paymentDetails?: {
    transactionId: string;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentDate?: string;
    amount: number;
    buyerName?: string;
    commission: number;
    netAmount: number;
  };
}

const mockAuctions: Auction[] = [
  {
    id: '1',
    title: 'Contemporary Art Collection',
    description: 'A curated collection of modern art pieces',
    startingPrice: 1000,
    currentBid: 0,
    imageUrl: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=200',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    status: 'not-started',
    bidCount: 0
  },
  {
    id: '2',
    title: 'Vintage Photography Set',
    description: 'Rare collection of vintage photographs',
    startingPrice: 800,
    currentBid: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=200',
    startDate: '2024-02-15',
    endDate: '2024-03-01',
    status: 'active',
    bidCount: 8
  },
  {
    id: '3',
    title: 'Abstract Sculpture',
    description: 'Modern bronze sculpture, limited edition',
    startingPrice: 2000,
    currentBid: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=200',
    startDate: '2024-01-20',
    endDate: '2024-02-10',
    status: 'ended',
    bidCount: 15,
    paymentDetails: {
      transactionId: 'TRX-002',
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'completed',
      paymentDate: '2024-02-12',
      amount: 3500,
      buyerName: 'Sarah Johnson',
      commission: 175, // 5% commission
      netAmount: 3325
    }
  }
];

const AuctionCard = ({ auction }: { auction: Auction }) => {
  const getStatusDisplay = () => {
    switch (auction.status) {
      case 'not-started':
        return {
          text: `Starts ${new Date(auction.startDate).toLocaleDateString()}`,
          color: 'text-blue-600'
        };
      case 'active':
        return {
          text: `${getRemainingTime(auction.endDate)} left`,
          color: 'text-green-600'
        };
      case 'ended':
        return {
          text: `Ended ${new Date(auction.endDate).toLocaleDateString()}`,
          color: 'text-[#5A3A31]/60'
        };
    }
  };

  const getRemainingTime = (endDate: string) => {
    const remaining = new Date(endDate).getTime() - new Date().getTime();
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  const status = getStatusDisplay();

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border rounded-lg hover:border-[#AA8F66]/50 transition-colors">
      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
        {auction.imageUrl ? (
          <img 
            src={auction.imageUrl} 
            alt={auction.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <Image className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium text-[#5A3A31]">{auction.title}</h3>
            <p className="text-sm text-[#5A3A31]/60 line-clamp-1">{auction.description}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-[#AA8F66]">
              {auction.status === 'not-started' 
                ? `Starting bid: $${auction.startingPrice.toLocaleString()}`
                : `Current bid: $${(auction.currentBid || auction.startingPrice).toLocaleString()}`
              }
            </span>
            <div className="flex items-center gap-1 justify-end mt-1">
              <Clock className="h-3 w-3" />
              <span className={`text-xs ${status.color}`}>
                {status.text}
              </span>
            </div>
          </div>
        </div>

        {auction.bidCount > 0 && (
          <div className="mt-2">
            <span className="text-xs text-[#5A3A31]/60">
              {auction.bidCount} bid{auction.bidCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {auction.paymentDetails && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-[#5A3A31]/80 mb-1">
              <CreditCard className="h-3 w-3" />
              <span>Transaction Details</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[#5A3A31]/60 text-xs">Transaction ID</p>
                <p className="font-medium text-[#5A3A31]">{auction.paymentDetails.transactionId}</p>
              </div>
              <div>
                <p className="text-[#5A3A31]/60 text-xs">Payment Method</p>
                <p className="font-medium text-[#5A3A31]">{auction.paymentDetails.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[#5A3A31]/60 text-xs">Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  auction.paymentDetails.paymentStatus === 'completed' 
                    ? 'bg-green-50 text-green-700'
                    : auction.paymentDetails.paymentStatus === 'pending'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {auction.paymentDetails.paymentStatus}
                </span>
              </div>
              {auction.paymentDetails.buyerName && (
                <div>
                  <p className="text-[#5A3A31]/60 text-xs">Buyer</p>
                  <p className="font-medium text-[#5A3A31]">{auction.paymentDetails.buyerName}</p>
                </div>
              )}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[#5A3A31]/60 text-xs">Total Amount</p>
                <p className="font-medium text-[#5A3A31]">${auction.paymentDetails.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[#5A3A31]/60 text-xs">Commission (5%)</p>
                <p className="font-medium text-red-600">-${auction.paymentDetails.commission.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[#5A3A31]/60 text-xs">Net Amount</p>
                <p className="font-medium text-green-600">${auction.paymentDetails.netAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AuctionStatus = () => {
  const [activeTab, setActiveTab] = useState("not-started");

  const statusData = {
    "not-started": {
      title: "Not Started Auctions",
      icon: Calendar,
      items: mockAuctions.filter(auction => auction.status === 'not-started')
    },
    active: {
      title: "Active Auctions",
      icon: PlayCircle,
      items: mockAuctions.filter(auction => auction.status === 'active')
    },
    ended: {
      title: "Ended Auctions",
      icon: StopCircle,
      items: mockAuctions.filter(auction => auction.status === 'ended')
    }
  };

  return (
    <SellerLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-6">Auction Status</h1>
        
        {/* Tabs Navigation */}
        <div className="flex w-full border rounded-lg overflow-hidden mb-6">
          {Object.entries(statusData).map(([key, { title, icon: Icon }]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors
                ${activeTab === key 
                  ? 'bg-[#AA8F66] text-white' 
                  : 'bg-white text-[#5A3A31] hover:bg-[#AA8F66]/10'}`}
            >
              <Icon className="h-4 w-4" />
              {title}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="bg-white rounded-lg border min-h-[200px]">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#5A3A31] mb-4">
              {statusData[activeTab as keyof typeof statusData].title}
            </h2>
            
            {statusData[activeTab as keyof typeof statusData].items.length === 0 ? (
              <div className="text-center py-12 text-[#5A3A31]/60">
                No auctions found in this status
              </div>
            ) : (
              <div className="grid gap-4">
                {statusData[activeTab as keyof typeof statusData].items.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default AuctionStatus; 