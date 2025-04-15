import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { User, Register, Login, AdminLogin } from "@shared/schema";

declare global {
  namespace Express {
    // Define User interface to extend with our User type
    interface User {
      id: number;
      name: string;
      mobile: string;
      email: string;
      role: string;
      documentType: string | null;
      documentNumber: string | null;
      address: string | null;
      street: string | null;
      city: string | null;
      state: string | null;
      pincode: string | null;
      createdAt: string;
    }
  }
}

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Helper function to compare passwords
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  return bcrypt.compare(supplied, stored);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "change-this-secret-in-production", // Use for demo only
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup user login strategy (using mobile number)
  passport.use('user-login', new LocalStrategy(
    { usernameField: 'mobile', passwordField: 'password' },
    async (mobile, password, done) => {
      try {
        const user = await storage.getUserByMobile(mobile);
        if (!user) {
          return done(null, false, { message: 'Invalid mobile number or password' });
        }
        
        if (user.role !== 'user') {
          return done(null, false, { message: 'Invalid login credentials' });
        }
        
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Invalid mobile number or password' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Setup admin login strategy (using email)
  passport.use('admin-login', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        
        if (user.role !== 'admin') {
          return done(null, false, { message: 'Invalid login credentials' });
        }
        
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (error) {
      done(error);
    }
  });

  // User registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      const { name, mobile, email, password } = req.body;
      
      // Check if the mobile number already exists
      const existingUser = await storage.getUserByMobile(mobile);
      if (existingUser) {
        return res.status(400).json({ message: "Mobile number already registered" });
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create the new user
      const user = await storage.createUser({
        name,
        mobile,
        email,
        password: hashedPassword,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      // Remove sensitive data
      const { password: _, ...userWithoutPassword } = user;

      // Login the user after registration
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Registration failed" });
    }
  });

  // User login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate('user-login', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Login failed" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Remove sensitive data
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Admin login endpoint
  app.post("/api/admin/login", (req, res, next) => {
    passport.authenticate('admin-login', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Login failed" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Remove sensitive data
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Remove sensitive data
    const { password, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });

  // Update tax details endpoint
  app.post("/api/user/tax-details", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { documentType, documentNumber } = req.body;
      const user = req.user as User;
      
      const updatedUser = await storage.updateTaxDetails(user.id, {
        documentType,
        documentNumber
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive data
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update tax details" });
    }
  });
  
  // Middleware for checking user authentication
  app.use("/api/user-dashboard", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as User;
    if (user.role !== "user") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    next();
  });
  
  // Middleware for checking admin authentication
  app.use("/api/admin-dashboard", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as User;
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    next();
  });
}