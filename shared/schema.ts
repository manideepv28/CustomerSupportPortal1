import { z } from "zod";

export const ticketSchema = z.object({
  id: z.string(),
  subject: z.string().min(1, "Subject is required"),
  category: z.enum(["technical", "billing", "account", "feature", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["open", "in-progress", "resolved", "closed"]),
  description: z.string().min(1, "Description is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
  responses: z.array(z.object({
    id: z.string(),
    author: z.string(),
    message: z.string(),
    timestamp: z.string(),
    isAI: z.boolean().optional()
  }))
});

export const insertTicketSchema = ticketSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  responses: true
});

export const faqSchema = z.object({
  id: z.string(),
  category: z.enum(["account", "billing", "technical", "features", "general"]),
  question: z.string(),
  answer: z.string()
});

export const chatMessageSchema = z.object({
  id: z.string(),
  message: z.string(),
  isUser: z.boolean(),
  timestamp: z.string()
});

export type Ticket = z.infer<typeof ticketSchema>;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type FAQ = z.infer<typeof faqSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export type TicketResponse = Ticket["responses"][0];
