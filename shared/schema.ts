import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  mobile: text("mobile").notNull().unique(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"), // 'user' or 'admin'
  documentType: text("document_type"),
  documentNumber: text("document_number"),
  address: text("address"),
  street: text("street"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  createdAt: text("created_at").notNull(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
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

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  role: true,
  createdAt: true,
});

export const loginSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const taxDetailsSchema = z.object({
  documentType: z.enum(["aadhar", "pan"]),
  documentNumber: z.string().min(1, "Document number is required"),
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  userId: true,
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
export type Login = z.infer<typeof loginSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type TaxDetails = z.infer<typeof taxDetailsSchema>;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type DonationForm = z.infer<typeof donationFormSchema>;
