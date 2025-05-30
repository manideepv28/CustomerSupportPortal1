import { useState } from "react";
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

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="text-slate-600"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
        <h1 className="font-semibold text-slate-900">Support Portal</h1>
        <div className="w-6"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h1 className="text-xl font-bold text-slate-900">Support Portal</h1>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <nav className="px-4 py-6 space-y-2">
              {navigationItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <Link key={item.id} href={item.path}>
                    <button
                      onClick={() => setIsMenuOpen(false)}
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
        </div>
      )}
    </>
  );
}
