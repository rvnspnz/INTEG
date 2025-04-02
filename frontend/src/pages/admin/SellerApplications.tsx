import { useState, useMemo } from "react";
import {
  BadgeCheck,
  Clock,
  X,
  User,
  Mail,
  Tag,
  FileText,
  Briefcase,
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
import { SellerApplication } from "@/lib/types";
import { sellerApplications, users } from "@/lib/data";
import MainLayout from "@/components/Layout/MainLayout";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/custom-badge";

const SellerApplications = () => {
  const [applicationsData, setApplicationsData] =
    useState<SellerApplication[]>(sellerApplications);
  const [selectedApplication, setSelectedApplication] =
    useState<SellerApplication | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Calculate application status counts
  const statusCounts = useMemo(() => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: applicationsData.length,
    };

    applicationsData.forEach((app) => {
      counts[app.status as keyof typeof counts] += 1;
    });

    return counts;
  }, [applicationsData]);

  // Helper function to map application status to StatusBadge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "rejected";
      case "pending":
        return "pending";
      default:
        return "default";
    }
  };

  const handleViewDetails = (application: SellerApplication) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const handleApprove = (application: SellerApplication) => {
    // Update application status
    setApplicationsData(
      applicationsData.map((app) =>
        app.id === application.id ? { ...app, status: "approved" } : app
      )
    );

    // Also update the user's role to seller if they're in pending status
    const user = users.find((u) => u.id === application.userId);
    if (user && user.status === "pending") {
      user.status = "active";
      user.role = "seller";
    }

    toast.success(`${application.firstName} ${application.lastName}'s application has been approved`);
    setIsViewDialogOpen(false);
  };

  const handleReject = (application: SellerApplication) => {
    setApplicationsData(
      applicationsData.map((app) =>
        app.id === application.id ? { ...app, status: "rejected" } : app
      )
    );

    toast.success(`${application.firstName} ${application.lastName}'s application has been rejected`);
    setIsViewDialogOpen(false);
  };

  // Format date to show in a nicer format
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    {
      id: "name",
      header: "Applicant",
      cell: (row: SellerApplication) => (
        <div className="flex items-center">
          {row.avatarUrl ? (
            <img
              src={row.avatarUrl}
              alt={`${row.firstName} ${row.lastName}`}
              className="h-8 w-8 rounded-full mr-3"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <span className="text-primary font-medium">
                {row.firstName.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium">{row.firstName} {row.lastName}</div>
            <div className="text-sm text-muted-foreground">@{row.username}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      cell: (row: SellerApplication) => (
        <div className="text-sm">{row.email}</div>
      ),
      sortable: true,
    },
    {
      id: "category",
      header: "Category",
      cell: (row: SellerApplication) => (
        <div className="text-sm font-medium py-1 px-2 bg-secondary/50 rounded-md inline-block">
          {row.category}
        </div>
      ),
      sortable: true,
    },
    {
      id: "submittedAt",
      header: "Submitted",
      cell: (row: SellerApplication) => (
        <div className="text-sm">
          {formatDate(row.submittedAt)}
        </div>
      ),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row: SellerApplication) => {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Seller Applications
        </h1>
        <p className="text-muted-foreground">
          Review and approve seller applications
        </p>
      </div>

      {/* Status overview cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <h3 className="text-2xl font-bold">{statusCounts.total}</h3>
            </div>
            <div className="p-2 bg-muted rounded-full">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-amber-50 shadow-sm border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Pending</p>
              <h3 className="text-2xl font-bold text-amber-600">{statusCounts.pending}</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-green-50 shadow-sm border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Approved</p>
              <h3 className="text-2xl font-bold text-green-600">{statusCounts.approved}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <BadgeCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-red-50 shadow-sm border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Rejected</p>
              <h3 className="text-2xl font-bold text-red-600">{statusCounts.rejected}</h3>
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
          data={applicationsData}
          onView={handleViewDetails}
          searchPlaceholder="Search applications..."
        />
      </Card>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Seller Application</DialogTitle>
            <DialogDescription>
              Review the seller application details.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-center">
                {selectedApplication.avatarUrl && (
                  <img
                    src={selectedApplication.avatarUrl}
                    alt={`${selectedApplication.firstName} ${selectedApplication.lastName}`}
                    className="h-12 w-12 rounded-full mr-3"
                  />
                )}
                <div>
                  <h3 className="text-base font-semibold">
                    {selectedApplication.firstName} {selectedApplication.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Applied on {formatDate(selectedApplication.submittedAt)}
                  </p>
                </div>
                <StatusBadge
                  variant={getStatusVariant(selectedApplication.status)}
                  className="ml-auto capitalize"
                >
                  {selectedApplication.status}
                </StatusBadge>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-[#f5f0ea] p-4 rounded-lg">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <Label className="text-sm text-muted-foreground font-medium">
                        Personal Information
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <p className="text-xs text-muted-foreground">First Name</p>
                          <p className="font-medium">{selectedApplication.firstName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Last Name</p>
                          <p className="font-medium">{selectedApplication.lastName}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Username</p>
                        <p className="font-medium">@{selectedApplication.username}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f0ea] p-4 rounded-lg">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <Label className="text-sm text-muted-foreground font-medium">
                        Contact Information
                      </Label>
                      <div className="mt-1">
                        <p className="text-xs text-muted-foreground">Email Address</p>
                        <p className="font-medium">{selectedApplication.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f0ea] p-4 rounded-lg">
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <Label className="text-sm text-muted-foreground font-medium">
                        Product Specialization
                      </Label>
                      <div className="mt-1">
                        <p className="text-xs text-muted-foreground">Main Category</p>
                        <div className="font-medium mt-1">
                          <span className="py-1 px-3 bg-[#8c6142] text-white rounded-full text-sm">
                            {selectedApplication.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f0ea] p-4 rounded-lg">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <Label className="text-sm text-muted-foreground font-medium">
                        Background & Experience
                      </Label>
                      <div className="mt-1">
                        <p className="text-sm">
                          {selectedApplication.background}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex space-x-2">
            {selectedApplication?.status === "pending" && (
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
                  className="gap-1 rounded-md bg-[#5A3A31] hover:bg-[#4a2a21]"
                >
                  <BadgeCheck className="h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {selectedApplication?.status !== "pending" && (
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default SellerApplications;