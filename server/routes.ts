import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { donationFormSchema, User } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // API routes for donations
  app.post("/api/donations", async (req: Request, res: Response) => {
    try {
      // Validate the donation form data
      const result = donationFormSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }
      
      const donationData = result.data;
      let userId = null;
      
      // Check if the mobile number is associated with a registered user
      let existingUser = await storage.getUserByMobile(donationData.mobile);
      
      if (!existingUser) {
        // Create new user from donation data
        existingUser = await storage.createUser({
          name: donationData.name,
          mobile: donationData.mobile,
          email: donationData.email,
          role: "user",
          documentType: donationData.documentType,
          documentNumber: donationData.documentNumber,
          address: donationData.address,
          street: donationData.street,
          city: donationData.city,
          state: donationData.state,
          pincode: donationData.pincode,
          createdAt: new Date().toISOString()
        });
        
        // Auto-login the new user
        await new Promise((resolve, reject) => {
          req.login(existingUser, (err) => {
            if (err) reject(err);
            resolve(null);
          });
        });
      }
      
      userId = existingUser.id;
      
      // Create the donation in storage
      const donation = await storage.createDonation(donationData, userId || undefined);
      
      // Set status to completed immediately since we're not using a payment gateway
      const completedDonation = await storage.updateDonationStatus(
        donation.id,
        "completed",
        `PAY-${Date.now()}`
      );
      
      res.status(201).json({ 
        success: true, 
        donation: completedDonation,
        message: "Donation registered successfully" 
      });
    } catch (error) {
      console.error("Error creating donation:", error);
      res.status(500).json({ 
        success: false, 
        error: "An error occurred while processing your donation" 
      });
    }
  });

  // Handle payment verification (mock)
  app.post("/api/payment/verify", async (req: Request, res: Response) => {
    try {
      const { donationId, paymentId } = req.body;
      
      if (!donationId || !paymentId) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing donation ID or payment ID" 
        });
      }
      
      // Update the donation status
      const donation = await storage.updateDonationStatus(
        Number(donationId), 
        "completed", 
        paymentId
      );
      
      if (!donation) {
        return res.status(404).json({ 
          success: false, 
          error: "Donation not found" 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        donation,
        message: "Payment verified successfully" 
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ 
        success: false, 
        error: "An error occurred while verifying the payment" 
      });
    }
  });

  // Get donation history by mobile number (public access)
  app.get("/api/donations/:mobile", async (req: Request, res: Response) => {
    try {
      const { mobile } = req.params;
      
      if (!mobile) {
        return res.status(400).json({ 
          success: false, 
          error: "Mobile number is required" 
        });
      }
      
      const donations = await storage.getDonationByMobile(mobile);
      
      res.status(200).json({ 
        success: true, 
        donations 
      });
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ 
        success: false, 
        error: "An error occurred while fetching donations" 
      });
    }
  });

  // User dashboard routes
  app.get("/api/user-dashboard/donations", async (req: Request, res: Response) => {
    try {
      const userId = (req.user as User).id;
      const donations = await storage.getDonationsByUserId(userId);
      
      res.status(200).json({
        success: true,
        donations
      });
    } catch (error) {
      console.error("Error fetching user donations:", error);
      res.status(500).json({
        success: false,
        error: "An error occurred while fetching donation history"
      });
    }
  });

  app.get("/api/user-dashboard/stats", async (req: Request, res: Response) => {
    try {
      const userId = (req.user as User).id;
      const donations = await storage.getDonationsByUserId(userId);
      
      // Calculate statistics
      const totalDonated = donations.reduce((sum, donation) => 
        donation.status === 'completed' ? sum + donation.amount : sum, 0);
      
      const completedDonations = donations.filter(donation => 
        donation.status === 'completed').length;
      
      const pendingDonations = donations.filter(donation => 
        donation.status === 'pending').length;
      
      // Get donation purposes breakdown
      const purposeBreakdown: Record<string, number> = {};
      donations.forEach(donation => {
        if (donation.status === 'completed') {
          purposeBreakdown[donation.purpose] = 
            (purposeBreakdown[donation.purpose] || 0) + donation.amount;
        }
      });
      
      res.status(200).json({
        success: true,
        stats: {
          totalDonated,
          completedDonations,
          pendingDonations,
          purposeBreakdown
        }
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({
        success: false,
        error: "An error occurred while fetching dashboard statistics"
      });
    }
  });

  // Admin dashboard routes
  app.get("/api/admin-dashboard/donors", async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      const userDonations = await Promise.all(
        users.filter(user => user.role === 'user').map(async user => {
          const donations = await storage.getDonationsByUserId(user.id);
          const totalDonated = donations.reduce((sum, donation) => 
            donation.status === 'completed' ? sum + donation.amount : sum, 0);
          
          return {
            id: user.id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            totalDonated,
            transactionCount: donations.filter(d => d.status === 'completed').length
          };
        })
      );
      
      res.status(200).json({
        success: true,
        donors: userDonations
      });
    } catch (error) {
      console.error("Error fetching donors:", error);
      res.status(500).json({
        success: false,
        error: "An error occurred while fetching donor information"
      });
    }
  });

  app.get("/api/admin-dashboard/donor/:id/donations", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const donations = await storage.getDonationsByUserId(Number(id));
      
      res.status(200).json({
        success: true,
        donations
      });
    } catch (error) {
      console.error("Error fetching donor donations:", error);
      res.status(500).json({
        success: false,
        error: "An error occurred while fetching donor donation history"
      });
    }
  });

  app.get("/api/admin-dashboard/donations", async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      let donations;
      
      if (startDate && endDate) {
        donations = await storage.getDonationsByDateRange(
          startDate as string, 
          endDate as string
        );
      } else {
        donations = await storage.getAllDonations();
      }
      
      res.status(200).json({
        success: true,
        donations
      });
    } catch (error) {
      console.error("Error fetching all donations:", error);
      res.status(500).json({
        success: false,
        error: "An error occurred while fetching donation records"
      });
    }
  });

  app.get("/api/admin-dashboard/stats", async (req: Request, res: Response) => {
    try {
      const donations = await storage.getAllDonations();
      const users = await storage.getAllUsers();
      
      // Calculate overall statistics
      const totalDonated = donations.reduce((sum, donation) => 
        donation.status === 'completed' ? sum + donation.amount : sum, 0);
      
      const completedDonations = donations.filter(donation => 
        donation.status === 'completed').length;
      
      const pendingDonations = donations.filter(donation => 
        donation.status === 'pending').length;
      
      const totalDonors = users.filter(user => user.role === 'user').length;
      
      // Get purpose breakdown
      const purposeBreakdown: Record<string, number> = {};
      donations.forEach(donation => {
        if (donation.status === 'completed') {
          purposeBreakdown[donation.purpose] = 
            (purposeBreakdown[donation.purpose] || 0) + donation.amount;
        }
      });
      
      res.status(200).json({
        success: true,
        stats: {
          totalDonated,
          completedDonations,
          pendingDonations,
          totalDonors,
          purposeBreakdown
        }
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({
        success: false,
        error: "An error occurred while fetching admin dashboard statistics"
      });
    }
  });
  
  // Development helper route - Make user admin
  // This would be removed in production
  app.post("/api/dev/make-admin", async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: "User ID is required"
        });
      }
      
      const user = await storage.updateUser(Number(id), { role: "admin" });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        });
      }
      
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json({
        success: true,
        user: userWithoutPassword,
        message: "User role updated to admin"
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({
        success: false,
        error: "An error occurred while updating user role"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
