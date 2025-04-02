import { useState } from 'react';
import SellerLayout from '@/components/Layout/SellerLayout';
import { Clock, CheckCircle, XCircle, DollarSign, CalendarX, Image, CreditCard } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'expired';
  paymentDetails?: {
    transactionId: string;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentDate?: string;
    amount: number;
    buyerName?: string;
  };
}

const mockItems: Item[] = [
  {
    id: '1',
    title: 'Abstract Art Piece',
    description: 'Modern abstract painting with vibrant colors',
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=200',
    createdAt: '2024-02-20',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Vintage Sculpture',
    description: 'Bronze sculpture from the 1950s',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=200',
    createdAt: '2024-02-15',
    status: 'approved'
  },
  {
    id: '3',
    title: 'Oil Painting',
    description: 'Classical landscape oil painting',
    price: 800,
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=200',
    createdAt: '2024-02-10',
    status: 'rejected'
  },
  {
    id: '4',
    title: 'Modern Photography',
    description: 'Limited edition urban photography print',
    price: 300,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200',
    createdAt: '2024-02-05',
    status: 'sold',
    paymentDetails: {
      transactionId: 'TRX-001',
      paymentMethod: 'Credit Card',
      paymentStatus: 'completed',
      paymentDate: '2024-02-06',
      amount: 300,
      buyerName: 'John Smith'
    }
  },
  {
    id: '5',
    title: 'Digital Art Print',
    description: 'Contemporary digital art, limited series',
    price: 250,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200',
    createdAt: '2024-01-15',
    status: 'expired'
  }
];

const ItemCard = ({ item }: { item: Item }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border rounded-lg hover:border-[#AA8F66]/50 transition-colors">
      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title}
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
            <h3 className="font-medium text-[#5A3A31]">{item.title}</h3>
            <p className="text-sm text-[#5A3A31]/60 line-clamp-1">{item.description}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-[#AA8F66]">
              ${item.price.toLocaleString()}
            </span>
            <p className="text-xs text-[#5A3A31]/60">
              Added on {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {item.paymentDetails && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-[#5A3A31]/80 mb-1">
              <CreditCard className="h-3 w-3" />
              <span>Transaction Details</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[#5A3A31]/60 text-xs">Transaction ID</p>
                <p className="font-medium text-[#5A3A31]">{item.paymentDetails.transactionId}</p>
              </div>
              <div>
                <p className="text-[#5A3A31]/60 text-xs">Payment Method</p>
                <p className="font-medium text-[#5A3A31]">{item.paymentDetails.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[#5A3A31]/60 text-xs">Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.paymentDetails.paymentStatus === 'completed' 
                    ? 'bg-green-50 text-green-700'
                    : item.paymentDetails.paymentStatus === 'pending'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {item.paymentDetails.paymentStatus}
                </span>
              </div>
              {item.paymentDetails.buyerName && (
                <div>
                  <p className="text-[#5A3A31]/60 text-xs">Buyer</p>
                  <p className="font-medium text-[#5A3A31]">{item.paymentDetails.buyerName}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ItemStatus = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const statusData = {
    pending: {
      title: "Pending Items",
      icon: Clock,
      items: mockItems.filter(item => item.status === 'pending')
    },
    approved: {
      title: "Approved Items",
      icon: CheckCircle,
      items: mockItems.filter(item => item.status === 'approved')
    },
    rejected: {
      title: "Rejected Items",
      icon: XCircle,
      items: mockItems.filter(item => item.status === 'rejected')
    },
    sold: {
      title: "Sold Items",
      icon: DollarSign,
      items: mockItems.filter(item => item.status === 'sold')
    },
    expired: {
      title: "Expired Items",
      icon: CalendarX,
      items: mockItems.filter(item => item.status === 'expired')
    }
  };

  return (
    <SellerLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-6">Item Status</h1>
        
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
                No items found in this status
              </div>
            ) : (
              <div className="grid gap-4">
                {statusData[activeTab as keyof typeof statusData].items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default ItemStatus; 