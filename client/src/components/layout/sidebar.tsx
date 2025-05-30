import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt", path: "/" },
  { id: "tickets", label: "My Tickets", icon: "fas fa-ticket-alt", path: "/tickets" },
  { id: "new-ticket", label: "New Ticket", icon: "fas fa-plus", path: "/new-ticket" },
  { id: "faq", label: "FAQ", icon: "fas fa-question-circle", path: "/faq" }
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200">
      <div className="flex items-center px-6 py-4 border-b border-slate-200">
        <i className="fas fa-headset text-primary text-2xl mr-3"></i>
        <h1 className="text-xl font-bold text-slate-900">Support Portal</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.id} href={item.path}>
              <button
                className={cn(
                  "w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <i className={`${item.icon} mr-3`}></i>
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
