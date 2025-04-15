import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, useRoute } from "wouter";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function DonationSuccess() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/donation-success");
  const [donationDetails, setDonationDetails] = useState<{
    amount: string;
    name: string;
    purpose: string;
  } | null>(null);

  useEffect(() => {
    // Get donation details from URL params or local storage
    const searchParams = new URLSearchParams(window.location.search);
    const amount = searchParams.get("amount");
    const name = searchParams.get("name");
    const purpose = searchParams.get("purpose");
    
    if (amount && name) {
      setDonationDetails({
        amount,
        name,
        purpose: purpose || "Where Needed Most",
      });
    } else {
      // Try to get from local storage
      const storedDetails = localStorage.getItem("donationDetails");
      if (storedDetails) {
        setDonationDetails(JSON.parse(storedDetails));
      }
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-['Montserrat']">Thank You!</h1>
            <p className="text-gray-600">
              Your donation has been successfully processed. A confirmation email has been sent to your registered email address.
            </p>
          </div>
          
          {donationDetails && (
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Donation Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">₹{donationDetails.amount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Purpose:</span>
                <span className="font-semibold">{donationDetails.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donor:</span>
                <span className="font-semibold">{donationDetails.name}</span>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-6 text-center">
            Your generosity will make a real difference in the lives of those we serve. Together, we can create a better future for communities in need.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => setLocation("/")} 
              className="bg-[#2C5282] hover:bg-[#1A365D] text-white px-6 py-2 rounded-full transition-colors"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
