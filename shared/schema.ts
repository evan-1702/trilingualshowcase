import { pgTable, text, serial, integer, boolean, timestamp, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  surface: integer("surface").notNull(),
  images: text("images").array().notNull().default([]),
  philosophy: text("philosophy").notNull(),
});

export const roomPricing = pgTable("room_pricing", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  serviceName: text("service_name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const servicePricing = pgTable("service_pricing", {
  id: serial("id").primaryKey(),
  serviceName: text("service_name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const roomSchedule = pgTable("room_schedule", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: text("status").notNull(), // "occupied" | "available" | "maintenance"
  guestInfo: text("guest_info"),
});

export const customMessages = pgTable("custom_messages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerFirstName: text("customer_first_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  roomPreference: integer("room_preference"),
  numberOfAnimals: integer("number_of_animals").notNull(),
  animals: text("animals").notNull(), // JSON string of animal details
  status: text("status").notNull().default("pending"), // "pending" | "confirmed" | "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  firstName: text("first_name").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  numberOfAnimals: integer("number_of_animals").notNull(),
  animals: text("animals").notNull(), // JSON string of animal details
  createdAt: timestamp("created_at").defaultNow(),
});

export const faqItems = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  language: text("language").notNull(), // fr, en, es
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  category: text("category").notNull(),
  tags: text("tags"), // JSON array
  language: text("language").notNull(), // fr, en, es
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
});

export const insertRoomPricingSchema = createInsertSchema(roomPricing).omit({
  id: true,
});

export const insertServicePricingSchema = createInsertSchema(servicePricing).omit({
  id: true,
});

export const insertRoomScheduleSchema = createInsertSchema(roomSchedule).omit({
  id: true,
});

export const insertCustomMessageSchema = createInsertSchema(customMessages).omit({
  id: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertFaqItemSchema = createInsertSchema(faqItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type RoomPricing = typeof roomPricing.$inferSelect;
export type InsertRoomPricing = z.infer<typeof insertRoomPricingSchema>;

export type ServicePricing = typeof servicePricing.$inferSelect;
export type InsertServicePricing = z.infer<typeof insertServicePricingSchema>;

export type RoomSchedule = typeof roomSchedule.$inferSelect;
export type InsertRoomSchedule = z.infer<typeof insertRoomScheduleSchema>;

export type CustomMessage = typeof customMessages.$inferSelect;
export type InsertCustomMessage = z.infer<typeof insertCustomMessageSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type FaqItem = typeof faqItems.$inferSelect;
export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
