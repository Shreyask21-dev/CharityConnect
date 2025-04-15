import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Donation } from "@shared/schema";
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
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  FileText,
  Users,
  BarChart3,
  FileSpreadsheet,
  Loader2,
  LucideIcon,
  Search,
  Calendar,
  Eye,
  Download,
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
    title: "Donors",
    icon: Users,
    value: "donors",
  },
  {
    title: "Donation Details",
    icon: FileText,
    value: "donations",
  },
  {
    title: "Reports",
    icon: BarChart3,
    value: "reports",
  },
];

// Random colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonorId, setSelectedDonorId] = useState<number | null>(null);
  const [showDonorDetails, setShowDonorDetails] = useState(false);
  
  // Date range for filtering
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Fetch admin dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/admin-dashboard/stats"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin-dashboard/stats");
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard statistics");
      }
      return res.json();
    },
  });

  // Fetch all donors
  const { data: donorsData, isLoading: isLoadingDonors } = useQuery({
    queryKey: ["/api/admin-dashboard/donors"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin-dashboard/donors");
      if (!res.ok) {
        throw new Error("Failed to fetch donors");
      }
      return res.json();
    },
  });

  // Fetch all donations with date filter
  const { data: donationsData, isLoading: isLoadingDonations } = useQuery({
    queryKey: ["/api/admin-dashboard/donations", startDate, endDate],
    queryFn: async () => {
      const url = `/api/admin-dashboard/donations?startDate=${startDate}&endDate=${endDate}`;
      const res = await apiRequest("GET", url);
      if (!res.ok) {
        throw new Error("Failed to fetch donations");
      }
      return res.json();
    },
  });

  // Fetch donor-specific donations
  const { data: donorDonations, isLoading: isLoadingDonorDonations } = useQuery({
    queryKey: ["/api/admin-dashboard/donor", selectedDonorId, "donations"],
    queryFn: async () => {
      if (!selectedDonorId) return { donations: [] };
      const res = await apiRequest("GET", `/api/admin-dashboard/donor/${selectedDonorId}/donations`);
      if (!res.ok) {
        throw new Error("Failed to fetch donor donations");
      }
      return res.json();
    },
    enabled: !!selectedDonorId,
  });

  // Prepare pie chart data for purpose breakdown
  const getPieChartData = () => {
    if (!stats || !stats.stats.purposeBreakdown) return [];
    
    return Object.entries(stats.stats.purposeBreakdown).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Filter donors by search term
  const filteredDonors = donorsData?.donors
    ? donorsData.donors.filter((donor: any) =>
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.mobile.includes(searchTerm) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Filter donations by search term
  const filteredDonations = donationsData?.donations
    ? donationsData.donations.filter((donation: Donation) =>
        donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.mobile.includes(searchTerm) ||
        donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handler for viewing donor details
  const handleViewDonor = (donorId: number) => {
    setSelectedDonorId(donorId);
    setShowDonorDetails(true);
  };

  // Handler for exporting data
  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: `${activeTab === "donors" ? "Donors" : "Donations"} data is being exported to Excel`,
    });
    
    // In a real implementation, this would trigger an API call to generate and download the Excel file
    // For now, just show a toast notification
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${activeTab === "donors" ? "Donors" : "Donations"} data has been exported successfully`,
      });
    }, 2000);
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
          <h1 className="text-2xl font-bold font-['Montserrat']">Hope Foundation Admin</h1>
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
                        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                        <p className="text-gray-600 mb-6">
                          Overview of donation statistics and platform activity
                        </p>
                      </div>

                      {isLoadingStats ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-[#2C5282]" />
                        </div>
                      ) : (
                        <>
                          {/* Stats Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Total Donations
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                      ₹{stats?.stats.totalDonated || 0}
                                    </h3>
                                  </div>
                                  <div className="p-3 rounded-full bg-blue-100">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Completed Transactions
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                      {stats?.stats.completedDonations || 0}
                                    </h3>
                                  </div>
                                  <div className="p-3 rounded-full bg-green-100">
                                    <FileText className="h-6 w-6 text-green-600" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Pending Transactions
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
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">
                                      Total Donors
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                      {stats?.stats.totalDonors || 0}
                                    </h3>
                                  </div>
                                  <div className="p-3 rounded-full bg-purple-100">
                                    <Users className="h-6 w-6 text-purple-600" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Charts */}
                          <div className="grid grid-cols-1 gap-6 mt-6">
                            {/* Purpose Breakdown */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Donation Purpose Breakdown</CardTitle>
                                <CardDescription>
                                  Distribution of donations by purpose
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
                                        labelLine={true}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
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
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  {/* Donors Tab */}
                  <TabsContent value="donors">
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-bold mb-1">Donors</h2>
                          <p className="text-gray-600">View registered donor information and donation history</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="text"
                              placeholder="Search donors..."
                              className="pl-8 w-full"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={handleExportData}
                            className="bg-[#38A169] hover:bg-[#2F855A]"
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>

                      <Card>
                        <CardContent className="pt-6">
                          {isLoadingDonors ? (
                            <div className="flex justify-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-[#2C5282]" />
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Mobile</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Total Donated</TableHead>
                                    <TableHead>Transactions</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {filteredDonors.map((donor: any) => (
                                    <TableRow key={donor.id}>
                                      <TableCell className="font-medium">{donor.name}</TableCell>
                                      <TableCell>{donor.mobile}</TableCell>
                                      <TableCell>{donor.email}</TableCell>
                                      <TableCell>₹{donor.totalDonated}</TableCell>
                                      <TableCell>{donor.transactionCount}</TableCell>
                                      <TableCell className="text-right">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleViewDonor(donor.id)}
                                        >
                                          <Eye className="h-4 w-4 mr-1" />
                                          View
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  {(!filteredDonors || filteredDonors.length === 0) && (
                                    <TableRow>
                                      <TableCell
                                        colSpan={6}
                                        className="text-center text-gray-500 py-8"
                                      >
                                        {searchTerm ? "No donors match your search" : "No donors found"}
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

                  {/* Donations Tab */}
                  <TabsContent value="donations">
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-bold mb-1">Donation Details</h2>
                          <p className="text-gray-600">View all donation transactions with filtering options</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-32"
                              />
                            </div>
                            <span>to</span>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-32"
                              />
                            </div>
                          </div>
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="text"
                              placeholder="Search donations..."
                              className="pl-8 w-full"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={handleExportData}
                            className="bg-[#38A169] hover:bg-[#2F855A]"
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
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
                                    <TableHead>Donor</TableHead>
                                    <TableHead>Mobile</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Purpose</TableHead>
                                    <TableHead>Document</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment ID</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {filteredDonations.map((donation: Donation) => (
                                    <TableRow key={donation.id}>
                                      <TableCell>
                                        {new Date(donation.createdAt).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell className="font-medium">{donation.name}</TableCell>
                                      <TableCell>{donation.mobile}</TableCell>
                                      <TableCell>₹{donation.amount}</TableCell>
                                      <TableCell>{donation.purpose}</TableCell>
                                      <TableCell>
                                        {donation.documentType === "aadhar" ? "Aadhar" : "PAN"}: {donation.documentNumber}
                                      </TableCell>
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
                                    </TableRow>
                                  ))}
                                  {(!filteredDonations || filteredDonations.length === 0) && (
                                    <TableRow>
                                      <TableCell
                                        colSpan={8}
                                        className="text-center text-gray-500 py-8"
                                      >
                                        {searchTerm ? "No donations match your search" : "No donations found for the selected date range"}
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

                  {/* Reports Tab */}
                  <TabsContent value="reports">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Reports</h2>
                        <p className="text-gray-600 mb-6">
                          Donation trends and statistical reports
                        </p>
                      </div>

                      {isLoadingStats ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-[#2C5282]" />
                        </div>
                      ) : (
                        <>
                          <Card>
                            <CardHeader>
                              <CardTitle>Donation Purpose Distribution</CardTitle>
                              <CardDescription>
                                Breakdown of donations by category
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={getPieChartData()}
                                    margin={{
                                      top: 20,
                                      right: 30,
                                      left: 20,
                                      bottom: 5,
                                    }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value}`} />
                                    <Legend />
                                    <Bar dataKey="value" fill="#2C5282" name="Amount" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline" onClick={handleExportData}>
                                <Download className="h-4 w-4 mr-2" />
                                Export Chart Data
                              </Button>
                            </CardFooter>
                          </Card>
                        </>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Donor Details Dialog */}
      <Dialog open={showDonorDetails} onOpenChange={setShowDonorDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Donor Donation History</DialogTitle>
            <DialogDescription>
              View all donations made by this donor
            </DialogDescription>
          </DialogHeader>
          {isLoadingDonorDonations ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#2C5282]" />
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[60vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donorDonations?.donations?.map((donation: Donation) => (
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
                    </TableRow>
                  ))}
                  {(!donorDonations?.donations || donorDonations.donations.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-500 py-8"
                      >
                        No donation history found for this donor
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowDonorDetails(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}