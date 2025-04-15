import { 
  users, type User, type InsertUser,
  donations, type Donation, type InsertDonation
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonation(id: number): Promise<Donation | undefined>;
  getDonationByMobile(mobile: string): Promise<Donation[]>;
  updateDonationStatus(id: number, status: string, paymentId?: string): Promise<Donation | undefined>;
  getAllDonations(): Promise<Donation[]>;
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
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.currentDonationId++;
    const donation: Donation = { 
      ...insertDonation, 
      id, 
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
}

export const storage = new MemStorage();
