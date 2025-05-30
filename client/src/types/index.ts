export interface AppStats {
  openTickets: number;
  resolvedTickets: number;
  totalTickets: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  section: string;
}

export interface FAQCategory {
  id: string;
  label: string;
  value: string;
}
