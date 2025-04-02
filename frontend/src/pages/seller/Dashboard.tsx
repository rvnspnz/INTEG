import { useAuth } from "@/lib/auth-context";
import SellerLayout from "@/components/Layout/SellerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PackageOpen, TrendingUp, Users, Gavel, History, ArrowRight, BarChart2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { MyBids } from "./Dashboard/MyBids";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Sample metrics for the dashboard
  const metrics = {
    totalItems: 5250,
    totalBidders: 28,
    activeAuctions: 3
  };
  
  if (!user) {
    return (
      <SellerLayout>
        <div className="py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
            <p className="mb-4">Please log in to access your seller dashboard</p>
            <Button className="bg-[#AA8F66] hover:bg-[#AA8F66]/90 text-white" asChild>
              <a href="/login">Log In</a>
            </Button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#5A3A31]">Dashboard</h1>
          <p className="text-[#5A3A31]/60 mt-2">
            Welcome back, {user?.name}! Here's an overview of your auctions.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-[#AA8F66]/10 to-[#AA8F66]/5 border-none shadow-md overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#AA8F66]/10 to-transparent"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[#5A3A31] font-medium">Total Items</CardTitle>
              <div className="h-8 w-8 rounded-md bg-[#AA8F66]/20 flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-[#AA8F66]" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-[#5A3A31]">{metrics.totalItems}</div>
              <div className="h-1 w-16 bg-[#AA8F66]/30 mt-3 rounded-full"></div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-[#AA8F66]/10 to-[#AA8F66]/5 border-none shadow-md overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#AA8F66]/10 to-transparent"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[#5A3A31] font-medium">Total Bidders</CardTitle>
              <div className="h-8 w-8 rounded-md bg-[#AA8F66]/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-[#AA8F66]" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-[#5A3A31]">{metrics.totalBidders}</div>
              <div className="h-1 w-16 bg-[#AA8F66]/30 mt-3 rounded-full"></div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-[#AA8F66]/10 to-[#AA8F66]/5 border-none shadow-md overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#AA8F66]/10 to-transparent"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[#5A3A31] font-medium">Active Auctions</CardTitle>
              <div className="h-8 w-8 rounded-md bg-[#AA8F66]/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#AA8F66]" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-[#5A3A31]">{metrics.activeAuctions}</div>
              <div className="h-1 w-16 bg-[#AA8F66]/30 mt-3 rounded-full"></div>
            </CardContent>
          </Card>
        </div>
        
        {/* Account Type */}
        <Card className="border border-[#AA8F66]/10 shadow-sm overflow-hidden">
          <div className="flex items-center p-6">
            <div className="text-sm text-[#5A3A31]">
              Account Type: 
              <span className="ml-2 inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-[#AA8F66]/10 text-[#AA8F66] border border-[#AA8F66]/20">
                Seller @{user.username}
              </span>
            </div>
          </div>
        </Card>
        
        {/* My Bids Section */}
        <MyBids />
      </div>
    </SellerLayout>
  );
}