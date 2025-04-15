import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import type { User } from "@shared/schema";

declare global {
  namespace Express {
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

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "change-this-secret-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('user-login', new LocalStrategy(
    { usernameField: 'mobile' },
    async (mobile, _, done) => {
      try {
        const user = await storage.getUserByMobile(mobile);
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, (user as User).id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (error) {
      done(error);
    }
  });

  // Login endpoint (mobile only)
  app.post("/api/login", (req, res, next) => {
    passport.authenticate('user-login', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "User not found" });

      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  // User registration endpoint -  Needs donation integration (Not provided in edited snippet)
  app.post("/api/register", async (req, res, next) => {
    try {
      const { name, mobile, email } = req.body; // Removed password

      // Check if the mobile number already exists
      const existingUser = await storage.getUserByMobile(mobile);
      if (existingUser) {
        return res.status(400).json({ message: "Mobile number already registered" });
      }

      // Create the new user
      const user = await storage.createUser({
        name,
        mobile,
        email,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      // Login the user after registration
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json(user);
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Registration failed" });
    }
  });


  // Update tax details endpoint (Retained from original)
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

      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update tax details" });
    }
  });

  // Middleware for checking user authentication (Retained from original)
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
}