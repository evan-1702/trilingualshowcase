import { 
  users, rooms, roomPricing, servicePricing, roomSchedule, customMessages, 
  reservations, contactMessages, faqItems, blogPosts, siteSettings,
  type User, type InsertUser, type Room, type InsertRoom,
  type RoomPricing, type InsertRoomPricing, type ServicePricing, type InsertServicePricing,
  type RoomSchedule, type InsertRoomSchedule, type CustomMessage, type InsertCustomMessage,
  type Reservation, type InsertReservation, type ContactMessage, type InsertContactMessage,
  type FaqItem, type InsertFaqItem, type BlogPost, type InsertBlogPost,
  type SiteSetting, type InsertSiteSetting
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Rooms
  getAllRooms(): Promise<Room[]>;
  getRoom(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<InsertRoom>): Promise<Room | undefined>;

  // Room Pricing
  getRoomPricing(roomId: number): Promise<RoomPricing[]>;
  createRoomPricing(pricing: InsertRoomPricing): Promise<RoomPricing>;
  updateRoomPricing(id: number, pricing: Partial<InsertRoomPricing>): Promise<RoomPricing | undefined>;
  deleteRoomPricing(id: number): Promise<boolean>;

  // Service Pricing
  getAllServicePricing(): Promise<ServicePricing[]>;
  createServicePricing(pricing: InsertServicePricing): Promise<ServicePricing>;
  updateServicePricing(id: number, pricing: Partial<InsertServicePricing>): Promise<ServicePricing | undefined>;
  deleteServicePricing(id: number): Promise<boolean>;

  // Room Schedule
  getRoomSchedule(roomId: number, startDate?: string, endDate?: string): Promise<RoomSchedule[]>;
  getAllRoomSchedules(): Promise<RoomSchedule[]>;
  createRoomSchedule(schedule: InsertRoomSchedule): Promise<RoomSchedule>;
  updateRoomSchedule(id: number, schedule: Partial<InsertRoomSchedule>): Promise<RoomSchedule | undefined>;
  deleteRoomSchedule(id: number): Promise<boolean>;

  // Custom Messages
  getActiveCustomMessages(): Promise<CustomMessage[]>;
  getAllCustomMessages(): Promise<CustomMessage[]>;
  createCustomMessage(message: InsertCustomMessage): Promise<CustomMessage>;
  updateCustomMessage(id: number, message: Partial<InsertCustomMessage>): Promise<CustomMessage | undefined>;
  deleteCustomMessage(id: number): Promise<boolean>;

  // Reservations
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  getAllReservations(): Promise<Reservation[]>;
  updateReservationStatus(id: number, status: string): Promise<Reservation | undefined>;

  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;

  // FAQ Items
  getAllFaqItems(): Promise<FaqItem[]>;
  getFaqItemsByLanguage(language: string): Promise<FaqItem[]>;
  createFaqItem(item: InsertFaqItem): Promise<FaqItem>;
  updateFaqItem(id: number, item: Partial<InsertFaqItem>): Promise<FaqItem | undefined>;
  deleteFaqItem(id: number): Promise<boolean>;

  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(language?: string): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string, language: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Site Settings
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  getAllSiteSettings(): Promise<SiteSetting[]>;
  setSiteSetting(key: string, value: string, description?: string): Promise<SiteSetting>;
  updateSiteSetting(key: string, value: string): Promise<SiteSetting | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rooms: Map<number, Room>;
  private roomPricingMap: Map<number, RoomPricing>;
  private servicePricingMap: Map<number, ServicePricing>;
  private roomScheduleMap: Map<number, RoomSchedule>;
  private customMessagesMap: Map<number, CustomMessage>;
  private reservationsMap: Map<number, Reservation>;
  private contactMessagesMap: Map<number, ContactMessage>;
  private faqItemsMap: Map<number, FaqItem>;
  private blogPostsMap: Map<number, BlogPost>;
  private siteSettingsMap: Map<string, SiteSetting>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.roomPricingMap = new Map();
    this.servicePricingMap = new Map();
    this.roomScheduleMap = new Map();
    this.customMessagesMap = new Map();
    this.reservationsMap = new Map();
    this.contactMessagesMap = new Map();
    this.faqItemsMap = new Map();
    this.blogPostsMap = new Map();
    this.siteSettingsMap = new Map();
    this.currentId = {
      users: 1,
      rooms: 1,
      roomPricing: 1,
      servicePricing: 1,
      roomSchedule: 1,
      customMessages: 1,
      reservations: 1,
      contactMessages: 1,
      faqItems: 1,
      blogPosts: 1,
      siteSettings: 1,
    };

    this.initializeData();
  }

  private initializeData() {
    // Create default admin user
    this.createUser({ username: "admin", password: "password" });

    // Create sample rooms
    const room1 = this.createRoom({
      name: "Chambre Confort",
      description: "Chambre spacieuse avec vue sur le jardin, parfaite pour les chiens de petite à moyenne taille.",
      surface: 25,
      images: ["https://images.unsplash.com/photo-1601758228041-f3b2795255f1"],
      philosophy: "Une seule famille par chambre pour garantir intimité et tranquillité."
    });

    const room2 = this.createRoom({
      name: "Suite Prestige",
      description: "Notre plus belle suite avec terrasse privée, idéale pour les grands chiens.",
      surface: 35,
      images: ["https://images.unsplash.com/photo-1548199973-03cce0bbc87b"],
      philosophy: "Espace exclusif pour le bien-être optimal de votre compagnon."
    });

    const room3 = this.createRoom({
      name: "Chambre Féline",
      description: "Spécialement aménagée pour les chats avec structures d'escalade et cachettes.",
      surface: 20,
      images: ["https://images.unsplash.com/photo-1574144611937-0df059b5ef3e"],
      philosophy: "Environnement adapté aux besoins spécifiques des félins."
    });

    const room4 = this.createRoom({
      name: "Studio Familial",
      description: "Parfait pour accueillir plusieurs animaux d'une même famille.",
      surface: 40,
      images: ["https://images.unsplash.com/photo-1552053831-71594a27632d"],
      philosophy: "Espace généreux pour maintenir les liens familiaux entre vos animaux."
    });

    // Create sample custom message
    this.createCustomMessage({
      title: "🌟 Réservations d'été ouvertes !",
      content: "Anticipez vos vacances d'été ! Réservez dès maintenant pour garantir une place à vos compagnons. Offre spéciale 'Early Booking' : -15% pour toute réservation avant le 31 mars.",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: true
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Rooms
  async getAllRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.currentId.rooms++;
    const room: Room = { 
      ...insertRoom, 
      id,
      images: insertRoom.images || []
    };
    this.rooms.set(id, room);
    return room;
  }

  async updateRoom(id: number, roomData: Partial<InsertRoom>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...roomData };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  // Room Pricing
  async getRoomPricing(roomId: number): Promise<RoomPricing[]> {
    return Array.from(this.roomPricingMap.values()).filter(pricing => pricing.roomId === roomId);
  }

  async createRoomPricing(insertPricing: InsertRoomPricing): Promise<RoomPricing> {
    const id = this.currentId.roomPricing++;
    const pricing: RoomPricing = { ...insertPricing, id };
    this.roomPricingMap.set(id, pricing);
    return pricing;
  }

  async updateRoomPricing(id: number, pricingData: Partial<InsertRoomPricing>): Promise<RoomPricing | undefined> {
    const pricing = this.roomPricingMap.get(id);
    if (!pricing) return undefined;
    
    const updatedPricing = { ...pricing, ...pricingData };
    this.roomPricingMap.set(id, updatedPricing);
    return updatedPricing;
  }

  async deleteRoomPricing(id: number): Promise<boolean> {
    return this.roomPricingMap.delete(id);
  }

  // Service Pricing
  async getAllServicePricing(): Promise<ServicePricing[]> {
    return Array.from(this.servicePricingMap.values());
  }

  async createServicePricing(insertPricing: InsertServicePricing): Promise<ServicePricing> {
    const id = this.currentId.servicePricing++;
    const pricing: ServicePricing = { 
      ...insertPricing, 
      id,
      description: insertPricing.description || null
    };
    this.servicePricingMap.set(id, pricing);
    return pricing;
  }

  async updateServicePricing(id: number, pricingData: Partial<InsertServicePricing>): Promise<ServicePricing | undefined> {
    const pricing = this.servicePricingMap.get(id);
    if (!pricing) return undefined;
    
    const updatedPricing = { ...pricing, ...pricingData };
    this.servicePricingMap.set(id, updatedPricing);
    return updatedPricing;
  }

  async deleteServicePricing(id: number): Promise<boolean> {
    return this.servicePricingMap.delete(id);
  }

  // Room Schedule
  async getRoomSchedule(roomId: number, startDate?: string, endDate?: string): Promise<RoomSchedule[]> {
    let schedules = Array.from(this.roomScheduleMap.values()).filter(schedule => schedule.roomId === roomId);
    
    if (startDate && endDate) {
      schedules = schedules.filter(schedule => 
        (schedule.startDate <= endDate && schedule.endDate >= startDate)
      );
    }
    
    return schedules;
  }

  async getAllRoomSchedules(): Promise<RoomSchedule[]> {
    return Array.from(this.roomScheduleMap.values());
  }

  async createRoomSchedule(insertSchedule: InsertRoomSchedule): Promise<RoomSchedule> {
    const id = this.currentId.roomSchedule++;
    const schedule: RoomSchedule = { 
      ...insertSchedule, 
      id,
      guestInfo: insertSchedule.guestInfo || null
    };
    this.roomScheduleMap.set(id, schedule);
    return schedule;
  }

  async updateRoomSchedule(id: number, scheduleData: Partial<InsertRoomSchedule>): Promise<RoomSchedule | undefined> {
    const schedule = this.roomScheduleMap.get(id);
    if (!schedule) return undefined;
    
    const updatedSchedule = { ...schedule, ...scheduleData };
    this.roomScheduleMap.set(id, updatedSchedule);
    return updatedSchedule;
  }

  async deleteRoomSchedule(id: number): Promise<boolean> {
    return this.roomScheduleMap.delete(id);
  }

  // Custom Messages
  async getActiveCustomMessages(): Promise<CustomMessage[]> {
    const now = new Date().toISOString().split('T')[0];
    return Array.from(this.customMessagesMap.values()).filter(message => 
      message.isActive && 
      message.startDate <= now && 
      message.endDate >= now
    );
  }

  async getAllCustomMessages(): Promise<CustomMessage[]> {
    return Array.from(this.customMessagesMap.values());
  }

  async createCustomMessage(insertMessage: InsertCustomMessage): Promise<CustomMessage> {
    const id = this.currentId.customMessages++;
    const message: CustomMessage = { 
      ...insertMessage, 
      id,
      isActive: insertMessage.isActive ?? true
    };
    this.customMessagesMap.set(id, message);
    return message;
  }

  async updateCustomMessage(id: number, messageData: Partial<InsertCustomMessage>): Promise<CustomMessage | undefined> {
    const message = this.customMessagesMap.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, ...messageData };
    this.customMessagesMap.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteCustomMessage(id: number): Promise<boolean> {
    return this.customMessagesMap.delete(id);
  }

  // Reservations
  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.currentId.reservations++;
    const reservation: Reservation = { 
      ...insertReservation, 
      id,
      roomPreference: insertReservation.roomPreference || null,
      status: "pending",
      createdAt: new Date()
    };
    this.reservationsMap.set(id, reservation);
    return reservation;
  }

  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservationsMap.values());
  }

  async updateReservationStatus(id: number, status: string): Promise<Reservation | undefined> {
    const reservation = this.reservationsMap.get(id);
    if (!reservation) return undefined;
    
    const updatedReservation = { ...reservation, status };
    this.reservationsMap.set(id, updatedReservation);
    return updatedReservation;
  }

  // Contact Messages
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentId.contactMessages++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.contactMessagesMap.set(id, message);
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessagesMap.values());
  }

  // FAQ Items methods
  async getAllFaqItems(): Promise<FaqItem[]> {
    return Array.from(this.faqItemsMap.values())
      .filter(item => item.isActive)
      .sort((a, b) => a.order - b.order);
  }

  async getFaqItemsByLanguage(language: string): Promise<FaqItem[]> {
    return Array.from(this.faqItemsMap.values())
      .filter(item => item.isActive && item.language === language)
      .sort((a, b) => a.order - b.order);
  }

  async createFaqItem(insertItem: InsertFaqItem): Promise<FaqItem> {
    const id = this.currentId.faqItems++;
    const item: FaqItem = { 
      question: insertItem.question,
      answer: insertItem.answer,
      category: insertItem.category,
      language: insertItem.language,
      order: insertItem.order ?? 0,
      isActive: insertItem.isActive ?? true,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.faqItemsMap.set(id, item);
    return item;
  }

  async updateFaqItem(id: number, itemData: Partial<InsertFaqItem>): Promise<FaqItem | undefined> {
    const existingItem = this.faqItemsMap.get(id);
    if (!existingItem) return undefined;

    const updatedItem: FaqItem = { 
      ...existingItem, 
      ...itemData,
      updatedAt: new Date()
    };
    this.faqItemsMap.set(id, updatedItem);
    return updatedItem;
  }

  async deleteFaqItem(id: number): Promise<boolean> {
    return this.faqItemsMap.delete(id);
  }

  // Blog Posts methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPostsMap.values())
      .sort((a, b) => {
        const aDate = (b.publishedAt || b.createdAt!).getTime();
        const bDate = (a.publishedAt || a.createdAt!).getTime();
        return aDate - bDate;
      });
  }

  async getPublishedBlogPosts(language?: string): Promise<BlogPost[]> {
    return Array.from(this.blogPostsMap.values())
      .filter(post => post.isPublished && (!language || post.language === language))
      .sort((a, b) => {
        const aDate = (b.publishedAt || b.createdAt!).getTime();
        const bDate = (a.publishedAt || a.createdAt!).getTime();
        return aDate - bDate;
      });
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPostsMap.get(id);
  }

  async getBlogPostBySlug(slug: string, language: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPostsMap.values())
      .find(post => post.slug === slug && post.language === language);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentId.blogPosts++;
    const post: BlogPost = { 
      title: insertPost.title,
      slug: insertPost.slug,
      excerpt: insertPost.excerpt,
      content: insertPost.content,
      featuredImage: insertPost.featuredImage || null,
      category: insertPost.category,
      tags: insertPost.tags || null,
      language: insertPost.language,
      isPublished: insertPost.isPublished ?? false,
      id,
      publishedAt: insertPost.isPublished ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.blogPostsMap.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, postData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPostsMap.get(id);
    if (!existingPost) return undefined;

    const shouldUpdatePublishedAt = postData.isPublished && !existingPost.isPublished;
    
    const updatedPost: BlogPost = { 
      ...existingPost, 
      ...postData,
      publishedAt: shouldUpdatePublishedAt ? new Date() : existingPost.publishedAt,
      updatedAt: new Date()
    };
    this.blogPostsMap.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPostsMap.delete(id);
  }

  // Site Settings methods
  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    return this.siteSettingsMap.get(key);
  }

  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return Array.from(this.siteSettingsMap.values());
  }

  async setSiteSetting(key: string, value: string, description?: string): Promise<SiteSetting> {
    const setting: SiteSetting = {
      id: this.currentId.siteSettings++,
      key,
      value,
      description: description || null,
      updatedAt: new Date()
    };
    this.siteSettingsMap.set(key, setting);
    return setting;
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSetting | undefined> {
    const existing = this.siteSettingsMap.get(key);
    if (!existing) return undefined;
    
    const updated: SiteSetting = {
      ...existing,
      value,
      updatedAt: new Date()
    };
    this.siteSettingsMap.set(key, updated);
    return updated;
  }
}

export const storage = new MemStorage();
