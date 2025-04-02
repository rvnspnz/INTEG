export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  avatarUrl?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  sellerName: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  category: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface SellerApplication {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  category: string;
  background: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  avatarUrl?: string;
}

export interface AuctionItem extends Item {
  startingBid: number;
  currentBid?: number;
  auctionStart?: Date;
  auctionEnd?: Date;
}

export interface ChartData {
  [key: string]: number | string;
}
