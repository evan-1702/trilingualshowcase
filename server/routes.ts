import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendReservationConfirmationEmail } from "./email";
import { 
  insertReservationSchema, insertContactMessageSchema,
  insertRoomPricingSchema, insertServicePricingSchema,
  insertRoomScheduleSchema, insertCustomMessageSchema,
  insertFaqItemSchema, insertBlogPostSchema, insertSiteSettingSchema
} from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Public API routes
  
  // Get all rooms
  app.get("/api/rooms", async (req, res) => {
    try {
      const rooms = await storage.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  // Get room pricing
  app.get("/api/rooms/:id/pricing", async (req, res) => {
    try {
      const roomId = parseInt(req.params.id);
      const pricing = await storage.getRoomPricing(roomId);
      res.json(pricing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch room pricing" });
    }
  });

  // Get service pricing
  app.get("/api/service-pricing", async (req, res) => {
    try {
      const pricing = await storage.getAllServicePricing();
      res.json(pricing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service pricing" });
    }
  });

  // Get room schedule
  app.get("/api/rooms/:id/schedule", async (req, res) => {
    try {
      const roomId = parseInt(req.params.id);
      const { startDate, endDate } = req.query;
      const schedule = await storage.getRoomSchedule(
        roomId, 
        startDate as string, 
        endDate as string
      );
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch room schedule" });
    }
  });

  // Get active custom messages
  app.get("/api/custom-messages", async (req, res) => {
    try {
      const messages = await storage.getActiveCustomMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch custom messages" });
    }
  });

  // Check room availability
  app.post("/api/check-availability", async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const rooms = await storage.getAllRooms();
      const availableRooms = [];

      for (const room of rooms) {
        const schedules = await storage.getRoomSchedule(room.id, startDate, endDate);
        const isOccupied = schedules.some(schedule => schedule.status === "occupied");
        
        if (!isOccupied) {
          availableRooms.push(room);
        }
      }

      res.json(availableRooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  // Create reservation
  app.post("/api/reservations", async (req, res) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      
      // Check if room is available
      const schedules = await storage.getRoomSchedule(
        validatedData.roomPreference!, 
        validatedData.startDate, 
        validatedData.endDate
      );
      
      const isOccupied = schedules.some(schedule => schedule.status === "occupied");
      if (isOccupied) {
        return res.status(400).json({ message: "Room is not available for selected dates" });
      }

      const reservation = await storage.createReservation(validatedData);
      
      // Create room schedule entry
      if (validatedData.roomPreference) {
        await storage.createRoomSchedule({
          roomId: validatedData.roomPreference,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
          status: "occupied",
          guestInfo: `${validatedData.customerFirstName} ${validatedData.customerName}`
        });
      }

      // Send confirmation emails
      try {
        const siteEmailSetting = await storage.getSiteSetting("site_email");
        const siteEmail = siteEmailSetting?.value || "contact@petparadise.com";
        
        await sendReservationConfirmationEmail(reservation, siteEmail);
        console.log('Reservation confirmation emails sent successfully');
      } catch (emailError) {
        console.error('Failed to send reservation emails:', emailError);
        // Don't fail the reservation if email fails
      }

      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create reservation" });
      }
    }
  });

  // Create contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd use proper session management
      res.json({ message: "Login successful", userId: user.id });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Admin routes (in a real app, these would be protected by authentication middleware)
  
  // Room pricing management
  app.get("/api/admin/room-pricing", async (req, res) => {
    try {
      const rooms = await storage.getAllRooms();
      const roomsWithPricing = await Promise.all(
        rooms.map(async (room) => {
          const pricing = await storage.getRoomPricing(room.id);
          return { ...room, pricing };
        })
      );
      res.json(roomsWithPricing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch room pricing" });
    }
  });

  app.post("/api/admin/room-pricing", async (req, res) => {
    try {
      const validatedData = insertRoomPricingSchema.parse(req.body);
      const pricing = await storage.createRoomPricing(validatedData);
      res.status(201).json(pricing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create room pricing" });
      }
    }
  });

  app.put("/api/admin/room-pricing/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRoomPricingSchema.partial().parse(req.body);
      const pricing = await storage.updateRoomPricing(id, validatedData);
      
      if (!pricing) {
        return res.status(404).json({ message: "Room pricing not found" });
      }
      
      res.json(pricing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update room pricing" });
      }
    }
  });

  app.delete("/api/admin/room-pricing/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteRoomPricing(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Room pricing not found" });
      }
      
      res.json({ message: "Room pricing deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete room pricing" });
    }
  });

  // Service pricing management
  app.get("/api/admin/service-pricing", async (req, res) => {
    try {
      const pricing = await storage.getAllServicePricing();
      res.json(pricing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service pricing" });
    }
  });

  app.post("/api/admin/service-pricing", async (req, res) => {
    try {
      const validatedData = insertServicePricingSchema.parse(req.body);
      const pricing = await storage.createServicePricing(validatedData);
      res.status(201).json(pricing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create service pricing" });
      }
    }
  });

  app.put("/api/admin/service-pricing/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertServicePricingSchema.partial().parse(req.body);
      const pricing = await storage.updateServicePricing(id, validatedData);
      
      if (!pricing) {
        return res.status(404).json({ message: "Service pricing not found" });
      }
      
      res.json(pricing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update service pricing" });
      }
    }
  });

  app.delete("/api/admin/service-pricing/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteServicePricing(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Service pricing not found" });
      }
      
      res.json({ message: "Service pricing deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service pricing" });
    }
  });

  // Schedule management
  app.get("/api/admin/schedule", async (req, res) => {
    try {
      const schedules = await storage.getAllRoomSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  app.post("/api/admin/schedule", async (req, res) => {
    try {
      const validatedData = insertRoomScheduleSchema.parse(req.body);
      const schedule = await storage.createRoomSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create schedule" });
      }
    }
  });

  app.put("/api/admin/schedule/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRoomScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateRoomSchedule(id, validatedData);
      
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      
      res.json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update schedule" });
      }
    }
  });

  app.delete("/api/admin/schedule/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteRoomSchedule(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      
      res.json({ message: "Schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete schedule" });
    }
  });

  // Custom messages management
  app.get("/api/admin/custom-messages", async (req, res) => {
    try {
      const messages = await storage.getAllCustomMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch custom messages" });
    }
  });

  app.post("/api/admin/custom-messages", async (req, res) => {
    try {
      const validatedData = insertCustomMessageSchema.parse(req.body);
      const message = await storage.createCustomMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create custom message" });
      }
    }
  });

  app.put("/api/admin/custom-messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCustomMessageSchema.partial().parse(req.body);
      const message = await storage.updateCustomMessage(id, validatedData);
      
      if (!message) {
        return res.status(404).json({ message: "Custom message not found" });
      }
      
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update custom message" });
      }
    }
  });

  app.delete("/api/admin/custom-messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCustomMessage(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Custom message not found" });
      }
      
      res.json({ message: "Custom message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete custom message" });
    }
  });

  // Get all reservations (admin)
  app.get("/api/admin/reservations", async (req, res) => {
    try {
      const reservations = await storage.getAllReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  // Get all contact messages (admin)
  app.get("/api/admin/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  // FAQ Items routes
  app.get("/api/faq", async (req, res) => {
    try {
      const language = req.query.language as string;
      let faqItems;
      
      if (language) {
        faqItems = await storage.getFaqItemsByLanguage(language);
      } else {
        faqItems = await storage.getAllFaqItems();
      }
      
      res.json(faqItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQ items" });
    }
  });

  app.get("/api/admin/faq", async (req, res) => {
    try {
      const faqItems = await storage.getAllFaqItems();
      res.json(faqItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQ items" });
    }
  });

  app.post("/api/admin/faq", async (req, res) => {
    try {
      const validatedData = insertFaqItemSchema.parse(req.body);
      const faqItem = await storage.createFaqItem(validatedData);
      res.status(201).json(faqItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create FAQ item" });
      }
    }
  });

  app.put("/api/admin/faq/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertFaqItemSchema.partial().parse(req.body);
      const faqItem = await storage.updateFaqItem(id, validatedData);
      
      if (!faqItem) {
        return res.status(404).json({ message: "FAQ item not found" });
      }
      
      res.json(faqItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update FAQ item" });
      }
    }
  });

  app.delete("/api/admin/faq/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFaqItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "FAQ item not found" });
      }
      
      res.json({ message: "FAQ item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete FAQ item" });
    }
  });

  // Blog Posts routes
  app.get("/api/blog", async (req, res) => {
    try {
      const language = req.query.language as string;
      const blogPosts = await storage.getPublishedBlogPosts(language);
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const language = req.query.language as string || 'fr';
      const blogPost = await storage.getBlogPostBySlug(slug, language);
      
      if (!blogPost || !blogPost.isPublished) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/admin/blog", async (req, res) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/admin/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const blogPost = await storage.getBlogPost(id);
      
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/admin/blog", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(validatedData);
      res.status(201).json(blogPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });

  app.put("/api/admin/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const blogPost = await storage.updateBlogPost(id, validatedData);
      
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(blogPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });

  app.delete("/api/admin/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Reservation status update
  app.patch("/api/admin/reservations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const reservation = await storage.updateReservationStatus(id, status);
      
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update reservation status" });
    }
  });

  // Site settings management
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  app.put("/api/admin/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      
      if (!value || typeof value !== 'string') {
        return res.status(400).json({ message: "Value is required and must be a string" });
      }
      
      let setting = await storage.getSiteSetting(key);
      
      if (setting) {
        setting = await storage.updateSiteSetting(key, value);
      } else {
        setting = await storage.setSiteSetting(key, value);
      }
      
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to update site setting" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
