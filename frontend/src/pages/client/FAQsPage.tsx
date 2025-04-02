import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";

const FAQsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-medium mb-2 text-center">
            Frequently Asked Questions
          </h1>
          <p className="text-gallery-text/70 mb-8 text-center">
            Everything you need to know about our art auction platform
          </p>

          <Separator className="my-8" />

          <section className="mb-12">
            <h2 className="text-2xl font-medium mb-6">
              How to Participate in Auctions
            </h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  How do I place a bid?
                </AccordionTrigger>
                <AccordionContent>
                  To place a bid, navigate to the artwork you're interested in
                  and click on it to view the details. On the artwork page,
                  enter your bid amount in the bidding section. Your bid must be
                  higher than the current highest bid. Once you submit your bid,
                  you'll receive a confirmation notification.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  How are auctions timed?
                </AccordionTrigger>
                <AccordionContent>
                  Each auction has a specific start and end time, displayed on
                  the artwork listing. Auctions typically run for 3-7 days. In
                  some cases, if a bid is placed in the last 5 minutes of an
                  auction, the auction may be extended by an additional 5
                  minutes to prevent last-second bidding wars.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  What happens if I win an auction?
                </AccordionTrigger>
                <AccordionContent>
                  If you're the highest bidder when an auction ends, you'll
                  receive a notification confirming your win. You'll then
                  proceed to the payment process. Once payment is confirmed,
                  arrangements for the artwork shipment will be made directly
                  with the artist or through our platform's shipping partners.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium mb-6">Rules and Regulations</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="rules-1">
                <AccordionTrigger className="text-left">
                  Bidding Ethics and Requirements
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      All bids are binding. Once placed, a bid cannot be
                      retracted.
                    </li>
                    <li>
                      Users must be at least 18 years old to participate in
                      auctions.
                    </li>
                    <li>
                      Shill bidding (artificially inflating prices) is strictly
                      prohibited.
                    </li>
                    <li>
                      Bid increments must follow our minimum increment
                      guidelines.
                    </li>
                    <li>
                      Users must have a valid payment method on file before
                      bidding.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rules-2">
                <AccordionTrigger className="text-left">
                  Artwork Authenticity and Condition
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    All artworks listed on our platform come with a certificate
                    of authenticity. Artists are required to disclose the
                    following:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Complete and accurate description of the artwork</li>
                    <li>Any damage or imperfections</li>
                    <li>Creation date and materials used</li>
                    <li>Provenance information when applicable</li>
                    <li>
                      High-quality images showing the artwork from multiple
                      angles
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rules-3">
                <AccordionTrigger className="text-left">
                  Payment and Shipping Policies
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    Our payment and shipping policies ensure a secure
                    transaction process:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Payment must be completed within 3 business days after
                      winning an auction
                    </li>
                    <li>
                      We accept major credit cards, PayPal, and bank transfers
                    </li>
                    <li>
                      Shipping costs are calculated based on artwork size,
                      weight, and destination
                    </li>
                    <li>All artworks are insured during shipping</li>
                    <li>
                      International shipping may be subject to customs fees and
                      import taxes
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium mb-6">
              For Artists and Sellers
            </h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="artist-1">
                <AccordionTrigger className="text-left">
                  How do I apply to become a seller?
                </AccordionTrigger>
                <AccordionContent>
                  To become a seller on our platform, you'll need to complete
                  the seller application process:
                  <ol className="list-decimal pl-5 mt-2 space-y-2">
                    <li>Click the "Apply as Seller" button in your profile</li>
                    <li>
                      Complete the application form with your artistic
                      background, portfolio samples, and contact information
                    </li>
                    <li>Submit high-quality examples of your artwork</li>
                    <li>
                      Our curatorial team will review your application within
                      5-7 business days
                    </li>
                    <li>
                      Upon approval, you'll receive instructions to set up your
                      seller profile
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="artist-2">
                <AccordionTrigger className="text-left">
                  What are the fees for selling artwork?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    Our fee structure is designed to be transparent and fair:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Standard commission: 15% of the final selling price</li>
                    <li>No upfront listing fees</li>
                    <li>
                      Premium placement options available for additional fees
                    </li>
                    <li>
                      Payment processing fees (typically 2.9% + $0.30) are
                      deducted from final payout
                    </li>
                    <li>
                      Payments are made to artists within 14 days after the
                      buyer receives the artwork
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="artist-3">
                <AccordionTrigger className="text-left">
                  How do I list my artwork for auction?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    Once approved as a seller, you can list your artwork through
                    these steps:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Log in to your seller account</li>
                    <li>Click "List New Artwork" from your dashboard</li>
                    <li>
                      Fill out the artwork details form, including title,
                      description, dimensions, medium, etc.
                    </li>
                    <li>Upload high-quality images from multiple angles</li>
                    <li>Set your reserve price (minimum acceptable bid)</li>
                    <li>Choose auction duration (3, 5, or 7 days)</li>
                    <li>Preview your listing and submit for approval</li>
                    <li>
                      Our team will review and approve listings within 24-48
                      hours
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-6">General Questions</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="general-1">
                <AccordionTrigger className="text-left">
                  How do I create an account?
                </AccordionTrigger>
                <AccordionContent>
                  Creating an account is simple. Click the "Sign Up" button in
                  the top right corner of the homepage. You can register using
                  your email address or sign up with your Google or Facebook
                  account. Once registered, you'll need to verify your email
                  address and complete your profile information before
                  participating in auctions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-2">
                <AccordionTrigger className="text-left">
                  Is my payment information secure?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, we take security seriously. All payment information is
                  encrypted and processed through secure payment gateways. We
                  comply with PCI DSS standards and never store your complete
                  credit card information on our servers. Additionally, all
                  transactions are monitored for suspicious activity to protect
                  both buyers and sellers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-3">
                <AccordionTrigger className="text-left">
                  Can I return an artwork if I'm not satisfied?
                </AccordionTrigger>
                <AccordionContent>
                  We have a limited return policy for special circumstances. If
                  the artwork received significantly differs from the
                  description or has undisclosed damage, you may request a
                  return within 48 hours of receipt. Each case is reviewed
                  individually by our customer service team. Normal returns for
                  change of mind are not accepted due to the unique nature of
                  artwork.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;