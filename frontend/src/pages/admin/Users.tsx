import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MainLayout from "@/components/Layout/MainLayout";
import { toast } from "sonner";
import axios from "axios";
import { Badge, FileText, User } from "lucide-react";
import { Label, Separator } from "@radix-ui/react-dropdown-menu";

const API_BASE_URL = "http://localhost:8080/api/user";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      const users = response.data?.data || [];
      setUsersData(users);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      return [];
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <div>
          <div className="font-medium">{`${row.firstName} ${row.lastName}`}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "role",
      header: "Role",
      cell: (row) => row.role,
      sortable: true,
    },
  ];

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">View user information</p>
        </div>
      </div>

      <Card className="shadow-soft">
        <DataTable
          columns={columns}
          fetchData={fetchUsers}
          onView={handleViewDetails} // Add this line
          searchPlaceholder="Search users..."
        />
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              {/* User Header */}
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-[#AA8F66]/10 flex items-center justify-center mr-3">
                  <span className="text-[#5A3A31] font-medium">
                    {selectedUser.firstName?.charAt(0)}
                    {selectedUser.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#5A3A31]">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-sm text-[#5A3A31]/70">
                    {selectedUser.email}
                  </p>
                </div>
                <Badge className="ml-auto capitalize border-[#AA8F66] text-[#5A3A31]">
                  {selectedUser.role}
                </Badge>
              </div>

              <Separator className="bg-[#AA8F66]/10" />

              {/* Information Sections */}
              <div className="grid grid-cols-1 gap-3">
                {/* Personal Information */}
                <div className="bg-[#f5f0ea] p-4 rounded-lg">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-[#AA8F66]" />
                    <div className="w-full">
                      <Label className="text-sm text-[#5A3A31]/70 font-medium">
                        Personal Information
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-[#5A3A31]/70">
                            First Name
                          </p>
                          <p className="font-medium text-[#5A3A31]">
                            {selectedUser.firstName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5A3A31]/70">Last Name</p>
                          <p className="font-medium text-[#5A3A31]">
                            {selectedUser.lastName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-[#f5f0ea] p-4 rounded-lg">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-[#AA8F66]" />
                    <div className="w-full">
                      <Label className="text-sm text-[#5A3A31]/70 font-medium">
                        Account Information
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-[#5A3A31]/70">Email</p>
                          <p className="font-medium text-[#5A3A31]">
                            {selectedUser.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5A3A31]/70">User ID</p>
                          <p className="font-medium text-[#5A3A31]">
                            {selectedUser.id}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-[#5A3A31]/70">Role</p>
                        <p className="font-medium text-[#5A3A31]">
                          {selectedUser.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Users;
