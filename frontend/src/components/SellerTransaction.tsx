import React, { useState } from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import SellerNavbar from "../components/SellerNavbar";
import { FileText, CheckCircle, AlertCircle, Clock, ArrowLeft, Download, ClipboardList } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SellerLayout from '@/components/Layout/SellerLayout';
import TransactionPaymentDialog from './TransactionPaymentDialog';

const SellerTransaction = () => {
  const { transactionId } = useParams();
  const location = useLocation();
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const queryParams = new URLSearchParams(location.search);
  const itemName = queryParams.get("item") || "Unknown Item";
  const customerName = queryParams.get("customer") || "Unknown Customer";
  const amount = queryParams.get("amount") || "0";
  const status = queryParams.get("status") || "UNPAID";
  const transactionTime = queryParams.get("transactionTime");

  const formattedTransactionTime = transactionTime
    ? new Date(transactionTime).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  const amountLabel = status === "COMPLETED" ? "Amount Received" : "Total Amount Due";

  let transactionTimeMessage = "";
  let StatusIcon = Clock;
  let statusColor = "text-yellow-500";

  if (status === "COMPLETED") {
    transactionTimeMessage = `Payment completed on ${formattedTransactionTime}.`;
    StatusIcon = CheckCircle;
    statusColor = "text-green-600";
  } else if (status === "UNPAID") {
    transactionTimeMessage = `Payment not received. Order placed on ${formattedTransactionTime}.`;
    StatusIcon = Clock;
    statusColor = "text-yellow-500";
  } else if (status === "FAILED") {
    transactionTimeMessage = `Payment failed on ${formattedTransactionTime}.`;
    StatusIcon = AlertCircle;
    statusColor = "text-red-600";
  }

  // Example transactions data - replace with your actual data
  const transactions = [
    {
      id: '1',
      title: 'Painting A',
      customer: 'John Doe',
      amount: 200,
      date: 'Friday, March 28, 2025 at 01:00 PM',
      status: 'UNPAID'
    },
    {
      id: '2',
      title: 'Sculpture B',
      customer: 'Jane Smith',
      amount: 500,
      date: 'Friday, March 28, 2025 at 03:45 PM',
      status: 'COMPLETED'
    },
    {
      id: '3',
      title: 'Vintage Clock',
      customer: 'Alice Brown',
      amount: 350,
      date: 'Friday, March 28, 2025 at 02:15 PM',
      status: 'FAILED'
    }
  ];

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
    <SellerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Transaction Payment</h1>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{transaction.title}</h3>
                  <p className="text-gray-600">Customer: {transaction.customer}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-medium">Amount: ${transaction.amount}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                  <Button
                    onClick={() => setSelectedTransaction(transaction)}
                    variant="outline"
                    size="sm"
                    className="border-[#AA8F66] text-[#AA8F66] hover:bg-[#AA8F66]/10"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTransaction && (
          <TransactionPaymentDialog
            isOpen={!!selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            transaction={selectedTransaction}
          />
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerTransaction;