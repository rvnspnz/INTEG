import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import SellerLayout from '@/components/Layout/SellerLayout'; // Default import
import { useAuth } from '@/lib/auth-context'; // Use useAuth to get the context
import TransactionPaymentDialog from './TransactionPaymentDialog';


const SellerTransaction = () => {
 const { transactionId } = useParams();
 const location = useLocation();
 const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
 const [selectedStatus, setSelectedStatus] = useState<string>('UNPAID');
 const [transactions, setTransactions] = useState<any[]>([]); // Store transactions fetched from the API
 const [loading, setLoading] = useState<boolean>(false);


 // Access the logged-in user's data from the auth-context
 const { user } = useAuth(); // Get the user context (user ID, role, etc.)


 // Ensure there's a logged-in user
 if (!user) {
   return <p>Loading or not logged in</p>;
 }


 const sellerId = user.id; // Use the logged-in user's ID


 const queryParams = new URLSearchParams(location.search);
 const itemName = queryParams.get('item') || 'Unknown Item';
 const customerName = queryParams.get('customer') || 'Unknown Customer';
 const amount = queryParams.get('amount') || '0';
 const status = queryParams.get('status') || 'UNPAID';
 const transactionTime = queryParams.get('transactionTime');


 const formatDate = (dateString: string) => {
   const date = new Date(dateString);
   return date.toLocaleString('en-US', {
     weekday: 'long',
     year: 'numeric',
     month: 'long',
     day: 'numeric',
     hour: '2-digit',
     minute: '2-digit',
     hour12: true,
   });
 };


 useEffect(() => {
   if (!sellerId) {
     console.error('Seller ID is missing from auth context.');
     return;
   }


   const fetchTransactions = async () => {
     setLoading(true);
     try {
       const response = await fetch(`http://localhost:8080/payments/seller/${sellerId}`);
       if (!response.ok) {
         throw new Error('Failed to fetch transactions');
       }
       const data = await response.json();
       setTransactions(data);
     } catch (error) {
       console.error('Error fetching transactions:', error);
     } finally {
       setLoading(false);
     }
   };


   fetchTransactions();
 }, [sellerId]);


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


 // Filter transactions by status
 const unpaidTransactions = transactions.filter(tx => tx.paymentStatus === 'UNPAID');
 const completedTransactions = transactions.filter(tx => tx.paymentStatus === 'COMPLETED');
 const failedTransactions = transactions.filter(tx => tx.paymentStatus === 'FAILED');


 // Render a transaction card
 const renderTransactionCard = (transaction: any) => (
   <div
     key={transaction.id}
     className="bg-white rounded-lg shadow p-6 mb-4"
   >
     <div className="flex flex-col">
       <div className="flex-1">
         {/* Access the item name correctly from the bid object */}
         <h3 className="text-lg font-medium">{transaction.bid?.item?.name || 'Unknown Item'}</h3>
         <p className="text-gray-600">Customer: {transaction.bid?.customer?.username || 'Unknown Customer'}</p>
         <p className="text-sm text-gray-500">{formatDate(transaction.transactionTime)}</p>
       </div>
       <div className="mt-3 flex flex-col items-start gap-2">
         <p className="font-medium">Amount: ${transaction.amount}</p>
         <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(transaction.paymentStatus)}`}>
           {transaction.paymentStatus}
         </span>
         <Button
           onClick={() => setSelectedTransaction(transaction)}
           variant="outline"
           size="sm"
           className="mt-2 border-[#AA8F66] text-[#AA8F66] hover:bg-[#AA8F66]/10"
         >
           View Details
         </Button>
       </div>
     </div>
   </div>
 );
  if (loading) {
   return (
     <SellerLayout>
       <div className="p-6">
         <h1 className="text-2xl font-semibold mb-6">Loading Transactions...</h1>
       </div>
     </SellerLayout>
   );
 }


 return (
   <SellerLayout>
     <div className="p-6">
       <h1 className="text-2xl font-semibold mb-6">Transaction Payment</h1>


       <div className="rounded-lg overflow-hidden border border-gray-200 mb-6">
         <div className="flex">
           <button
             onClick={() => setSelectedStatus('UNPAID')}
             className={`flex-1 py-4 text-center font-medium flex justify-center items-center ${
               selectedStatus === 'UNPAID'
                 ? 'bg-[#AA8F66] text-white'
                 : 'bg-white text-gray-700 hover:bg-gray-50'
             }`}
           >
             <Clock className="mr-2 h-5 w-5" /> UNPAID
           </button>
           <button
             onClick={() => setSelectedStatus('COMPLETED')}
             className={`flex-1 py-4 text-center font-medium flex justify-center items-center ${
               selectedStatus === 'COMPLETED'
                 ? 'bg-[#AA8F66] text-white'
                 : 'bg-white text-gray-700 hover:bg-gray-50'
             }`}
           >
             <CheckCircle className="mr-2 h-5 w-5" /> COMPLETED
           </button>
           <button
             onClick={() => setSelectedStatus('FAILED')}
             className={`flex-1 py-4 text-center font-medium flex justify-center items-center ${
               selectedStatus === 'FAILED'
                 ? 'bg-[#AA8F66] text-white'
                 : 'bg-white text-gray-700 hover:bg-gray-50'
             }`}
           >
             <AlertCircle className="mr-2 h-5 w-5" /> FAILED
           </button>
         </div>
       </div>


       <div className="space-y-4">
         {selectedStatus === 'UNPAID' && (
           <>
             {unpaidTransactions.length > 0 ? (
               unpaidTransactions.map(renderTransactionCard)
             ) : (
               <p className="text-gray-500 text-center py-8 bg-white rounded-lg shadow">No unpaid transactions</p>
             )}
           </>
         )}


         {selectedStatus === 'COMPLETED' && (
           <>
             {completedTransactions.length > 0 ? (
               completedTransactions.map(renderTransactionCard)
             ) : (
               <p className="text-gray-500 text-center py-8 bg-white rounded-lg shadow">No completed transactions</p>
             )}
           </>
         )}


         {selectedStatus === 'FAILED' && (
           <>
             {failedTransactions.length > 0 ? (
               failedTransactions.map(renderTransactionCard)
             ) : (
               <p className="text-gray-500 text-center py-8 bg-white rounded-lg shadow">No failed transactions</p>
             )}
           </>
         )}
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
