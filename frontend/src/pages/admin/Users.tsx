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

  const getRoleVariant = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "seller":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "buyer":
        return "bg-green-100 text-green-800 border-green-300";
      case "moderator":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <div className="flex items-center">
          {row.avatarUrl ? (
            <img
              src={row.avatarUrl}
              alt={`${row.firstName} ${row.lastName}`}
              className="h-10 w-10 rounded-full mr-3"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#AA8F66]/10 flex items-center justify-center mr-3">
              <span className="text-[#5A3A31] font-medium">
                {row.firstName?.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium text-[#5A3A31]">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-sm text-[#5A3A31]/70">{row.email}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "role",
      header: "Role",
      cell: (row) => (
        <span
          className={`text-sm py-1.5 px-3 rounded-full font-medium ${getRoleVariant(
            row.role
          )}`}
        >
          {row.role}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#5A3A31]">
            Users
          </h1>
          <p className="text-[#5A3A31]/70">View user information</p>
        </div>
      </div>

      <Card className="shadow-soft">
        <DataTable
          columns={columns}
          fetchData={fetchUsers}
          onView={handleViewDetails}
          searchPlaceholder="Search users..."
        />
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#5A3A31]">User Details</DialogTitle>
            <DialogDescription className="text-[#5A3A31]/70">
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
                <span
                  className={`ml-auto py-1.5 px-3 rounded-full font-medium text-sm ${getRoleVariant(
                    selectedUser.role
                  )}`}
                >
                  {selectedUser.role}
                </span>
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
                          <span
                            className={`py-1.5 px-3 rounded-full text-sm ${getRoleVariant(
                              selectedUser.role
                            )}`}
                          >
                            {selectedUser.role}
                          </span>
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
