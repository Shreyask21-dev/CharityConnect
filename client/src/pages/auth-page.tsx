import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { loginSchema, registerSchema, adminLoginSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Create schema for registration form with terms acceptance
const extendedRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ExtendedRegisterForm = z.infer<typeof extendedRegisterSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, adminLoginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  // User login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
  });

  // Admin login form
  const adminLoginForm = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // User registration form
  const registerForm = useForm<ExtendedRegisterForm>({
    resolver: zodResolver(extendedRegisterSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  // If user is already logged in, redirect to appropriate dashboard
  if (user) {
    if (user.role === "admin") {
      setLocation("/admin-dashboard");
    } else {
      setLocation("/user-dashboard");
    }
    return null;
  }

  // Handle user login submission
  const onUserLoginSubmit = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  // Handle admin login submission
  const onAdminLoginSubmit = adminLoginForm.handleSubmit((data) => {
    adminLoginMutation.mutate(data);
  });

  // Handle user registration submission
  const onRegisterSubmit = registerForm.handleSubmit((data) => {
    const { termsAccepted, confirmPassword, ...registrationData } = data;
    registerMutation.mutate(registrationData);
  });

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row">
        {/* Hero Section */}
        <div className="w-full md:w-1/2 bg-[#2C5282] text-white p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 font-['Montserrat']">
            Welcome to Hope Foundation
          </h1>
          <p className="text-lg mb-6 opacity-90">
            Join our mission to create positive change in communities around the world. Every donation makes a difference.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xl font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Create an Account</h3>
                <p className="opacity-80">Register to keep track of your donations and access tax benefits</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xl font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Make Donations</h3>
                <p className="opacity-80">Support our projects and see the real impact of your contributions</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xl font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Track Your Impact</h3>
                <p className="opacity-80">Monitor how your donations are making a difference in people's lives</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div>
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold text-gray-800">Admin Login</CardTitle>
                <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-bold text-gray-800">Login to Your Account</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account and donation history
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  {/* Admin Login Form */}
                  <div>
                    <Form {...adminLoginForm}>
                      <form onSubmit={onAdminLoginSubmit} className="space-y-4">
                        <FormField
                          control={adminLoginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter admin email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={adminLoginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter admin password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          variant="outline" 
                          className="w-full"
                          disabled={adminLoginMutation.isPending}
                        >
                          {adminLoginMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Admin Login
                        </Button>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>
    </div>
  );
}