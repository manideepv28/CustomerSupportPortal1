import { useState, useEffect } from "react";
import { ticketStorage } from "@/lib/ticket-storage";
import { Ticket } from "@shared/schema";
import { TicketCard } from "@/components/tickets/ticket-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const allTickets = ticketStorage.getTickets();
    setTickets(allTickets);
    setFilteredTickets(allTickets);
  }, []);

  useEffect(() => {
    let filtered = [...tickets];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter]);

  const viewTicket = (ticketId: string) => {
    const ticket = ticketStorage.getTicketById(ticketId);
    if (ticket) {
      alert(`Viewing ticket ${ticketId}:\n\nSubject: ${ticket.subject}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}\n\nDescription:\n${ticket.description}\n\nResponses: ${ticket.responses.length}`);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">My Tickets</h2>
          <p className="text-slate-600">Track and manage your support requests.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="ticket-search" className="text-sm font-medium text-slate-700 mb-2">
                Search Tickets
              </Label>
              <Input
                id="ticket-search"
                type="text"
                placeholder="Search by ticket ID or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">All Tickets</h3>
          </div>
          <div className="divide-y divide-slate-200">
            {filteredTickets.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No tickets found.</div>
            ) : (
              filteredTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} onClick={viewTicket} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
