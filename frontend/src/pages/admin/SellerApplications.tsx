import { useState, useEffect } from "react";
import { BadgeCheck, Clock, X, User, FileText, Briefcase } from "lucide-react";
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
import MainLayout from "@/components/Layout/MainLayout";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/custom-badge";
import axios from "axios";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/seller-applications";

axios.defaults.withCredentials = true;

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

interface SellerApplication {
  applicationId: number;
  user: User;
  status: "PENDING" | "APPROVED" | "REJECTED";
  appliedAt: string;
  approvedAt?: string;
  admin?: User;
}

const SellerApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] =
    useState<SellerApplication | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    total: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(API_BASE_URL, { withCredentials: true });
      const applications = response.data || [];

      const counts = {
        PENDING: 0,
        APPROVED: 0,
        REJECTED: 0,
        total: applications.length,
      };

      applications.forEach((app: SellerApplication) => {
        counts[app.status] += 1;
      });

      setStatusCounts(counts);
      return applications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
      return [];
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "rejected";
      case "PENDING":
        return "pending";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <BadgeCheck className="h-4 w-4 mr-1.5" />;
      case "REJECTED":
        return <X className="h-4 w-4 mr-1.5" />;
      case "PENDING":
        return <Clock className="h-4 w-4 mr-1.5" />;
      default:
        return null;
    }
  };

  const formatStatusText = (status: string) => {
    return status === "APPROVED"
      ? "Approved"
      : status === "REJECTED"
      ? "Rejected"
      : status === "PENDING"
      ? "Pending"
      : status;
  };

  const handleViewDetails = (application: SellerApplication) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const handleApprove = async (application: SellerApplication) => {
    try {
      await axios.put(
        `${API_BASE_URL}/${application.applicationId}`,
        {},
        {
          params: {
            status: "APPROVED",
            adminId: user.id,
          },
          withCredentials: true,
        }
      );

      toast.success(
        `${application.user.firstName} ${application.user.lastName}'s application has been approved`
      );
      setIsViewDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application");
    }
  };

  const handleReject = async (application: SellerApplication) => {
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/${application.applicationId}`,
        {},
        {
          params: {
            status: "REJECTED",
            adminId: user.id,
          },
          withCredentials: true,
        }
      );

      toast.success("Application rejected successfully");
      setIsViewDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = [
    {
      id: "name",
      header: "Applicant",
      cell: (row: SellerApplication) => (
        <div className="flex items-center">
          {row.user.avatarUrl ? (
            <img
              src={row.user.avatarUrl}
              alt={`${row.user.firstName} ${row.user.lastName}`}
              className="h-10 w-10 rounded-full mr-3"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <span className="text-primary font-medium">
                {row.user.firstName?.charAt(0) || "A"}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium text-[#5A3A31]">
              {row.user.firstName} {row.user.lastName}
            </div>
            <div className="text-sm text-[#5A3A31]/70">{row.user.email}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "submittedAt",
      header: "Submitted",
      cell: (row: SellerApplication) => (
        <div className="text-sm text-[#5A3A31]">
          {formatDate(row.appliedAt)}
        </div>
      ),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row: SellerApplication) => (
        <div className="flex items-center">
          <StatusBadge
            variant={getStatusVariant(row.status)}
            className="text-sm py-1.5 px-3 h-7 flex items-center"
          >
            {getStatusIcon(row.status)}
            {formatStatusText(row.status)}
          </StatusBadge>
        </div>
      ),
      sortable: true,
    },
    {
      id: "approvedAt",
      header: "Processed Date",
      cell: (row: SellerApplication) => (
        <div className="text-sm text-[#5A3A31]">
          {row.approvedAt ? formatDate(row.approvedAt) : "Not processed"}
        </div>
      ),
      sortable: true,
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#5A3A31]">
          Seller Applications
        </h1>
        <p className="text-[#5A3A31]/70">
          Review and approve seller applications
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#5A3A31]/70">Total</p>
              <h3 className="text-2xl font-bold text-[#5A3A31]">
                {statusCounts.total}
              </h3>
            </div>
            <div className="p-2 bg-[#AA8F66]/10 rounded-full">
              <Briefcase className="h-5 w-5 text-[#AA8F66]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-amber-50 shadow-sm border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Pending</p>
              <h3 className="text-2xl font-bold text-amber-600">
                {statusCounts.PENDING}
              </h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Approved</p>
              <h3 className="text-2xl font-bold text-green-600">
                {statusCounts.APPROVED}
              </h3>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <BadgeCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-red-50 shadow-sm border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Rejected</p>
              <h3 className="text-2xl font-bold text-red-600">
                {statusCounts.REJECTED}
              </h3>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <X className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="shadow-soft overflow-hidden">
        <DataTable
          columns={columns}
          fetchData={fetchApplications}
          onView={handleViewDetails}
          searchPlaceholder="Search applications..."
        />
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#5A3A31]">
              Seller Application
            </DialogTitle>
            <DialogDescription className="text-[#5A3A31]/70">
              Review the seller application details.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-[#AA8F66]/10 flex items-center justify-center mr-3">
                  <span className="text-[#5A3A31] font-medium">
                    {selectedApplication.user.firstName?.charAt(0) || "A"}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#5A3A31]">
                    {selectedApplication.user.firstName}{" "}
                    {selectedApplication.user.lastName}
                  </h3>
                  <p className="text-sm text-[#5A3A31]/70">
                    Applied on {formatDate(selectedApplication.appliedAt)}
                  </p>
                </div>
                <StatusBadge
                  variant={getStatusVariant(selectedApplication.status)}
                  className="ml-auto text-sm py-1.5 px-3 h-7 flex items-center"
                >
                  {getStatusIcon(selectedApplication.status)}
                  {formatStatusText(selectedApplication.status)}
                </StatusBadge>
              </div>

              <Separator className="bg-[#AA8F66]/10" />

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-[#f5f0ea] p-4 rounded-lg">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-[#AA8F66]" />
                    <div>
                      <Label className="text-sm text-[#5A3A31]/70 font-medium">
                        Personal Information
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <p className="text-xs text-[#5A3A31]/70">
                            First Name
                          </p>
                          <p className="font-medium text-[#5A3A31]">
                            {selectedApplication.user.firstName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#5A3A31]/70">Last Name</p>
                          <p className="font-medium text-[#5A3A31]">
                            {selectedApplication.user.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-[#5A3A31]/70">Email</p>
                        <p className="font-medium text-[#5A3A31]">
                          {selectedApplication.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedApplication.status !== "PENDING" && (
                  <div className="bg-[#f5f0ea] p-4 rounded-lg">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 mr-2 text-[#AA8F66]" />
                      <div>
                        <Label className="text-sm text-[#5A3A31]/70 font-medium">
                          Processing Information
                        </Label>
                        <div className="mt-1">
                          <p className="text-xs text-[#5A3A31]/70">
                            {selectedApplication.status === "APPROVED"
                              ? "Approved On"
                              : "Rejected On"}
                          </p>
                          <p className="font-medium text-[#5A3A31]">
                            {selectedApplication.approvedAt
                              ? formatDate(selectedApplication.approvedAt)
                              : "Not recorded"}
                          </p>
                        </div>
                        {selectedApplication.admin && (
                          <div className="mt-2">
                            <p className="text-xs text-[#5A3A31]/70">
                              Processed By Admin ID
                            </p>
                            <p className="font-medium text-[#5A3A31]">
                              {selectedApplication.admin.id}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex space-x-2">
            {selectedApplication?.status === "PENDING" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedApplication)}
                  className="gap-1 rounded-md"
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedApplication)}
                  className="gap-1 rounded-md bg-[#5A3A31] hover:bg-[#4a2a21] text-white"
                >
                  <BadgeCheck className="h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {selectedApplication?.status !== "PENDING" && (
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default SellerApplications;
