import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email").notNull(),
  amount: integer("amount").notNull(),
  purpose: text("purpose").notNull(),
  address: text("address").notNull(),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  documentType: text("document_type").notNull(),
  documentNumber: text("document_number").notNull(),
  paymentId: text("payment_id"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  paymentId: true,
  status: true,
  createdAt: true,
});

export const donationFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  amount: z.number().min(100, "Minimum donation amount is ₹100"),
  purpose: z.string().min(1, "Purpose is required"),
  address: z.string().min(1, "Address is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 characters"),
  documentType: z.enum(["aadhar", "pan"]),
  documentNumber: z.string().min(1, "Document number is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type DonationForm = z.infer<typeof donationFormSchema>;
