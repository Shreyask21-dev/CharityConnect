import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { donationFormSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
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
      
      // Create the donation in storage
      const donation = await storage.createDonation({
        ...donationData,
        createdAt: new Date().toISOString(),
      });
      
      // In a real implementation, this would trigger the payment gateway
      // For now, we'll just return the donation data with a success status
      
      res.status(201).json({ 
        success: true, 
        donation,
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

  // Get donation history by mobile number
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

  const httpServer = createServer(app);

  return httpServer;
}
