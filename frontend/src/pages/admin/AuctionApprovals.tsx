import { useState } from "react";
import {
  BadgeCheck,
  Clock,
  X,
  AlertTriangle,
  ArrowUpDown,
  DollarSign,
  Calendar,
  Tag,
  User,
  FileText,
  Image,
  Filter,
  Gavel,
  SlidersHorizontal,
  ListChecks,
  ShoppingCart
} from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AuctionItem } from "@/lib/types";
import { auctionItems } from "@/lib/data";
import MainLayout from "@/components/Layout/MainLayout";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/custom-badge";

const AuctionApprovals = () => {
  const [itemsData, setItemsData] = useState<AuctionItem[]>(auctionItems);
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Count items by status
  const statusCounts = itemsData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Helper function to map application status to StatusBadge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "rejected";
      case "pending":
        return "pending";
      case "sold":
        return "warning";
      default:
        return "default";
    }
  };

  const handleViewDetails = (item: AuctionItem) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleApprove = (item: AuctionItem) => {
    setItemsData(
      itemsData.map((i) =>
        i.id === item.id ? { ...i, status: "approved" } : i
      )
    );

    toast.success(`${item.name} has been approved for auction`);
    setIsViewDialogOpen(false);
  };

  const handleReject = (item: AuctionItem) => {
    setItemsData(
      itemsData.map((i) =>
        i.id === item.id ? { ...i, status: "rejected" } : i
      )
    );

    toast.success(`${item.name} has been rejected from auction`);
    setIsViewDialogOpen(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = [
    {
      id: "name",
      header: "Item",
      cell: (row: AuctionItem) => (
        <div className="flex items-center">
          {row.imageUrl ? (
            <div
              className="h-12 w-12 rounded-lg bg-cover bg-center mr-3 border border-[#AA8F66]/20 shadow-sm overflow-hidden"
              style={{ backgroundImage: `url(${row.imageUrl})` }}
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-[#AA8F66]/10 flex items-center justify-center mr-3 border border-[#AA8F66]/20">
              <span className="text-[#AA8F66] font-medium">
                {row.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium truncate max-w-[200px] text-[#5A3A31]">{row.name}</div>
            <div className="text-sm text-[#5A3A31]/70 flex items-center">
              <Tag size={12} className="mr-1 text-[#AA8F66]" />
              {row.category}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "price",
      header: "Starting Bid",
      cell: (row: AuctionItem) => (
        <div className="font-medium text-[#5A3A31] flex items-center">
          <DollarSign size={14} className="mr-1 text-[#AA8F66]" />
          {row.startingBid.toLocaleString()}
        </div>
      ),
      sortable: true,
    },
    {
      id: "sellerName",
      header: "Seller",
      cell: (row: AuctionItem) => (
        <div className="text-sm text-[#5A3A31] flex items-center">
          <User size={14} className="mr-1 text-[#AA8F66]" />
          {row.sellerName}
        </div>
      ),
      sortable: true,
    },
    {
      id: "createdAt",
      header: "Submitted",
      cell: (row: AuctionItem) => (
        <div className="text-sm text-[#5A3A31] flex items-center">
          <Calendar size={14} className="mr-1 text-[#AA8F66]" />
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      ),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row: AuctionItem) => {
        let icon;

        switch (row.status) {
          case "approved":
            icon = <BadgeCheck className="h-4 w-4 mr-1 text-success" />;
            break;
          case "rejected":
            icon = <X className="h-4 w-4 mr-1" />;
            break;
          case "pending":
            icon = <Clock className="h-4 w-4 mr-1 text-muted-foreground" />;
            break;
          case "sold":
            icon = <AlertTriangle className="h-4 w-4 mr-1 text-warning" />;
            break;
        }

        return (
          <div className="flex items-center">
            <StatusBadge
              variant={getStatusVariant(row.status)}
              className="gap-1"
            >
              {icon}
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </StatusBadge>
          </div>
        );
      },
      sortable: true,
    },
  ];

  return (
    <MainLayout>
      {/* Status Overview Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-[#5A3A31]/70 flex items-center">
                  <Clock size={12} className="mr-1 text-amber-500" />
                  Pending
                </span>
                <span className="text-2xl font-bold text-[#5A3A31]">
                  {statusCounts["pending"] || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                <Clock size={20} />
              </div>
            </div>
            <div className="mt-2 text-xs text-[#5A3A31]/70">Items awaiting review</div>
          </div>
        </Card>
        
        <Card className="border-none shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#AA8F66]"></div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-[#5A3A31]/70 flex items-center">
                  <BadgeCheck size={12} className="mr-1 text-[#AA8F66]" />
                  Approved
                </span>
                <span className="text-2xl font-bold text-[#5A3A31]">
                  {statusCounts["approved"] || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#AA8F66]/10 flex items-center justify-center text-[#AA8F66]">
                <BadgeCheck size={20} />
              </div>
            </div>
            <div className="mt-2 text-xs text-[#5A3A31]/70">Items approved for auction</div>
          </div>
        </Card>
        
        <Card className="border-none shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-[#5A3A31]/70 flex items-center">
                  <X size={12} className="mr-1 text-red-500" />
                  Rejected
                </span>
                <span className="text-2xl font-bold text-[#5A3A31]">
                  {statusCounts["rejected"] || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                <X size={20} />
              </div>
            </div>
            <div className="mt-2 text-xs text-[#5A3A31]/70">Items not meeting standards</div>
          </div>
        </Card>
      </div>
      
      {/* Filter Bar */}
      <div className="mb-4 flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-[#AA8F66]/10">
        <div className="flex items-center text-[#5A3A31] space-x-2">
          <Gavel size={18} className="text-[#AA8F66]" />
          <h2 className="font-medium">Auction Items</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-1 border-[#AA8F66]/20 text-[#5A3A31] hover:bg-[#AA8F66]/5">
            <Filter size={14} />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1 border-[#AA8F66]/20 text-[#5A3A31] hover:bg-[#AA8F66]/5">
            <SlidersHorizontal size={14} />
            Sort
          </Button>
          <Button variant="outline" size="sm" className="gap-1 border-[#AA8F66]/20 text-[#5A3A31] hover:bg-[#AA8F66]/5">
            <ListChecks size={14} />
            Columns
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <DataTable
          columns={columns}
          data={itemsData}
          onView={handleViewDetails}
          searchPlaceholder="Search items..."
        />
      </Card>

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[650px] p-0 border-none overflow-hidden rounded-xl">
          <div className="bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] p-5 text-white relative">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>
            </div>
            <DialogHeader className="relative z-10">
              <DialogTitle className="text-xl font-bold text-white flex items-center">
                <Gavel className="mr-2 h-5 w-5" />
                Auction Item Review
              </DialogTitle>
              <DialogDescription className="text-white/80">
                Review the item details for auction approval.
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedItem && (
            <div className="p-6 bg-white">
              <div className="space-y-4">
                {selectedItem.imageUrl && (
                  <div className="w-full h-56 rounded-lg overflow-hidden shadow-md border border-[#AA8F66]/20">
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#5A3A31]">{selectedItem.name}</h3>
                  <StatusBadge
                    variant={getStatusVariant(selectedItem.status)}
                    className="capitalize"
                  >
                    {selectedItem.status.charAt(0).toUpperCase() +
                      selectedItem.status.slice(1)}
                  </StatusBadge>
                </div>

                <Separator className="bg-[#AA8F66]/10" />

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start">
                    <Image className="h-5 w-5 mr-2 text-[#AA8F66] mt-0.5" />
                    <div>
                      <Label className="text-[#5A3A31]/70">
                        Item Details
                      </Label>
                      <p className="font-medium text-[#5A3A31]">{selectedItem.name}</p>
                      <p className="text-sm text-[#5A3A31]/70 mt-1">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-2 text-[#AA8F66] mt-0.5" />
                    <div>
                      <Label className="text-[#5A3A31]/70">Category</Label>
                      <p className="font-medium text-[#5A3A31]">{selectedItem.category}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 mr-2 text-[#AA8F66] mt-0.5" />
                      <div>
                        <Label className="text-[#5A3A31]/70">
                          Starting Bid
                        </Label>
                        <p className="font-medium text-[#5A3A31]">
                          ${selectedItem.startingBid.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <ArrowUpDown className="h-5 w-5 mr-2 text-[#AA8F66] mt-0.5" />
                      <div>
                        <Label className="text-[#5A3A31]/70">
                          Current Bid
                        </Label>
                        <p className="font-medium text-[#5A3A31]">
                          {selectedItem.currentBid
                            ? `$${selectedItem.currentBid.toLocaleString()}`
                            : "No bids yet"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 text-[#AA8F66] mt-0.5" />
                      <div>
                        <Label className="text-[#5A3A31]/70">
                          Auction Start
                        </Label>
                        <p className="font-medium text-[#5A3A31]">
                          {formatDate(selectedItem.auctionStart)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 text-[#AA8F66] mt-0.5" />
                      <div>
                        <Label className="text-[#5A3A31]/70">
                          Auction End
                        </Label>
                        <p className="font-medium text-[#5A3A31]">
                          {formatDate(selectedItem.auctionEnd)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#AA8F66]/10" />

                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-[#AA8F66] mt-0.5" />
                    <div>
                      <Label className="text-[#5A3A31]/70">Seller</Label>
                      <p className="font-medium text-[#5A3A31]">{selectedItem.sellerName}</p>
                      <p className="text-sm text-[#5A3A31]/70">
                        Seller ID: {selectedItem.sellerId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-[#AA8F66] mt-0.5" />
                    <div>
                      <Label className="text-[#5A3A31]/70">
                        Submission Details
                      </Label>
                      <p className="text-sm text-[#5A3A31]">
                        Submitted on{" "}
                        {new Date(selectedItem.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-[#5A3A31]/70 mt-1">
                        This item has been reviewed and verified for authenticity.
                        {selectedItem.status === "pending"
                          ? " Awaiting final approval for auction."
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6 flex items-center gap-3 justify-end">
                {selectedItem?.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedItem)}
                      className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedItem)}
                      className="gap-1 bg-gradient-to-r from-[#5A3A31] to-[#AA8F66] hover:opacity-90 text-white"
                    >
                      <BadgeCheck className="h-4 w-4" />
                      Approve
                    </Button>
                  </>
                )}
                {selectedItem?.status !== "pending" && (
                  <Button onClick={() => setIsViewDialogOpen(false)} className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white">Close</Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AuctionApprovals;
