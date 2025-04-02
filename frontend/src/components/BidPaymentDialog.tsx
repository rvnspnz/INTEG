import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../data/artworks';

interface BidPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bidAmount: number;
  artworkTitle: string;
}

const BidPaymentDialog: React.FC<BidPaymentDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  bidAmount,
  artworkTitle
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#5D4037]">Payment Processing</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-medium text-[#5D4037]">
              Pay {formatCurrency(bidAmount)} for "{artworkTitle}"
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Scan the QR code below to complete your payment
            </p>
          </div>
          
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="p-4 border-2 border-[#5D4037]/20 rounded-lg bg-white w-64 h-64 flex flex-col items-center justify-center">
              <div className="h-48 w-48 relative flex items-center justify-center border-4 border-gray-200 rounded-md overflow-hidden">
                {/* Placeholder for QR Code - in a real app, generate a real QR code */}
                <QrCode size={120} className="text-[#5D4037]" strokeWidth={1} />
                <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-xs text-[#5D4037] font-medium">SAMPLE QR CODE</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">QR Code expires in 10:00</p>
            </div>
          </div>
          
          <div className="bg-[#EFEBE9] p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <CheckCircle size={18} className="text-[#5D4037]" />
              </div>
              <div>
                <p className="text-sm text-[#3E2723]">
                  After scanning the QR code with your phone, follow the instructions to complete your payment. Your bid will be placed automatically once payment is confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            className="border-[#5D4037] text-[#5D4037] hover:bg-[#5D4037]/10"
            onClick={onClose}
          >
            Cancel
          </Button>
          {/* In a real app, this would be enabled after payment confirmation */}
          <Button 
            className="bg-[#5D4037] hover:bg-[#4E342E] text-white"
            onClick={onConfirm}
          >
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BidPaymentDialog; 