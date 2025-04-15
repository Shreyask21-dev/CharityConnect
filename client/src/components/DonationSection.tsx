import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowRight, ArrowLeft, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { donationFormSchema, type DonationForm } from "@shared/schema";

export default function DonationSection() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  
  // Form setup
  const form = useForm<DonationForm>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      amount: 500,
      purpose: "",
      address: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      documentType: "aadhar",
      documentNumber: "",
    },
  });
  
  // Handle donation submission
  const donationMutation = useMutation({
    mutationFn: async (data: DonationForm) => {
      const response = await apiRequest("POST", "/api/donations", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Store donation details for success page
      const donationDetails = {
        amount: String(form.getValues("amount")),
        name: form.getValues("name"),
        purpose: getPurposeLabel(form.getValues("purpose")),
      };
      
      localStorage.setItem("donationDetails", JSON.stringify(donationDetails));
      
      // In a real implementation, this would trigger the Razorpay integration
      // For now, just redirect to success page
      setLocation(`/donation-success?amount=${donationDetails.amount}&name=${encodeURIComponent(donationDetails.name)}&purpose=${encodeURIComponent(donationDetails.purpose)}`);
      
      toast({
        title: "Donation Successful",
        description: "Thank you for your generosity!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: DonationForm) => {
    donationMutation.mutate(data);
  };
  
  const nextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(['name', 'mobile', 'email', 'amount', 'purpose']);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await form.trigger(['address', 'street', 'city', 'state', 'pincode', 'documentType', 'documentNumber']);
      if (isValid) setStep(3);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Helper function to get purpose label
  const getPurposeLabel = (value: string): string => {
    const purposes = {
      education: "Education",
      healthcare: "Healthcare",
      water: "Clean Water",
      food: "Food Security",
      emergency: "Emergency Relief",
      general: "Where Needed Most",
    };
    
    return purposes[value as keyof typeof purposes] || "Where Needed Most";
  };

  return (
    <section id="donate" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-gray-800 mb-4">Make a Difference Today</h2>
            <div className="w-20 h-1 bg-[#38A169] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Your generosity can transform lives. Choose a donation amount below or customize your contribution.</p>
          </div>
          
          <Card className="bg-gray-50 rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/5 bg-[#2C5282] text-white p-8 flex items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Your Impact</h3>
                  <p className="mb-6">Every donation, no matter how small, makes a difference. Here's what your contribution can provide:</p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-white rounded-full p-1 mr-3 mt-1">
                        <Check className="text-[#2C5282] h-3 w-3" />
                      </div>
                      <span>₹500 can provide educational supplies for a child for a month</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-white rounded-full p-1 mr-3 mt-1">
                        <Check className="text-[#2C5282] h-3 w-3" />
                      </div>
                      <span>₹1,000 can provide clean drinking water for a family for 3 months</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-white rounded-full p-1 mr-3 mt-1">
                        <Check className="text-[#2C5282] h-3 w-3" />
                      </div>
                      <span>₹5,000 can fund a medical camp in a remote village</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <p className="font-semibold mb-2">We accept:</p>
                    <div className="flex space-x-3">
                      <CreditCard className="h-6 w-6" />
                      <CreditCard className="h-6 w-6" />
                      <CreditCard className="h-6 w-6" />
                      <CreditCard className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-3/5 p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="font-['Roboto']">
                    {/* Step indicators */}
                    <div className="flex mb-8">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step > 1 ? "bg-green-500 text-white" : "bg-[#2C5282] text-white"}`}>
                            {step > 1 ? <Check className="h-5 w-5" /> : "1"}
                          </div>
                          <div className="ml-2 text-sm font-semibold">Your Info</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step > 2 ? "bg-green-500 text-white" : step === 2 ? "bg-[#2C5282] text-white" : "bg-gray-300 text-gray-600"}`}>
                            {step > 2 ? <Check className="h-5 w-5" /> : "2"}
                          </div>
                          <div className={`ml-2 text-sm font-semibold ${step >= 2 ? "" : "text-gray-500"}`}>Details</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === 3 ? "bg-[#2C5282] text-white" : "bg-gray-300 text-gray-600"}`}>
                            3
                          </div>
                          <div className={`ml-2 text-sm font-semibold ${step === 3 ? "" : "text-gray-500"}`}>Payment</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 text-sm font-medium">Full Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 text-sm font-medium">Mobile Number *</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none" 
                                  />
                                </FormControl>
                                <p className="text-xs text-gray-500 mt-1">This will be used as your unique identifier</p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="mb-6">
                              <FormLabel className="text-gray-700 text-sm font-medium">Email Address *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="email" 
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 text-sm font-medium">Donation Amount (₹) *</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field}
                                    type="number" 
                                    min="100"
                                    onChange={(e) => field.onChange(parseInt(e.target.value))} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="purpose"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 text-sm font-medium">Purpose *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none">
                                      <SelectValue placeholder="Select a purpose" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="education">Education</SelectItem>
                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                    <SelectItem value="water">Clean Water</SelectItem>
                                    <SelectItem value="food">Food Security</SelectItem>
                                    <SelectItem value="emergency">Emergency Relief</SelectItem>
                                    <SelectItem value="general">Where Needed Most</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            type="button" 
                            onClick={nextStep}
                            className="bg-[#2C5282] text-white px-6 py-2 rounded-md hover:bg-[#1A365D] focus:outline-none focus:ring-2 focus:ring-[#2C5282] focus:ring-offset-2 transition-colors"
                          >
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 2: Address Details */}
                    {step === 2 && (
                      <div>
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="mb-6">
                              <FormLabel className="text-gray-700 text-sm font-medium">Address *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem className="mb-6">
                              <FormLabel className="text-gray-700 text-sm font-medium">Street *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 text-sm font-medium">City *</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 text-sm font-medium">State *</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 text-sm font-medium">Pincode *</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="documentType"
                          render={({ field }) => (
                            <FormItem className="mb-6">
                              <FormLabel className="text-gray-700 text-sm font-medium mb-1">Document Type *</FormLabel>
                              <FormControl>
                                <RadioGroup 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value} 
                                  className="flex space-x-4 mt-2"
                                >
                                  <div className="flex items-center">
                                    <RadioGroupItem value="aadhar" id="aadhar" />
                                    <label htmlFor="aadhar" className="ml-2">Aadhar Card</label>
                                  </div>
                                  <div className="flex items-center">
                                    <RadioGroupItem value="pan" id="pan" />
                                    <label htmlFor="pan" className="ml-2">PAN Card</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="documentNumber"
                          render={({ field }) => (
                            <FormItem className="mb-6">
                              <FormLabel className="text-gray-700 text-sm font-medium">Document Number *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2C5282] focus:outline-none" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-between">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevStep}
                            className="text-gray-600 px-6 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                          </Button>
                          <Button 
                            type="button" 
                            onClick={nextStep}
                            className="bg-[#2C5282] text-white px-6 py-2 rounded-md hover:bg-[#1A365D] focus:outline-none focus:ring-2 focus:ring-[#2C5282] focus:ring-offset-2 transition-colors"
                          >
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 3: Payment */}
                    {step === 3 && (
                      <div>
                        <div className="bg-gray-100 p-4 rounded-md mb-6">
                          <h4 className="font-semibold text-gray-800 mb-2">Donation Summary</h4>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-semibold">₹{form.getValues("amount")}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Purpose:</span>
                            <span className="font-semibold">{getPurposeLabel(form.getValues("purpose"))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Donor:</span>
                            <span className="font-semibold">{form.getValues("name")}</span>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <p className="text-sm text-gray-600 mb-4">Your donation is eligible for tax benefits under Section 80G. A receipt will be sent to your email after the donation is processed.</p>
                          
                          <div className="flex items-start mb-4">
                            <Checkbox id="terms" required className="mt-1" />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                              I agree to the <a href="#" className="text-[#2C5282] hover:underline">terms and conditions</a> and confirm that the information provided is correct.
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevStep}
                            className="text-gray-600 px-6 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={donationMutation.isPending}
                            className="bg-[#F6AD55] hover:bg-[#ED8936] text-white px-8 py-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-[#F6AD55] focus:ring-offset-2 transition-colors"
                          >
                            {donationMutation.isPending ? "Processing..." : "Donate Now"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </Form>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
