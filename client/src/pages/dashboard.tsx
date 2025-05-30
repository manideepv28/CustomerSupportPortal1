import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ticketStorage } from "@/lib/ticket-storage";
import { Ticket } from "@shared/schema";
import { AppStats } from "@/types";

export default function Dashboard() {
  const [stats, setStats] = useState<AppStats>({
    openTickets: 0,
    resolvedTickets: 0,
    totalTickets: 0
  });
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const tickets = ticketStorage.getTickets();
    const ticketStats = ticketStorage.getStats();
    
    setStats({
      ...ticketStats,
      totalTickets: tickets.length
    });
    
    setRecentTickets(tickets.slice(-3).reverse());
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'open': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges] || badges['open'];
  };

  const viewTicket = (ticketId: string) => {
    const ticket = ticketStorage.getTicketById(ticketId);
    if (ticket) {
      alert(`Viewing ticket ${ticketId}:\n\nSubject: ${ticket.subject}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}\n\nDescription:\n${ticket.description}`);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Support</h2>
          <p className="text-slate-600">Manage your support requests and find answers to common questions.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-ticket-alt text-2xl text-primary"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Open Tickets</p>
                <p className="text-2xl font-bold text-slate-900">{stats.openTickets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-check-circle text-2xl text-success"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Resolved</p>
                <p className="text-2xl font-bold text-slate-900">{stats.resolvedTickets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-clock text-2xl text-warning"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Avg Response</p>
                <p className="text-2xl font-bold text-slate-900">2.4h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Recent Tickets</h3>
          </div>
          <div className="p-6">
            {recentTickets.length === 0 ? (
              <p className="text-slate-500">
                No tickets found.{' '}
                <Link href="/new-ticket" className="text-primary hover:underline">
                  Create your first ticket
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {recentTickets.map(ticket => (
                  <div key={ticket.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900">{ticket.id}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">{ticket.subject}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(ticket.createdAt)}</p>
                    </div>
                    <button 
                      onClick={() => viewTicket(ticket.id)}
                      className="text-primary hover:text-blue-700 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
