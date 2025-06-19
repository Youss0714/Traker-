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
import { db } from "./db";
import { IStorage } from "./storage";
import { eq, desc } from "drizzle-orm";

export class DBStorage implements IStorage {
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products)
      .set(productUpdate)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }
  
  // Client methods
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }
  
  async getClient(id: number): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id));
    return result[0];
  }
  
  async createClient(insertClient: InsertClient): Promise<Client> {
    const clientWithDefaults = {
      ...insertClient,
      totalOrders: 0,
      totalSpent: 0
    };
    const result = await db.insert(clients).values(clientWithDefaults).returning();
    return result[0];
  }
  
  async updateClient(id: number, clientUpdate: Partial<InsertClient>): Promise<Client | undefined> {
    const result = await db.update(clients)
      .set(clientUpdate)
      .where(eq(clients.id, id))
      .returning();
    return result[0];
  }
  
  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return (result.rowCount || 0) > 0;
  }
  
  async updateClientStats(id: number, orderAmount: number): Promise<Client | undefined> {
    // Récupérer le client actuel
    const client = await this.getClient(id);
    if (!client) return undefined;
    
    // Calculer les nouvelles valeurs avec TVA de 18%
    const totalOrders = (client.totalOrders || 0) + 1;
    const orderAmountWithTax = orderAmount * 1.18; // Ajouter 18% de TVA
    const totalSpent = (client.totalSpent || 0) + orderAmountWithTax;
    
    // Mettre à jour le client
    const result = await db.update(clients)
      .set({ totalOrders, totalSpent })
      .where(eq(clients.id, id))
      .returning();
    return result[0];
  }
  
  // Sale methods
  async getSales(): Promise<Sale[]> {
    return await db.select().from(sales);
  }
  
  async getSale(id: number): Promise<Sale | undefined> {
    const result = await db.select().from(sales).where(eq(sales.id, id));
    return result[0];
  }
  
  async createSale(insertSale: InsertSale): Promise<Sale> {
    const saleWithDefaults = {
      ...insertSale,
      date: new Date()
    };
    const result = await db.insert(sales).values(saleWithDefaults).returning();
    const createdSale = result[0];
    
    // Mettre à jour les stats du client si l'ID du client est fourni
    if (insertSale.clientId) {
      await this.updateClientStats(insertSale.clientId, insertSale.total);
    }
    
    // Mettre à jour les quantités de produits
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
    
    return createdSale;
  }
  
  async updateSale(id: number, saleUpdate: Partial<InsertSale>): Promise<Sale | undefined> {
    const result = await db.update(sales)
      .set(saleUpdate)
      .where(eq(sales.id, id))
      .returning();
    return result[0];
  }
  
  async deleteSale(id: number): Promise<boolean> {
    const result = await db.delete(sales).where(eq(sales.id, id));
    return (result.rowCount || 0) > 0;
  }
  
  async getRecentSales(limit: number): Promise<Sale[]> {
    return await db.select()
      .from(sales)
      .orderBy(desc(sales.date))
      .limit(limit);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await db.insert(categories)
      .values({
        ...insertCategory,
        createdAt: new Date()
      })
      .returning();
    return result[0];
  }

  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories)
      .set(categoryUpdate)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Méthode d'initialisation pour créer des données d'exemple
  async initData(): Promise<void> {
    // Vérifier si des données existent déjà
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("Data already initialized");
      return;
    }

    // Créer un utilisateur par défaut
    await this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "Admin User",
      role: "admin"
    });
    
    // Créer quelques produits
    const product1 = await this.createProduct({
      name: "Smartphone XYZ",
      description: "Latest smartphone model",
      category: "Électronique",
      price: 125000,
      quantity: 5,
      threshold: 10,
      isActive: true
    });
    
    const product2 = await this.createProduct({
      name: "Ordinateur portable",
      description: "Ordinateur portable haute performance",
      category: "Électronique",
      price: 450000,
      quantity: 12,
      threshold: 5,
      isActive: true
    });
    
    const product3 = await this.createProduct({
      name: "T-shirt Coton",
      description: "T-shirt en coton de haute qualité",
      category: "Vêtements",
      price: 8500,
      quantity: 45,
      threshold: 10,
      isActive: true
    });
    
    // Créer quelques clients
    const client1 = await this.createClient({
      name: "Aminata Sanogo",
      email: "aminata@example.com",
      phone: "+22501234567",
      address: "Abidjan, Côte d'Ivoire",
      type: "regular"
    });
    
    const client2 = await this.createClient({
      name: "Oumar Keita",
      email: "oumar@example.com",
      phone: "+22502345678",
      address: "Bamako, Mali",
      type: "new"
    });
    
    const client3 = await this.createClient({
      name: "Fatima Diallo",
      email: "fatima@example.com",
      phone: "+22503456789",
      address: "Dakar, Sénégal",
      type: "vip"
    });
    
    // Mettre à jour les statistiques des clients
    await this.updateClientStats(client1.id, 550000);
    await this.updateClientStats(client2.id, 125000);
    await this.updateClientStats(client3.id, 1250000);
    
    // Créer quelques ventes
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    await this.createSale({
      invoiceNumber: "INV-1248",
      clientId: client1.id,
      clientName: client1.name,
      status: "paid",
      total: 75000,
      items: JSON.stringify([
        { productId: product1.id, name: product1.name, price: product1.price, quantity: 0.6, subtotal: 75000 }
      ]),
      notes: ""
    });
    
    await this.createSale({
      invoiceNumber: "INV-1247",
      clientId: client2.id,
      clientName: client2.name,
      status: "pending",
      total: 42500,
      items: JSON.stringify([
        { productId: product3.id, name: product3.name, price: product3.price, quantity: 5, subtotal: 42500 }
      ]),
      notes: ""
    });
    
    await this.createSale({
      invoiceNumber: "INV-1246",
      clientId: client3.id,
      clientName: client3.name,
      status: "paid",
      total: 125000,
      items: JSON.stringify([
        { productId: product1.id, name: product1.name, price: product1.price, quantity: 1, subtotal: 125000 }
      ]),
      notes: ""
    });
  }

  // Invoice methods
  async getInvoices(): Promise<Invoice[]> {
    const result = await db.select().from(invoices).orderBy(desc(invoices.createdAt));
    return result;
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(eq(invoices.id, id));
    return result[0];
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(eq(invoices.invoiceNumber, invoiceNumber));
    return result[0];
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(invoices).values(insertInvoice).returning();
    return result[0];
  }

  async updateInvoice(id: number, invoiceUpdate: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const result = await db.update(invoices)
      .set({ ...invoiceUpdate, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return result[0];
  }

  async deleteInvoice(id: number): Promise<boolean> {
    const result = await db.delete(invoices).where(eq(invoices.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getInvoicesByStatus(status: string): Promise<Invoice[]> {
    const result = await db.select().from(invoices)
      .where(eq(invoices.status, status))
      .orderBy(desc(invoices.createdAt));
    return result;
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    const result = await db.select().from(invoices)
      .where(eq(invoices.status, 'sent'))
      .orderBy(desc(invoices.createdAt));
    
    // Filter overdue invoices on the application side
    const now = new Date();
    return result.filter(invoice => new Date(invoice.dueDate) < now);
  }

  // Company methods (existing implementation would be here)
  async getCompany(): Promise<Company | undefined> {
    const result = await db.select().from(company).limit(1);
    return result[0];
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const result = await db.insert(company).values({
      ...insertCompany,
      isSetup: true
    }).returning();
    return result[0];
  }

  async updateCompany(id: number, companyUpdate: Partial<InsertCompany>): Promise<Company | undefined> {
    const result = await db.update(company)
      .set(companyUpdate)
      .where(eq(company.id, id))
      .returning();
    return result[0];
  }

  async isCompanySetup(): Promise<boolean> {
    const result = await db.select().from(company).where(eq(company.isSetup, true)).limit(1);
    return result.length > 0;
  }
}

export const dbStorage = new DBStorage();