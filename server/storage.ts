import { 
  users, type User, type InsertUser,
  donations, type Donation, type InsertDonation,
  type TaxDetails
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByMobile(mobile: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  updateTaxDetails(id: number, taxDetails: TaxDetails): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Donation methods
  createDonation(donation: InsertDonation, userId?: number): Promise<Donation>;
  getDonation(id: number): Promise<Donation | undefined>;
  getDonationByMobile(mobile: string): Promise<Donation[]>;
  getDonationsByUserId(userId: number): Promise<Donation[]>;
  updateDonationStatus(id: number, status: string, paymentId?: string): Promise<Donation | undefined>;
  getAllDonations(): Promise<Donation[]>;
  getDonationsByDateRange(startDate: string, endDate: string): Promise<Donation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private donationEntries: Map<number, Donation>;
  private currentUserId: number;
  private currentDonationId: number;

  constructor() {
    this.users = new Map();
    this.donationEntries = new Map();
    this.currentUserId = 1;
    this.currentDonationId = 1;
    
    // Create admin user
    this.users.set(this.currentUserId, {
      id: this.currentUserId,
      name: "Admin User",
      mobile: "9999999999",
      email: "admin@example.com",
      password: "admin123", // Plain text for demo
      role: "admin",
      documentType: null,
      documentNumber: null,
      address: null,
      street: null,
      city: null,
      state: null,
      pincode: null,
      createdAt: new Date().toISOString(),
    });
    this.currentUserId++;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByMobile(mobile: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.mobile === mobile,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date().toISOString();
    
    const user: User = {
      id,
      name: userData.name || "",
      mobile: userData.mobile || "",
      email: userData.email || "",
      password: userData.password || "",
      role: userData.role || "user",
      documentType: userData.documentType || null,
      documentNumber: userData.documentNumber || null,
      address: userData.address || null,
      street: userData.street || null,
      city: userData.city || null,
      state: userData.state || null,
      pincode: userData.pincode || null,
      createdAt: now,
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateTaxDetails(id: number, taxDetails: TaxDetails): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      documentType: taxDetails.documentType,
      documentNumber: taxDetails.documentNumber
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createDonation(insertDonation: InsertDonation, userId?: number): Promise<Donation> {
    const id = this.currentDonationId++;
    const donation: Donation = { 
      ...insertDonation, 
      id,
      userId: userId || null,
      paymentId: null, 
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.donationEntries.set(id, donation);
    return donation;
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donationEntries.get(id);
  }

  async getDonationByMobile(mobile: string): Promise<Donation[]> {
    return Array.from(this.donationEntries.values()).filter(
      (donation) => donation.mobile === mobile
    );
  }

  async getDonationsByUserId(userId: number): Promise<Donation[]> {
    return Array.from(this.donationEntries.values()).filter(
      (donation) => donation.userId === userId
    );
  }

  async updateDonationStatus(id: number, status: string, paymentId?: string): Promise<Donation | undefined> {
    const donation = this.donationEntries.get(id);
    if (donation) {
      const updatedDonation = { 
        ...donation, 
        status, 
        paymentId: paymentId || donation.paymentId 
      };
      this.donationEntries.set(id, updatedDonation);
      return updatedDonation;
    }
    return undefined;
  }

  async getAllDonations(): Promise<Donation[]> {
    return Array.from(this.donationEntries.values());
  }

  async getDonationsByDateRange(startDate: string, endDate: string): Promise<Donation[]> {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return Array.from(this.donationEntries.values()).filter(donation => {
      const donationDate = new Date(donation.createdAt).getTime();
      return donationDate >= start && donationDate <= end;
    });
  }
}

export const storage = new MemStorage();
