import { Ticket } from "@shared/schema";

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticketId: string) => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
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

  const getPriorityBadge = (priority: string) => {
    const badges = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return badges[priority as keyof typeof badges] || badges['medium'];
  };

  return (
    <div 
      className="p-6 hover:bg-slate-50 cursor-pointer border-b border-slate-200 last:border-b-0"
      onClick={() => onClick(ticket.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">{ticket.id}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(ticket.status)}`}>
              {ticket.status}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(ticket.priority)}`}>
              {ticket.priority}
            </span>
          </div>
          <p className="text-slate-900 mb-2">{ticket.subject}</p>
          <p className="text-sm text-slate-600 mb-2">
            {ticket.description.substring(0, 100)}
            {ticket.description.length > 100 ? '...' : ''}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Created: {formatDate(ticket.createdAt)}</span>
            <span>Updated: {formatDate(ticket.updatedAt)}</span>
            <span>{ticket.responses.length} responses</span>
          </div>
        </div>
        <i className="fas fa-chevron-right text-slate-400"></i>
      </div>
    </div>
  );
}
