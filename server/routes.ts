import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertClientSchema, 
  insertSaleSchema,
  insertCategorySchema,
  insertCompanySchema,
  saleItemsSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API routes
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving product" });
    }
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });

  app.patch("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const validatedData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(id, validatedData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error updating product" });
    }
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  });

  // Clients API routes
  app.get("/api/clients", async (req: Request, res: Response) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving clients" });
    }
  });

  app.get("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid client ID" });
      }
      
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving client" });
    }
  });

  app.post("/api/clients", async (req: Request, res: Response) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating client" });
    }
  });

  app.patch("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid client ID" });
      }
      
      const validatedData = insertClientSchema.partial().parse(req.body);
      const updatedClient = await storage.updateClient(id, validatedData);
      
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(updatedClient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error updating client" });
    }
  });

  app.delete("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid client ID" });
      }
      
      const success = await storage.deleteClient(id);
      if (!success) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting client" });
    }
  });

  // Sales API routes
  app.get("/api/sales", async (req: Request, res: Response) => {
    try {
      const sales = await storage.getSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving sales" });
    }
  });

  app.get("/api/sales/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid sale ID" });
      }
      
      const sale = await storage.getSale(id);
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      
      res.json(sale);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving sale" });
    }
  });

  app.post("/api/sales", async (req: Request, res: Response) => {
    try {
      // Validate the items array first
      const itemsArray = JSON.parse(req.body.items);
      saleItemsSchema.parse(itemsArray);
      
      // Then validate the full sale object
      const validatedData = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale(validatedData);
      res.status(201).json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      if (error instanceof SyntaxError) {
        return res.status(400).json({ message: "Invalid JSON for items" });
      }
      res.status(500).json({ message: "Error creating sale" });
    }
  });

  app.patch("/api/sales/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid sale ID" });
      }
      
      // Check if items is being updated and validate it
      if (req.body.items) {
        const itemsArray = JSON.parse(req.body.items);
        saleItemsSchema.parse(itemsArray);
      }
      
      const validatedData = insertSaleSchema.partial().parse(req.body);
      const updatedSale = await storage.updateSale(id, validatedData);
      
      if (!updatedSale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      
      res.json(updatedSale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      if (error instanceof SyntaxError) {
        return res.status(400).json({ message: "Invalid JSON for items" });
      }
      res.status(500).json({ message: "Error updating sale" });
    }
  });

  app.delete("/api/sales/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid sale ID" });
      }
      
      const success = await storage.deleteSale(id);
      if (!success) {
        return res.status(404).json({ message: "Sale not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting sale" });
    }
  });

  // Categories API routes
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving categories" });
    }
  });

  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving category" });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating category" });
    }
  });

  app.patch("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const categoryUpdate = insertCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateCategory(id, categoryUpdate);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error updating category" });
    }
  });

  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting category" });
    }
  });
  
  // Company setup routes
  app.post("/api/company/setup", async (req: Request, res: Response) => {
    try {
      const companyData = req.body;
      const company = await storage.createCompany(companyData);
      res.json(company);
    } catch (error) {
      console.error("Company setup error:", error);
      res.status(500).json({ error: "Failed to setup company" });
    }
  });

  app.get("/api/company/status", async (req: Request, res: Response) => {
    try {
      const isSetup = await storage.isCompanySetup();
      const company = await storage.getCompany();
      res.json({ isSetup, company });
    } catch (error) {
      console.error("Company status error:", error);
      res.status(500).json({ error: "Failed to check company status" });
    }
  });

  app.get("/api/company", async (req: Request, res: Response) => {
    try {
      const company = await storage.getCompany();
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Company error:", error);
      res.status(500).json({ error: "Failed to get company info" });
    }
  });

  app.patch("/api/company/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
      
      const companyUpdate = insertCompanySchema.partial().parse(req.body);
      const updatedCompany = await storage.updateCompany(id, companyUpdate);
      
      if (!updatedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(updatedCompany);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error updating company" });
    }
  });

  // Dashboard data API routes
  app.get("/api/dashboard", async (req: Request, res: Response) => {
    try {
      // Check if company is set up
      const isSetup = await storage.isCompanySetup();
      if (!isSetup) {
        return res.status(400).json({ error: "Company setup required" });
      }

      const products = await storage.getProducts();
      const clients = await storage.getClients();
      const sales = await storage.getSales();
      const recentSales = await storage.getRecentSales(3);
      
      // Calculate total sales
      const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
      
      // Calculate low stock products
      const lowStockProducts = products.filter(
        (p) => p.quantity <= (p.threshold || 5)
      ).length;
      
      // Calculate daily sales for the week
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        return date;
      }).reverse();
      
      const dailySales = last7Days.map(date => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        const filtered = sales.filter(sale => {
          const saleDate = sale.date instanceof Date ? 
            sale.date : new Date(sale.date);
          return saleDate >= date && saleDate < nextDay;
        });
        
        return {
          day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
          amount: filtered.reduce((sum, sale) => sum + sale.total, 0)
        };
      });
      
      res.json({
        metrics: {
          sales: {
            total: totalSales,
            trend: "+12%" // This would be calculated in a real app
          },
          orders: {
            total: sales.length,
            trend: "+8%" // This would be calculated in a real app
          },
          clients: {
            total: clients.length,
            trend: "+3%" // This would be calculated in a real app
          },
          inventory: {
            lowStock: lowStockProducts,
            trend: lowStockProducts > 0 ? `+${lowStockProducts}` : "0"
          }
        },
        dailySales,
        recentActivities: recentSales.map(sale => ({
          id: sale.id,
          type: sale.status === "paid" ? "sale" : "pending-sale",
          description: `Vente #${sale.invoiceNumber} - ${sale.total.toLocaleString('fr-FR')} FCFA`,
          client: sale.clientName,
          date: sale.date,
          amount: sale.total
        }))
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
