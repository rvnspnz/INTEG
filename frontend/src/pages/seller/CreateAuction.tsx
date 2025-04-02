import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuctionForm from "@/components/AuctionForm";
import AuctionWarning from "@/components/AuctionWarning";
import SellerLayout from '@/components/Layout/SellerLayout';

const CreateAuction: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [isNavigating, setIsNavigating] = useState<boolean>(false); // State for transition
  const navigate = useNavigate();

  const handleAuctionSubmit = () => {
    setIsSubmitted(true);
    setCanEdit(false);
  };

  const handleBackClick = () => {
    setIsNavigating(true); // Trigger transition
    setTimeout(() => {
      navigate("/auctions"); // Navigate after transition
    }, 300); // Match the duration of the transition
  };

  return (
    <SellerLayout>
      <div className={`min-h-screen bg-gradient-to-br from-white to-[#AA8F66]/5`}>
        <div className="container mx-auto pb-16">
          {/* Breadcrumb */}
          <div className="mb-2">
            <button
              onClick={handleBackClick}
              className="inline-flex items-center gap-1 text-sm text-gallery-text/70 hover:text-gallery-accent transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>

          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-3xl">
              {!isSubmitted && <AuctionForm onSubmit={handleAuctionSubmit} isEditable={canEdit} />}
              {isSubmitted && <AuctionWarning auctionId={""} />}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default CreateAuction;