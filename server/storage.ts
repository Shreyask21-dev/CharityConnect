import { 
  users, type User, type InsertUser,
  donations, type Donation, type InsertDonation,
  type TaxDetails
} from "@shared/schema";
import mysql from 'mysql2/promise';

// MySQL connection pool
const pool = mysql.createPool({
  host: '193.203.184.44',
  user: 'u906396894_devshreyas21',
  password: 'RajendraMahendra@123',
  database: 'u906396894_charity',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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

export class MySQLStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] as User | undefined;
  }

  async getUserByMobile(mobile: string): Promise<User | undefined> {
    const [rows] = await pool.query('SELECT * FROM users WHERE mobile = ?', [mobile]);
    return rows[0] as User | undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] as User | undefined;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const now = new Date().toISOString();
    const [result] = await pool.query(
      'INSERT INTO users (name, mobile, email, role, document_type, document_number, address, street, city, state, pincode, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userData.name, userData.mobile, userData.email, userData.role || 'user', userData.documentType, userData.documentNumber, userData.address, userData.street, userData.city, userData.state, userData.pincode, now]
    );
    return { ...userData, id: result.insertId, createdAt: now } as User;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [result] = await pool.query(
      'UPDATE users SET ? WHERE id = ?',
      [userData, id]
    );
    if (result.affectedRows === 0) return undefined;
    return this.getUser(id);
  }

  async updateTaxDetails(id: number, taxDetails: TaxDetails): Promise<User | undefined> {
    const [result] = await pool.query(
      'UPDATE users SET document_type = ?, document_number = ? WHERE id = ?',
      [taxDetails.documentType, taxDetails.documentNumber, id]
    );
    if (result.affectedRows === 0) return undefined;
    return this.getUser(id);
  }

  async getAllUsers(): Promise<User[]> {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows as User[];
  }

  async createDonation(donationData: InsertDonation, userId?: number): Promise<Donation> {
    const now = new Date().toISOString();
    const [result] = await pool.query(
      'INSERT INTO donations (user_id, name, mobile, email, amount, purpose, address, street, city, state, pincode, document_type, document_number, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, donationData.name, donationData.mobile, donationData.email, donationData.amount, donationData.purpose, donationData.address, donationData.street, donationData.city, donationData.state, donationData.pincode, donationData.documentType, donationData.documentNumber, 'pending', now]
    );
    return { ...donationData, id: result.insertId, userId, status: 'pending', createdAt: now } as Donation;
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    const [rows] = await pool.query('SELECT * FROM donations WHERE id = ?', [id]);
    return rows[0] as Donation | undefined;
  }

  async getDonationByMobile(mobile: string): Promise<Donation[]> {
    const [rows] = await pool.query('SELECT * FROM donations WHERE mobile = ?', [mobile]);
    return rows as Donation[];
  }

  async getDonationsByUserId(userId: number): Promise<Donation[]> {
    const [rows] = await pool.query('SELECT * FROM donations WHERE user_id = ?', [userId]);
    return rows as Donation[];
  }

  async updateDonationStatus(id: number, status: string, paymentId?: string): Promise<Donation | undefined> {
    const [result] = await pool.query(
      'UPDATE donations SET status = ?, payment_id = ? WHERE id = ?',
      [status, paymentId, id]
    );
    if (result.affectedRows === 0) return undefined;
    return this.getDonation(id);
  }

  async getAllDonations(): Promise<Donation[]> {
    const [rows] = await pool.query('SELECT * FROM donations');
    return rows as Donation[];
  }

  async getDonationsByDateRange(startDate: string, endDate: string): Promise<Donation[]> {
    const [rows] = await pool.query(
      'SELECT * FROM donations WHERE created_at BETWEEN ? AND ?',
      [startDate, endDate]
    );
    return rows as Donation[];
  }
}

export const storage = new MySQLStorage();