import { 
  users, 
  type User, 
  type InsertUser, 
  products, 
  type Product, 
  type InsertProduct,
  clients,
  type Client,
  type InsertClient,
  sales,
  type Sale,
  type InsertSale,
  categories,
  type Category,
  type InsertCategory,
  company,
  type Company,
  type InsertCompany
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Client methods
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  updateClientStats(id: number, orderAmount: number): Promise<Client | undefined>;
  
  // Sale methods
  getSales(): Promise<Sale[]>;
  getSale(id: number): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  updateSale(id: number, sale: Partial<InsertSale>): Promise<Sale | undefined>;
  deleteSale(id: number): Promise<boolean>;
  getRecentSales(limit: number): Promise<Sale[]>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private clients: Map<number, Client>;
  private sales: Map<number, Sale>;
  private categories: Map<number, Category>;
  
  private currentUserId: number;
  private currentProductId: number;
  private currentClientId: number;
  private currentSaleId: number;
  private currentCategoryId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.clients = new Map();
    this.sales = new Map();
    this.categories = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentClientId = 1;
    this.currentSaleId = 1;
    this.currentCategoryId = 1;
    
    // Add some initial data
    this.initData();
  }

  // Initialize with sample data
  private initData() {
    // Create default categories first
    this.createCategory({
      name: "Électronique",
      description: "Appareils électroniques et gadgets",
      isActive: true
    });
    
    this.createCategory({
      name: "Vêtements",
      description: "Vêtements et accessoires de mode",
      isActive: true
    });
    
    this.createCategory({
      name: "Maison",
      description: "Articles pour la maison et décoration",
      isActive: true
    });
    
    // Create a default user
    this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "Admin User",
      role: "admin"
    });
    
    // Create some products
    this.createProduct({
      name: "Smartphone XYZ",
      description: "Latest smartphone model",
      category: "Électronique",
      price: 125000,
      quantity: 5,
      threshold: 10,
      isActive: true
    });
    
    this.createProduct({
      name: "Ordinateur portable",
      description: "Ordinateur portable haute performance",
      category: "Électronique",
      price: 450000,
      quantity: 12,
      threshold: 5,
      isActive: true
    });
    
    this.createProduct({
      name: "T-shirt Coton",
      description: "T-shirt en coton de haute qualité",
      category: "Vêtements",
      price: 8500,
      quantity: 45,
      threshold: 10,
      isActive: true
    });
    
    // Create some clients
    this.createClient({
      name: "Aminata Sanogo",
      email: "aminata@example.com",
      phone: "+22501234567",
      address: "Abidjan, Côte d'Ivoire",
      type: "regular"
    });
    
    this.createClient({
      name: "Oumar Keita",
      email: "oumar@example.com",
      phone: "+22502345678",
      address: "Bamako, Mali",
      type: "new"
    });
    
    this.createClient({
      name: "Fatima Diallo",
      email: "fatima@example.com",
      phone: "+22503456789",
      address: "Dakar, Sénégal",
      type: "vip"
    });
    
    // Update client stats
    this.updateClientStats(1, 550000);
    this.updateClientStats(2, 125000);
    this.updateClientStats(3, 1250000);
    
    // Create some sales
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    this.createSale({
      invoiceNumber: "INV-1248",
      clientId: 1,
      clientName: "Aminata Sanogo",
      status: "paid",
      total: 75000,
      items: JSON.stringify([
        { productId: 1, name: "Smartphone XYZ", price: 125000, quantity: 0.6, subtotal: 75000 }
      ]),
      notes: ""
    });
    
    this.createSale({
      invoiceNumber: "INV-1247",
      clientId: 2,
      clientName: "Oumar Keita",
      status: "pending",
      total: 42500,
      items: JSON.stringify([
        { productId: 3, name: "T-shirt Coton", price: 8500, quantity: 5, subtotal: 42500 }
      ]),
      notes: ""
    });
    
    this.createSale({
      invoiceNumber: "INV-1246",
      clientId: 3,
      clientName: "Fatima Diallo",
      status: "paid",
      total: 125000,
      items: JSON.stringify([
        { productId: 1, name: "Smartphone XYZ", price: 125000, quantity: 1, subtotal: 125000 }
      ]),
      notes: ""
    });
  }

  // User methods
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
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productUpdate };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Client methods
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }
  
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }
  
  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.currentClientId++;
    const client: Client = { 
      ...insertClient, 
      id, 
      totalOrders: 0,
      totalSpent: 0 
    };
    this.clients.set(id, client);
    return client;
  }
  
  async updateClient(id: number, clientUpdate: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...clientUpdate };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }
  
  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }
  
  async updateClientStats(id: number, orderAmount: number): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { 
      ...client, 
      totalOrders: client.totalOrders + 1,
      totalSpent: client.totalSpent + orderAmount
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }
  
  // Sale methods
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }
  
  async getSale(id: number): Promise<Sale | undefined> {
    return this.sales.get(id);
  }
  
  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = this.currentSaleId++;
    const sale: Sale = { 
      ...insertSale, 
      id,
      date: new Date()
    };
    this.sales.set(id, sale);
    
    // Update client stats if client ID is provided
    if (insertSale.clientId) {
      await this.updateClientStats(insertSale.clientId, insertSale.total);
    }
    
    // Update product quantities
    try {
      const items = JSON.parse(insertSale.items as string);
      for (const item of items) {
        const product = await this.getProduct(item.productId);
        if (product) {
          await this.updateProduct(product.id, {
            quantity: product.quantity - item.quantity
          });
        }
      }
    } catch (error) {
      console.error("Error parsing items JSON:", error);
    }
    
    return sale;
  }
  
  async updateSale(id: number, saleUpdate: Partial<InsertSale>): Promise<Sale | undefined> {
    const sale = this.sales.get(id);
    if (!sale) return undefined;
    
    const updatedSale = { ...sale, ...saleUpdate };
    this.sales.set(id, updatedSale);
    return updatedSale;
  }
  
  async deleteSale(id: number): Promise<boolean> {
    return this.sales.delete(id);
  }
  
  async getRecentSales(limit: number): Promise<Sale[]> {
    const allSales = Array.from(this.sales.values());
    return allSales
      .sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(category => category.isActive);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      createdAt: new Date()
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;

    const updatedCategory: Category = { ...existingCategory, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
}

export const storage = new MemStorage();
