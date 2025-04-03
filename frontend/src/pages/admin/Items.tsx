import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
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
import { StatusBadge } from "@/components/ui/custom-badge";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import {
  BadgeCheck,
  FileText,
  X,
  Tag,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";

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
  });

  // Fetch items from the backend
  const fetchItems = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      const items = response.data?.data || [];
      setItemsData(items);
      return items;
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch items");
      return [];
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const getStatusVariant = (status) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <BadgeCheck className="h-4 w-4 mr-1" />;
      case "REJECTED":
        return <X className="h-4 w-4 mr-1" />;
      case "PENDING":
        return <Clock className="h-4 w-4 mr-1" />;
      case "SOLD":
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const formatStatusText = (status) => {
    return status === "APPROVED"
      ? "Approved"
      : status === "REJECTED"
      ? "Rejected"
      : status === "PENDING"
      ? "Pending"
      : status === "SOLD"
      ? "Sold"
      : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedItem) {
      toast.error("No item selected");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/${selectedItem.id}/status`,
        {
          adminid: 1,
          status: newStatus,
        },
        {
          params: {
            adminId: 1,
            status: newStatus,
          },
        }
      );
      toast.success("Item status updated successfully");
      fetchItems();
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error("Error updating item status:", error);
      toast.error("Failed to update item status");
    }
  };

  const handleAddItem = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddItemSubmit = async () => {
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("description", newItem.description);
    formData.append("startingPrice", newItem.startingPrice);
    formData.append("bidIncrement", newItem.bidIncrement);
    formData.append("sellerId", newItem.sellerId);
    formData.append("categoryId", newItem.categoryId);
    if (newItem.image) {
      formData.append("image", newItem.image);
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
      });
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
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
      id: "seller",
      header: "Seller",
      cell: (row) => (
        <div className="text-sm text-[#5A3A31]">{row.seller?.username}</div>
      ),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <div className="flex items-center">
          <StatusBadge
            variant={getStatusVariant(row.status)}
            className="text-xs py-0.5 px-2 h-5 flex items-center"
          >
            {getStatusIcon(row.status)}
            {formatStatusText(row.status)}
          </StatusBadge>
        </div>
      ),
      sortable: true,
    },
  ];

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#5A3A31]">
            Items
          </h1>
          <p className="text-[#5A3A31]/70">Manage auction items</p>
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
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              Enter the details of the new item.
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
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
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
              Review and manage the auction item.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="w-full h-48 rounded-lg overflow-hidden shadow-sm border border-[#AA8F66]/20">
                <img
                  src={selectedItem.imageBase64}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

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
                  variant={getStatusVariant(selectedItem.status)}
                  className="text-xs py-0.5 px-2 h-5 flex items-center"
                >
                  {getStatusIcon(selectedItem.status)}
                  {formatStatusText(selectedItem.status)}
                </StatusBadge>
              </div>

              <Separator className="bg-[#AA8F66]/10" />

              <div className="grid grid-cols-1 gap-3">
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
                    </div>
                  </div>
                </div>

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
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex space-x-2">
            {selectedItem?.status === "PENDING" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate("REJECTED")}
                  className="gap-1 rounded-md"
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleStatusUpdate("APPROVED")}
                  className="gap-1 rounded-md bg-[#5A3A31] hover:bg-[#4a2a21] text-white"
                >
                  <BadgeCheck className="h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {selectedItem?.status !== "PENDING" && (
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Items;
