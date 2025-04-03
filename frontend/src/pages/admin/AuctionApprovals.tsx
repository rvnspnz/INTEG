import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MainLayout from "@/components/Layout/MainLayout";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
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
  Image as ImageIcon,
  Gavel,
} from "lucide-react";
import axios from "axios";
import { StatusBadge } from "@/components/ui/custom-badge";

const API_BASE_URL = "http://localhost:8080/api/item";

const Items = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    startingPrice: "",
    bidIncrement: "",
    sellerId: "",
    categoryId: "",
    image: null,
    startTime: "",
    endTime: "",
  });

  // Fetch items with auction details
  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}?includeAuctionDetails=true`
      );
      const items =
        response.data?.data.map((item) => ({
          ...item,
          startTime: item.start_time || item.startTime, // Check both possible field names
          endTime: item.end_time || item.endTime,     // Check both possible field names
          auctionStatus: item.auction_status || item.auctionStatus || "NOT_STARTED",
          createdAt: item.created_at || item.createdAt,
        })) || [];
      setItemsData(items);
      return items;
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch items");
      return [];
    }
  };

  useEffect(() => {
    fetchItems().then(items => {
      console.log("Fetched items:", items);
      if (items.length > 0) {
        console.log("First item's time fields:", {
          startTime: items[0].startTime,
          endTime: items[0].endTime,
          start_time: items[0].start_time,
          end_time: items[0].end_time
        });
      }
    });
  }, []);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedItem) {
      toast.error("No item selected");
      return;
    }
  
    try {
      // Change this API call to match the backend endpoint
      await axios.put(`${API_BASE_URL}/${selectedItem.id}/status`, {
        adminid: 1, // Replace with the actual admin ID
        status: newStatus,
      }, {
        params: {  // Send as query parameters instead of request body
          adminId: 1,
          status: newStatus
        }
      });
      toast.success("Item status updated successfully");
      fetchItems(); // Refresh the items list
      setIsViewDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error updating item status:", error);
      toast.error("Failed to update item status");
    }
  };

  const handleApprove = async () => await handleStatusUpdate("APPROVED");
  const handleReject = async () => await handleStatusUpdate("REJECTED");

  const handleAuctionStatusUpdate = async (newAuctionStatus) => {
    if (!selectedItem) return;

    try {
      const payload = {
        status: newAuctionStatus,
        ...(newAuctionStatus === "ACTIVE" && {
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        }),
        ...(newAuctionStatus === "ENDED" && {
          endTime: new Date().toISOString(),
        }),
      };

      await axios.put(
        `${API_BASE_URL}/${selectedItem.id}/auction-status`,
        payload
      );
      toast.success(`Auction ${newAuctionStatus.toLowerCase()} successfully`);
      fetchItems();
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error("Error updating auction status:", error);
      toast.error(`Failed to ${newAuctionStatus.toLowerCase()} auction`);
    }
  };

  

  const handleAddItem = () => setIsAddDialogOpen(true);

  const handleAddItemSubmit = async () => {
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("description", newItem.description);
    formData.append("startingPrice", newItem.startingPrice);
    formData.append("bidIncrement", newItem.bidIncrement);
    formData.append("sellerId", newItem.sellerId);
    formData.append("categoryId", newItem.categoryId);
    if (newItem.image) formData.append("image", newItem.image);
    if (newItem.startTime) {
      const startDate = new Date(newItem.startTime);
      formData.append("startTime", startDate.toISOString().slice(0, 19).replace('T', ' '));
    }
    if (newItem.endTime) {
      const endDate = new Date(newItem.endTime);
      formData.append("endTime", endDate.toISOString().slice(0, 19).replace('T', ' '));
    }

    try {
      await axios.post(API_BASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Item added successfully");
      fetchItems();
      setIsAddDialogOpen(false);
      setNewItem({
        name: "",
        description: "",
        startingPrice: "",
        bidIncrement: "",
        sellerId: "",
        categoryId: "",
        image: null,
        startTime: "",
        endTime: "",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "null" || dateString === "NULL") return "Not set";
    
    try {
      // Handle different possible date formats
      let date;
      if (dateString.includes('T')) {
        date = new Date(dateString);
      } else if (dateString.includes(' ')) {
        // MySQL format: "YYYY-MM-DD HH:MM:SS"
        date = new Date(dateString.replace(' ', 'T') + 'Z');
      } else {
        // Fallback for other formats
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid date";
    }
  };

  const getStatusVariant = (status, auctionStatus) => {
    if (auctionStatus === "ACTIVE") return "active";
    if (auctionStatus === "ENDED") return "inactive"; // Return "inactive" instead of "ended"

    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "rejected";
      case "PENDING":
        return "pending";
      case "SOLD":
        return "info";
      case "EXPIRED":
        return "inactive";
      default:
        return "default";
    }
  };

  const columns = [
    {
      id: "name",
      header: "Item",
      cell: (row) => (
        <div className="flex items-center">
          {row.imageBase64 ? (
            <div
              className="h-12 w-12 rounded-lg bg-cover bg-center mr-3 border border-[#AA8F66]/20 shadow-sm overflow-hidden"
              style={{ backgroundImage: `url(${row.imageBase64})` }}
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-[#AA8F66]/10 flex items-center justify-center mr-3 border border-[#AA8F66]/20">
              <span className="text-[#AA8F66] font-medium">
                {row.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium truncate max-w-[200px] text-[#5A3A31]">
              {row.name}
            </div>
            <div className="text-sm text-[#5A3A31]/70 flex items-center">
              <Tag size={12} className="mr-1 text-[#AA8F66]" />
              {row.category?.name}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "startingPrice",
      header: "Starting Price",
      cell: (row) => (
        <div className="font-medium text-[#5A3A31] flex items-center">
          <DollarSign size={14} className="mr-1 text-[#AA8F66]" />
          {row.startingPrice.toLocaleString()}
        </div>
      ),
      sortable: true,
    },
    {
      id: "auctionTiming",
  header: "Auction Timing",
  cell: (row) => (
    <div className="text-sm text-[#5A3A31]">
      {row.startTime ? formatDate(row.startTime) : "Not scheduled"}
      {row.endTime && (
        <>
          <br />
          <span className="text-xs text-[#5A3A31]/70">
            to {formatDate(row.endTime)}
          </span>
        </>
      )}
    </div>
  ),
  sortable: true,
},
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        let icon;
        let statusText;

        if (row.auctionStatus && row.auctionStatus !== "NOT_STARTED") {
          statusText = row.auctionStatus;
          switch (row.auctionStatus) {
            case "ACTIVE":
              icon = <Gavel className="h-4 w-4 mr-1 text-active" />;
              statusText = "Auction Active";
              break;
            case "ENDED":
              icon = <Clock className="h-4 w-4 mr-1 text-ended" />;
              statusText = "Auction Ended";
              break;
          }
        } else {
          statusText = row.status;
          switch (row.status) {
            case "APPROVED":
              icon = <BadgeCheck className="h-4 w-4 mr-1 text-success" />;
              break;
            case "REJECTED":
              icon = <X className="h-4 w-4 mr-1 text-destructive" />;
              break;
            case "PENDING":
              icon = <Clock className="h-4 w-4 mr-1 text-warning" />;
              break;
            case "SOLD":
              icon = <AlertTriangle className="h-4 w-4 mr-1 text-primary" />;
              break;
            default:
              icon = null;
          }
        }

        return (
          <div className="flex items-center">
            <StatusBadge
              variant={getStatusVariant(row.status, row.auctionStatus)}
              className="gap-1"
            >
              {icon}
              {statusText
                .split("_")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </StatusBadge>
          </div>
        );
      },
      sortable: true,
    },
  ];

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auction Items</h1>
          <p className="text-muted-foreground">
            Manage and approve auction items
          </p>
        </div>
      </div>

      <Card className="shadow-soft">
        <DataTable
          columns={columns}
          fetchData={fetchItems}
          onView={handleViewDetails}
        />
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Auction Item</DialogTitle>
            <DialogDescription>
              Enter details for the new auction item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                placeholder="Item name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                placeholder="Item description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Starting Price</Label>
                <Input
                  type="number"
                  value={newItem.startingPrice}
                  onChange={(e) =>
                    setNewItem({ ...newItem, startingPrice: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Bid Increment</Label>
                <Input
                  type="number"
                  value={newItem.bidIncrement}
                  onChange={(e) =>
                    setNewItem({ ...newItem, bidIncrement: e.target.value })
                  }
                  placeholder="1.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Seller ID</Label>
                <Input
                  value={newItem.sellerId}
                  onChange={(e) =>
                    setNewItem({ ...newItem, sellerId: e.target.value })
                  }
                  placeholder="Seller ID"
                />
              </div>
              <div>
                <Label>Category ID</Label>
                <Input
                  value={newItem.categoryId}
                  onChange={(e) =>
                    setNewItem({ ...newItem, categoryId: e.target.value })
                  }
                  placeholder="Category ID"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Auction Start Time</Label>
                <Input
                type="datetime-local"
                value={newItem.startTime ? new Date(newItem.startTime).toISOString().slice(0, 16) : ""}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setNewItem({ ...newItem, startTime: date.toISOString() });
                  }}
                  />
              </div>
              <div>
                <Label>Auction End Time</Label>
                <Input
                  type="datetime-local"
                  value={newItem.endTime}
                  onChange={(e) =>
                    setNewItem({ ...newItem, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewItem({ ...newItem, image: e.target.files[0] })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItemSubmit}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
            <DialogDescription>
              Review and manage the auction item
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              {/* Item Image */}
              <div className="w-full h-48 rounded-lg overflow-hidden shadow-sm border border-[#AA8F66]/20">
                <img
                  src={selectedItem.imageBase64}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Header with name and status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#5A3A31]">
                    {selectedItem.name}
                  </h3>
                  <p className="text-sm text-[#5A3A31]/70">
                    ID: {selectedItem.id}
                  </p>
                </div>
                <StatusBadge
                  variant={getStatusVariant(
                    selectedItem.status,
                    selectedItem.auctionStatus
                  )}
                  className="capitalize"
                >
                  {selectedItem.auctionStatus !== "NOT_STARTED"
                    ? selectedItem.auctionStatus
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")
                    : selectedItem.status.charAt(0).toUpperCase() +
                      selectedItem.status.slice(1).toLowerCase()}
                </StatusBadge>
              </div>

              <Separator className="bg-[#AA8F66]/10" />

              {/* Information sections */}
              <div className="grid grid-cols-1 gap-3">
                {/* Item Information */}
                <div className="bg-[#f5f0ea] p-4 rounded-lg">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-[#AA8F66]" />
                    <div className="w-full">
                      <Label className="text-sm text-[#5A3A31]/70 font-medium">
                        Item Information
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-[#5A3A31]/70">Category</p>
                          <p className="font-medium text-[#5A3A31]">
                            {selectedItem.category?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5A3A31]/70">Seller</p>
                          <p className="font-medium text-[#5A3A31]">
                            {selectedItem.seller?.username}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-[#5A3A31]/70">
                          Starting Price
                        </p>
                        <p className="font-medium text-[#5A3A31]">
                          ${selectedItem.startingPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-[#5A3A31]/70">
                          Bid Increment
                        </p>
                        <p className="font-medium text-[#5A3A31]">
                          ${selectedItem.bidIncrement.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-[#f5f0ea] p-4 rounded-lg">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-[#AA8F66]" />
                    <div>
                      <Label className="text-sm text-[#5A3A31]/70 font-medium">
                        Description
                      </Label>
                      <p className="mt-1 text-sm text-[#5A3A31]">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Auction Timing */}
                <div className="bg-[#f5f0ea] p-4 rounded-lg">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-[#AA8F66]" />
                    <div className="w-full">
                      <Label className="text-sm text-[#5A3A31]/70 font-medium">
                      Auction Timing
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-[#5A3A31]/70">Start Time</p>
                          <p className="font-medium text-[#5A3A31]">
                            {selectedItem.startTime ? formatDate(selectedItem.startTime) : "Not set"}
                            </p>
                            </div>
                            <div>
                              <p className="text-xs text-[#5A3A31]/70">End Time</p>
                              <p className="font-medium text-[#5A3A31]">
                                {selectedItem.endTime ? formatDate(selectedItem.endTime) : "Not set"}
                                </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex space-x-2">
            {selectedItem?.status === "PENDING" && (
              <>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  className="gap-1 rounded-md"
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  className="gap-1 rounded-md bg-[#5A3A31] hover:bg-[#4a2a21] text-white"
                >
                  <BadgeCheck className="h-4 w-4" />
                  Approve
                </Button>
              </>
            )}

            {selectedItem?.status === "APPROVED" &&
              selectedItem?.auctionStatus === "NOT_STARTED" && (
                <Button
                  onClick={() => handleAuctionStatusUpdate("ACTIVE")}
                  className="gap-1 rounded-md bg-green-600 hover:bg-green-700 text-white"
                >
                  <Gavel className="h-4 w-4" />
                  Start Auction
                </Button>
              )}

            {selectedItem?.auctionStatus === "ACTIVE" && (
              <Button
                onClick={() => handleAuctionStatusUpdate("ENDED")}
                className="gap-1 rounded-md bg-red-600 hover:bg-red-700 text-white"
              >
                <Clock className="h-4 w-4" />
                End Auction
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Items;