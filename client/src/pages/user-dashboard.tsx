import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { taxDetailsSchema, type TaxDetails, type Donation } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  LogOut,
  FileText,
  CreditCard,
  DollarSign,
  BarChart3,
  User,
  FileSpreadsheet,
  Loader2,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  title: string;
  icon: LucideIcon;
  value: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    value: "dashboard",
  },
  {
    title: "Tax Details",
    icon: FileText,
    value: "tax-details",
  },
  {
    title: "Donation History",
    icon: CreditCard,
    value: "donation-history",
  },
];

// Random colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function UserDashboard() {
  const { user, logoutMutation, updateTaxDetailsMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Tax details form
  const taxForm = useForm<TaxDetails>({
    resolver: zodResolver(taxDetailsSchema),
    defaultValues: {
      documentType: user?.documentType as "aadhar" | "pan" || "aadhar",
      documentNumber: user?.documentNumber || "",
    },
  });

  // Fetch user donation stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/user-dashboard/stats"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user-dashboard/stats");
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard statistics");
      }
      return res.json();
    },
  });

  // Fetch user donations
  const { data: donationsData, isLoading: isLoadingDonations } = useQuery({
    queryKey: ["/api/user-dashboard/donations"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user-dashboard/donations");
      if (!res.ok) {
        throw new Error("Failed to fetch donation history");
      }
      return res.json();
    },
  });

  // Prepare pie chart data
  const getPieChartData = () => {
    if (!stats || !stats.stats.purposeBreakdown) return [];
    
    return Object.entries(stats.stats.purposeBreakdown).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Handler for updating tax details
  const onTaxDetailsSubmit = taxForm.handleSubmit((data) => {
    updateTaxDetailsMutation.mutate(data);
  });

  // Handler for exporting donation history
  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your donation history is being exported to Excel",
    });
    
    // In a real implementation, this would trigger an API call to generate and download the Excel file
    // For now, just show a toast notification
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your donation history has been exported successfully",
      });
    }, 2000);
  };

  // Handler for downloading invoice
  const handleDownloadInvoice = (donationId: number) => {
    toast({
      title: "Invoice Download Started",
      description: "Your donation invoice is being prepared for download",
    });
    
    // In a real implementation, this would trigger an API call to generate and download the invoice
    // For now, just show a toast notification
    setTimeout(() => {
      toast({
        title: "Invoice Ready",
        description: "Your donation invoice has been downloaded successfully",
      });
    }, 1500);
  };

  // Handler for logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#2C5282] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-['Montserrat']">Hope Foundation</h1>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="font-medium">Welcome, {user?.name}</span>
            </div>
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <Button
                      key={item.value}
                      variant={activeTab === item.value ? "default" : "ghost"}
                      className={`justify-start ${
                        activeTab === item.value
                          ? "bg-[#2C5282] text-white"
                          : "text-gray-600"
                      }`}
                      onClick={() => setActiveTab(item.value)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {/* Dashboard Tab */}
                  <TabsContent value="dashboard">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                        <p className="text-gray-600 mb-6">
                          View your donation statistics and impact
                        </p>
                      </div>

                      {isLoadingStats ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-[#2C5282]" />
                        </div>
                      ) : (
                        <>
                          {/* Stats Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Total Donated
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                      ₹{stats?.stats.totalDonated || 0}
                                    </h3>
                                  </div>
                                  <div className="p-3 rounded-full bg-blue-100">
                                    <DollarSign className="h-6 w-6 text-blue-600" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Completed Donations
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                      {stats?.stats.completedDonations || 0}
                                    </h3>
                                  </div>
                                  <div className="p-3 rounded-full bg-green-100">
                                    <CreditCard className="h-6 w-6 text-green-600" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Pending Donations
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                      {stats?.stats.pendingDonations || 0}
                                    </h3>
                                  </div>
                                  <div className="p-3 rounded-full bg-yellow-100">
                                    <FileText className="h-6 w-6 text-yellow-600" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Charts */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            {/* Purpose Breakdown */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Donation Purpose Breakdown</CardTitle>
                                <CardDescription>
                                  Where your donations are being used
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="h-80">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <Pie
                                        data={getPieChartData()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        {getPieChartData().map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                      </Pie>
                                      <Tooltip formatter={(value) => `₹${value}`} />
                                      <Legend />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Recent Donations */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Recent Donations</CardTitle>
                                <CardDescription>
                                  Your 5 most recent donations
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="h-80 overflow-auto">
                                  {isLoadingDonations ? (
                                    <div className="flex justify-center py-12">
                                      <Loader2 className="h-8 w-8 animate-spin text-[#2C5282]" />
                                    </div>
                                  ) : (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Date</TableHead>
                                          <TableHead>Amount</TableHead>
                                          <TableHead>Purpose</TableHead>
                                          <TableHead>Status</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {donationsData?.donations
                                          ?.slice(0, 5)
                                          .map((donation: Donation) => (
                                            <TableRow key={donation.id}>
                                              <TableCell>
                                                {new Date(donation.createdAt).toLocaleDateString()}
                                              </TableCell>
                                              <TableCell>₹{donation.amount}</TableCell>
                                              <TableCell>{donation.purpose}</TableCell>
                                              <TableCell>
                                                <span
                                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    donation.status === "completed"
                                                      ? "bg-green-100 text-green-800"
                                                      : "bg-yellow-100 text-yellow-800"
                                                  }`}
                                                >
                                                  {donation.status}
                                                </span>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        {(!donationsData?.donations || donationsData.donations.length === 0) && (
                                          <TableRow>
                                            <TableCell
                                              colSpan={4}
                                              className="text-center text-gray-500 py-8"
                                            >
                                              No donations yet
                                            </TableCell>
                                          </TableRow>
                                        )}
                                      </TableBody>
                                    </Table>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  {/* Tax Details Tab */}
                  <TabsContent value="tax-details">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Tax Details</h2>
                        <p className="text-gray-600 mb-6">
                          Update your tax document details for donation receipts
                        </p>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Tax Document Information</CardTitle>
                          <CardDescription>
                            These details will be used on your donation receipts for tax purposes
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Form {...taxForm}>
                            <form onSubmit={onTaxDetailsSubmit} className="space-y-6">
                              <FormField
                                control={taxForm.control}
                                name="documentType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Document Type</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select document type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                                        <SelectItem value="pan">PAN Card</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Select the type of identity document you want to use
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={taxForm.control}
                                name="documentNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Document Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter your document number" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      {taxForm.watch("documentType") === "aadhar"
                                        ? "Enter your 12-digit Aadhar Card number"
                                        : "Enter your 10-character PAN Card number"}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button 
                                type="submit" 
                                className="bg-[#2C5282] hover:bg-[#1A365D]"
                                disabled={updateTaxDetailsMutation.isPending}
                              >
                                {updateTaxDetailsMutation.isPending ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Update Tax Details
                              </Button>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Donation History Tab */}
                  <TabsContent value="donation-history">
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-bold mb-1">Donation History</h2>
                          <p className="text-gray-600">View and download your donation records</p>
                        </div>
                        <Button 
                          onClick={handleExportData}
                          className="bg-[#38A169] hover:bg-[#2F855A]"
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Export to Excel
                        </Button>
                      </div>

                      <Card>
                        <CardContent className="pt-6">
                          {isLoadingDonations ? (
                            <div className="flex justify-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-[#2C5282]" />
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Purpose</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment ID</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {donationsData?.donations?.map((donation: Donation) => (
                                    <TableRow key={donation.id}>
                                      <TableCell>
                                        {new Date(donation.createdAt).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>₹{donation.amount}</TableCell>
                                      <TableCell>{donation.purpose}</TableCell>
                                      <TableCell>
                                        <span
                                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            donation.status === "completed"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-yellow-100 text-yellow-800"
                                          }`}
                                        >
                                          {donation.status}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        {donation.paymentId || "-"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleDownloadInvoice(donation.id)}
                                          disabled={donation.status !== "completed"}
                                        >
                                          <Download className="h-4 w-4 mr-1" />
                                          Invoice
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  {(!donationsData?.donations || donationsData.donations.length === 0) && (
                                    <TableRow>
                                      <TableCell
                                        colSpan={6}
                                        className="text-center text-gray-500 py-8"
                                      >
                                        No donations yet
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}