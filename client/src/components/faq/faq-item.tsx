import { useState } from "react";
import { FAQ } from "@shared/schema";

interface FAQItemProps {
  faq: FAQ;
}

export function FAQItem({ faq }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        className="w-full p-6 text-left hover:bg-slate-50 focus:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-900 pr-4">{faq.question}</h3>
          <i className={`fas fa-chevron-down text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-slate-600">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}
