import { Ticket, InsertTicket, TicketResponse } from '@shared/schema';
import { nanoid } from 'nanoid';

class TicketStorage {
  private storageKey = 'supportTickets';

  generateTicketId(): string {
    const ticketCount = this.getTickets().length;
    return `TKT-${String(ticketCount + 1).padStart(3, '0')}`;
  }

  getTickets(): Ticket[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getInitialTickets();
    } catch (error) {
      console.error('Error reading tickets from localStorage:', error);
      return this.getInitialTickets();
    }
  }

  private getInitialTickets(): Ticket[] {
    const tickets: Ticket[] = [
      {
        id: 'TKT-001',
        subject: 'Login issues with mobile app',
        category: 'technical',
        priority: 'high',
        status: 'open',
        description: 'I cannot log into the mobile app using my credentials. The app keeps showing "Invalid credentials" even though I\'m using the correct username and password.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        responses: [
          {
            id: nanoid(),
            author: 'Support Team',
            message: 'Thank you for contacting us. We are investigating this issue and will get back to you within 24 hours.',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      },
      {
        id: 'TKT-002',
        subject: 'Billing question about recent charge',
        category: 'billing',
        priority: 'medium',
        status: 'resolved',
        description: 'I see a charge on my account for $29.99 that I do not recognize. Can you please clarify what this charge is for?',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        responses: [
          {
            id: nanoid(),
            author: 'Support Team',
            message: 'This charge is for your annual subscription renewal that occurred on your billing anniversary date.',
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      }
    ];

    this.saveTickets(tickets);
    return tickets;
  }

  saveTickets(tickets: Ticket[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tickets));
    } catch (error) {
      console.error('Error saving tickets to localStorage:', error);
    }
  }

  createTicket(ticketData: InsertTicket): Ticket {
    const tickets = this.getTickets();
    const newTicket: Ticket = {
      ...ticketData,
      id: this.generateTicketId(),
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: []
    };

    tickets.push(newTicket);
    this.saveTickets(tickets);
    return newTicket;
  }

  updateTicket(ticketId: string, updates: Partial<Ticket>): Ticket | null {
    const tickets = this.getTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) return null;

    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveTickets(tickets);
    return tickets[ticketIndex];
  }

  addResponse(ticketId: string, response: Omit<TicketResponse, 'id'>): Ticket | null {
    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) return null;

    const newResponse: TicketResponse = {
      ...response,
      id: nanoid()
    };

    ticket.responses.push(newResponse);
    ticket.updatedAt = new Date().toISOString();

    this.saveTickets(tickets);
    return ticket;
  }

  getTicketById(ticketId: string): Ticket | null {
    return this.getTickets().find(t => t.id === ticketId) || null;
  }

  getStats() {
    const tickets = this.getTickets();
    return {
      openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length,
      resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
      totalTickets: tickets.length
    };
  }
}

export const ticketStorage = new TicketStorage();
