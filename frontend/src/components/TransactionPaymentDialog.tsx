import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TransactionPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    title: string;
    customer: string;
    amount: number;
    date: string;
    status: 'UNPAID' | 'COMPLETED' | 'FAILED';
  };
}

const TransactionPaymentDialog = ({ isOpen, onClose, transaction }: TransactionPaymentDialogProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNPAID':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Payment Details</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium">{transaction.title}</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer</span>
                <span className="font-medium">{transaction.customer}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">${transaction.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{transaction.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
          </div>

          {transaction.status === 'UNPAID' && (
            <div className="pt-4 space-y-2">
              <Button 
                className="w-full bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white"
                onClick={() => {
                  // Handle payment processing here
                  console.log('Processing payment for transaction:', transaction.id);
                }}
              >
                Process Payment
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-[#AA8F66] text-[#AA8F66] hover:bg-[#AA8F66]/10"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          )}

          {transaction.status !== 'UNPAID' && (
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full border-[#AA8F66] text-[#AA8F66] hover:bg-[#AA8F66]/10"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionPaymentDialog; 