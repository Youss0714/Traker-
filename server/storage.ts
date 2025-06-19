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
  type InsertCompany,
  invoices,
  type Invoice,
  type InsertInvoice
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
  
  // Company methods
  getCompany(): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined>;
  isCompanySetup(): Promise<boolean>;
  
  // Invoice methods
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;
  getInvoicesByStatus(status: string): Promise<Invoice[]>;
  getOverdueInvoices(): Promise<Invoice[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private clients: Map<number, Client>;
  private sales: Map<number, Sale>;
  private categories: Map<number, Category>;
  private companyData: Company | null;
  
  private currentUserId: number;
  private currentProductId: number;
  private currentClientId: number;
  private currentSaleId: number;
  private currentCategoryId: number;
  private currentCompanyId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.clients = new Map();
    this.sales = new Map();
    this.categories = new Map();
    this.companyData = null;
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentClientId = 1;
    this.currentSaleId = 1;
    this.currentCategoryId = 1;
    this.currentCompanyId = 1;
    
    // Add some initial data
    this.initData();
  }

  // Initialize with sample data
  private initData() {
    // Create default categories first
    this.createCategory({
      name: "Textile et Mode",
      description: "Pagnes, tissus wax, vêtements traditionnels",
      isActive: true
    });
    
    this.createCategory({
      name: "Produits Agricoles",
      description: "Cacao, café, igname, plantain, riz local",
      isActive: true
    });
    
    this.createCategory({
      name: "Artisanat Local",
      description: "Sculptures, masques, bijoux traditionnels",
      isActive: true
    });
    
    this.createCategory({
      name: "Alimentation",
      description: "Attiéké, foutou, huile de palme, épices",
      isActive: true
    });
    
    // Create some products
    this.createProduct({
      name: "Pagne Wax Vlisco",
      description: "Tissu wax authentique de haute qualité, 6 yards",
      category: "Textile et Mode",
      price: 25000,
      quantity: 45,
      threshold: 10,
      isActive: true
    });
    
    this.createProduct({
      name: "Cacao en Fèves - Qualité Premium",
      description: "Fèves de cacao de Côte d'Ivoire, première qualité",
      category: "Produits Agricoles",
      price: 1500,
      quantity: 250,
      threshold: 50,
      isActive: true
    });
    
    this.createProduct({
      name: "Masque Baoulé Traditionnel",
      description: "Masque sculpté authentique de la tradition Baoulé",
      category: "Artisanat Local",
      price: 85000,
      quantity: 8,
      threshold: 3,
      isActive: true
    });
    
    this.createProduct({
      name: "Attiéké Premium",
      description: "Semoule de manioc traditionnel de Côte d'Ivoire, 1kg",
      category: "Alimentation",
      price: 1200,
      quantity: 180,
      threshold: 30,
      isActive: true
    });
    
    this.createProduct({
      name: "Huile de Palme Rouge",
      description: "Huile de palme rouge artisanale, bidon 5L",
      category: "Alimentation",
      price: 8500,
      quantity: 65,
      threshold: 15,
      isActive: true
    });
    
    this.createProduct({
      name: "Café Robusta Daloa",
      description: "Café robusta de la région de Daloa, sac 1kg",
      category: "Produits Agricoles",
      price: 3500,
      quantity: 95,
      threshold: 20,
      isActive: true
    });
    
    // Create some clients
    this.createClient({
      name: "Kouamé Yao",
      email: "kouame.yao@gmail.com",
      phone: "+225 07 45 78 32",
      address: "Cocody Angré, Abidjan",
      type: "regular"
    });
    
    this.createClient({
      name: "Adjoua Konan",
      email: "adjoua.konan@yahoo.fr",
      phone: "+225 05 89 12 45",
      address: "Marcory Zone 4, Abidjan",
      type: "vip"
    });
    
    this.createClient({
      name: "Bakayoko Ibrahim",
      email: "ibrahim.bakayoko@hotmail.com",
      phone: "+225 01 67 34 89",
      address: "Bouaké Centre, Région du Gbêkê",
      type: "regular"
    });
    
    this.createClient({
      name: "Gnagbo Marie",
      email: "marie.gnagbo@orange.ci",
      phone: "+225 09 23 56 71",
      address: "San Pedro, Région du Bas-Sassandra",
      type: "new"
    });
    
    // Update client stats
    this.updateClientStats(1, 155000);
    this.updateClientStats(2, 285000);
    this.updateClientStats(3, 75000);
    this.updateClientStats(4, 42000);
    
    // Create some sales
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    this.createSale({
      invoiceNumber: "INV-2024-001",
      clientId: 1,
      clientName: "Kouamé Yao",
      status: "paid",
      total: 160000,
      items: JSON.stringify([
        { productId: 1, name: "Pagne Wax Vlisco", price: 25000, quantity: 3, subtotal: 75000 },
        { productId: 3, name: "Masque Baoulé Traditionnel", price: 85000, quantity: 1, subtotal: 85000 }
      ]),
      notes: "Livraison à Cocody"
    });
    
    this.createSale({
      invoiceNumber: "INV-2024-002",
      clientId: 2,
      clientName: "Adjoua Konan",
      status: "paid",
      total: 193500,
      items: JSON.stringify([
        { productId: 1, name: "Pagne Wax Vlisco", price: 25000, quantity: 4, subtotal: 100000 },
        { productId: 3, name: "Masque Baoulé Traditionnel", price: 85000, quantity: 1, subtotal: 85000 },
        { productId: 5, name: "Huile de Palme Rouge", price: 8500, quantity: 1, subtotal: 8500 }
      ]),
      notes: ""
    });
    
    this.createSale({
      invoiceNumber: "INV-2024-003",
      clientId: 3,
      clientName: "Bakayoko Ibrahim",
      status: "paid",
      total: 75000,
      items: JSON.stringify([
        { productId: 2, name: "Cacao en Fèves - Qualité Premium", price: 1500, quantity: 50, subtotal: 75000 }
      ]),
      notes: "Commande de cacao pour export"
    });
    
    this.createSale({
      invoiceNumber: "INV-2024-004",
      clientId: 4,
      clientName: "Gnagbo Marie",
      status: "pending",
      total: 41000,
      items: JSON.stringify([
        { productId: 4, name: "Attiéké Premium", price: 1200, quantity: 20, subtotal: 24000 },
        { productId: 5, name: "Huile de Palme Rouge", price: 8500, quantity: 2, subtotal: 17000 }
      ]),
      notes: "Livraison à San Pedro"
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
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "user"
    };
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
    const product: Product = { 
      ...insertProduct, 
      id,
      description: insertProduct.description || null,
      quantity: insertProduct.quantity || 0,
      threshold: insertProduct.threshold || null,
      isActive: insertProduct.isActive || null
    };
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

  // Company methods
  async getCompany(): Promise<Company | undefined> {
    return this.companyData || undefined;
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentCompanyId++;
    const company: Company = { 
      ...insertCompany, 
      id,
      isSetup: true,
      createdAt: new Date()
    };
    this.companyData = company;
    return company;
  }

  async updateCompany(id: number, companyUpdate: Partial<InsertCompany>): Promise<Company | undefined> {
    if (!this.companyData || this.companyData.id !== id) return undefined;

    const updatedCompany: Company = { ...this.companyData, ...companyUpdate };
    this.companyData = updatedCompany;
    return updatedCompany;
  }

  async isCompanySetup(): Promise<boolean> {
    return this.companyData?.isSetup || false;
  }
}

export const storage = new MemStorage();
