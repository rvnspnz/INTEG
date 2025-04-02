import { useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock, Image, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";

interface Bid {
  id: string;
  auctionId: string;
  itemTitle: string;
  itemImage: string;
  bidAmount: number;
  bidDate: string;
  sellerName: string;
  paymentStatus: 'unpaid' | 'complete' | 'failed';
  dueDate?: string;
  paymentDetails?: {
    transactionId: string;
    paymentMethod: string;
    paymentDate: string;
    failureReason?: string;
  };
}

// Mock QR code URL - In production, this would come from your backend
const QR_CODE_URL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=sample_payment_data";

const mockBids: Bid[] = [
  {
    id: '1',
    auctionId: 'a1',
    itemTitle: 'Vintage Oil Painting',
    itemImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=200',
    bidAmount: 1500,
    sellerName: "John Doe",
    bidDate: '2024-02-15T14:30:00',
    paymentStatus: 'unpaid',
    dueDate: '2024-03-01'
  },
  {
    id: '2',
    auctionId: 'a2',
    itemTitle: 'Modern Sculpture',
    itemImage: 'https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=200',
    bidAmount: 2200,
    sellerName: "Alice Smith",
    bidDate: '2024-02-14T09:15:00',
    paymentStatus: 'complete',
    paymentDetails: {
      transactionId: 'TRX-001',
      paymentMethod: 'QR Payment',
      paymentDate: '2024-02-14T10:30:00'
    }
  },
  {
    id: '3',
    auctionId: 'a3',
    itemTitle: 'Abstract Art Collection',
    itemImage: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=200',
    bidAmount: 3500,
    sellerName: "Bob Johnson",
    bidDate: '2024-02-10T16:45:00',
    paymentStatus: 'failed',
    paymentDetails: {
      transactionId: 'TRX-002',
      paymentMethod: 'QR Payment',
      paymentDate: '2024-02-10T17:30:00',
      failureReason: 'Insufficient funds'
    }
  }
];

const BidCard = ({ bid }: { bid: Bid }) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const { user } = useAuth();

  const handlePayNow = () => {
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentComplete = () => {
    setIsPaymentDialogOpen(false);
    setIsSuccessDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'complete':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unpaid':
        return Clock;
      case 'complete':
        return CheckCircle;
      case 'failed':
        return XCircle;
      default:
        return Clock;
    }
  };

  const StatusIcon = getStatusIcon(bid.paymentStatus);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border-b last:border-b-0 hover:bg-[#FAF9F6]/50 transition-colors">
        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          {bid.itemImage ? (
            <img 
              src={bid.itemImage} 
              alt={bid.itemTitle}
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
              <h3 className="font-medium text-[#5A3A31]">{bid.itemTitle}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bid.paymentStatus)}`}>
                  <StatusIcon className="h-3 w-3" />
                  {bid.paymentStatus.charAt(0).toUpperCase() + bid.paymentStatus.slice(1)}
                </span>
                <span className="text-sm text-[#5A3A31]/60">
                  Bid placed on {new Date(bid.bidDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-[#AA8F66]">
                ${bid.bidAmount.toLocaleString()}
              </span>
              {bid.dueDate && (
                <p className="text-xs text-[#5A3A31]/60">
                  Payment due by {new Date(bid.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {bid.paymentDetails && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-xs text-[#5A3A31]/80 mb-1">
                <CreditCard className="h-3 w-3" />
                <span>Payment Details</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-[#5A3A31]/60 text-xs">Transaction ID</p>
                  <p className="font-medium text-[#5A3A31]">{bid.paymentDetails.transactionId}</p>
                </div>
                <div>
                  <p className="text-[#5A3A31]/60 text-xs">Payment Method</p>
                  <p className="font-medium text-[#5A3A31]">{bid.paymentDetails.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-[#5A3A31]/60 text-xs">Payment Date</p>
                  <p className="font-medium text-[#5A3A31]">
                    {new Date(bid.paymentDetails.paymentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {bid.paymentDetails.failureReason && (
                <div className="mt-2 p-2 bg-red-50 rounded-md">
                  <p className="text-xs text-red-700">
                    Failure Reason: {bid.paymentDetails.failureReason}
                  </p>
                </div>
              )}
            </div>
          )}

          {bid.paymentStatus === 'unpaid' && (
            <div className="mt-3 pt-3 border-t flex justify-end">
              <Button 
                className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white"
                onClick={handlePayNow}
              >
                <QrCode className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code to Pay</DialogTitle>
            <DialogDescription>
              Use your preferred payment app to scan the QR code and complete the payment.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 rounded-lg shadow-inner border">
              <img 
                src={QR_CODE_URL} 
                alt="Payment QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="font-medium text-[#5A3A31]">{bid.itemTitle}</p>
              <p className="text-2xl font-bold text-[#AA8F66] mt-2">
                ${bid.bidAmount.toLocaleString()}
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#AA8F66] hover:bg-[#AA8F66]/90"
              onClick={handlePaymentComplete}
            >
              I've Completed the Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Payment Successful
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-[#5A3A31]/60">Customer Name</p>
                <p className="font-medium text-[#5A3A31]">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-[#5A3A31]/60">Item Name</p>
                <p className="font-medium text-[#5A3A31]">{bid.itemTitle}</p>
              </div>
              <div>
                <p className="text-sm text-[#5A3A31]/60">Date of Payment</p>
                <p className="font-medium text-[#5A3A31]">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-[#5A3A31]/60">Amount Paid</p>
                <p className="font-medium text-[#AA8F66]">${bid.bidAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 w-full"
              onClick={() => setIsSuccessDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const MyBids = () => {
  const [activeTab, setActiveTab] = useState<'unpaid' | 'complete' | 'failed'>('failed');
  
  const tabs = {
    unpaid: {
      label: "Unpaid",
      icon: Clock,
      items: mockBids.filter(bid => bid.paymentStatus === 'unpaid')
    },
    complete: {
      label: "Complete",
      icon: CheckCircle,
      items: mockBids.filter(bid => bid.paymentStatus === 'complete')
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      items: mockBids.filter(bid => bid.paymentStatus === 'failed')
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-[#AA8F66]/10 shadow-sm overflow-hidden">
      <div className="border-b border-[#AA8F66]/10 bg-[#FDFBF8] p-4">
        <h2 className="text-lg font-medium text-[#5A3A31]">My Bids</h2>
        <p className="text-sm text-[#5A3A31]/60 mt-1">Track your auction bids and payments</p>
      </div>
      
      <div className="flex w-full border-b overflow-hidden">
        {Object.entries(tabs).map(([key, { label, icon: Icon }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'unpaid' | 'complete' | 'failed')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors
              ${activeTab === key 
                ? 'bg-[#AA8F66] text-white' 
                : 'bg-white text-[#5A3A31] hover:bg-[#AA8F66]/10'}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
      
      <div className="p-4">
        {tabs[activeTab].items.length === 0 ? (
          <div className="text-center py-12 text-[#5A3A31]/60">
            No bids found in this category
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tabs[activeTab].items.map((bid) => (
              <BidCard key={bid.id} bid={bid} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};