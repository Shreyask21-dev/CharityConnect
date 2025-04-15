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
  ...registerSchema.shape,
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
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
    const { termsAccepted, ...registrationData } = data;
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
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-bold text-gray-800">Login to Your Account</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account and donation history
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  {/* User Login Form */}
                  <Form {...loginForm}>
                    <form onSubmit={onUserLoginSubmit} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your registered mobile number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-[#2C5282] hover:bg-[#1A365D]"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Login
                      </Button>
                    </form>
                  </Form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  {/* Admin Login Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Admin Login</h3>
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
                <CardFooter className="px-0 flex justify-center border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>
                      Register now
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-bold text-gray-800">Create an Account</CardTitle>
                  <CardDescription>
                    Register to keep track of your donations and download tax receipts
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Form {...registerForm}>
                    <form onSubmit={onRegisterSubmit} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your mobile number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I accept the terms and conditions
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-[#2C5282] hover:bg-[#1A365D]"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Register
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="px-0 flex justify-center border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>
                      Login
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}