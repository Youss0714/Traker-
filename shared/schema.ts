import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

// Company schema
export const company = pgTable("company", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  logoUrl: text("logo_url"),
  slogan: text("slogan"),
  description: text("description"),
  isSetup: boolean("is_setup").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompanySchema = createInsertSchema(company).omit({
  id: true,
  createdAt: true,
});

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

// Products schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  price: doublePrecision("price").notNull(),
  quantity: integer("quantity").notNull().default(0),
  threshold: integer("threshold").default(5),
  isActive: boolean("is_active").default(true),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Clients schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  type: text("type").default("regular"), // regular, new, vip
  totalOrders: integer("total_orders").default(0),
  totalSpent: doublePrecision("total_spent").default(0),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  totalOrders: true,
  totalSpent: true,
});

// Sales schema
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull(),
  clientId: integer("client_id"),
  clientName: text("client_name").notNull(),
  status: text("status").default("pending"), // pending, paid, canceled
  total: doublePrecision("total").notNull(),
  date: timestamp("date").defaultNow(),
  items: jsonb("items").notNull(),
  notes: text("notes"),
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  date: true,
});

// Define zod schema for sale items array
export const saleItemSchema = z.object({
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  subtotal: z.number(),
});

export const saleItemsSchema = z.array(saleItemSchema);

// Invoices schema - dedicated table for invoices
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  clientId: integer("client_id"),
  clientName: text("client_name").notNull(),
  clientAddress: text("client_address"),
  status: text("status").default("draft"), // draft, sent, paid, overdue, canceled
  subtotal: doublePrecision("subtotal").notNull().default(0),
  taxRate: doublePrecision("tax_rate").notNull().default(19.25),
  taxAmount: doublePrecision("tax_amount").notNull().default(0),
  total: doublePrecision("total").notNull().default(0),
  issueDate: timestamp("issue_date").defaultNow().notNull(),
  dueDate: timestamp("due_date").notNull(),
  notes: text("notes"),
  items: jsonb("items").notNull(), // Array of invoice items
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Invoice items schema for validation
export const invoiceItemSchema = z.object({
  id: z.string(),
  productId: z.number().optional(),
  description: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  total: z.number().min(0),
});

export const invoiceItemsSchema = z.array(invoiceItemSchema);

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof company.$inferSelect;

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export type SaleItem = z.infer<typeof saleItemSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
