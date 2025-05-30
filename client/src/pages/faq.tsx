import { useState, useEffect } from "react";
import { FAQ as FAQType } from "@shared/schema";
import { FAQItem } from "@/components/faq/faq-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const faqData: FAQType[] = [
  {
    id: "1",
    category: "account",
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking the \"Forgot Password\" link on the login page. Enter your email address and follow the instructions sent to your email. If you don't receive the email within a few minutes, please check your spam folder."
  },
  {
    id: "2",
    category: "billing",
    question: "How can I update my billing information?",
    answer: "Go to Account Settings > Billing to update your payment method, billing address, and other billing details. You can add new credit cards, update existing ones, or change your billing address at any time."
  },
  {
    id: "3",
    category: "technical",
    question: "Why is the application running slowly?",
    answer: "Slow performance can be caused by several factors: poor internet connection, browser cache issues, or high server load. Try clearing your browser cache and refreshing the page. If the problem persists, try using a different browser or contact support."
  },
  {
    id: "4",
    category: "features",
    question: "How do I export my data?",
    answer: "You can export your data from the Settings > Data Export section. Choose the format you prefer (CSV, JSON, or PDF) and click Export. The export will be processed and you'll receive a download link via email."
  },
  {
    id: "5",
    category: "account",
    question: "Can I change my username?",
    answer: "Usernames can be changed once every 30 days. Go to Account Settings > Profile to update your username. Please note that changing your username may affect some integrations and shared links."
  },
  {
    id: "6",
    category: "billing",
    question: "How do I cancel my subscription?",
    answer: "To cancel your subscription, go to Account Settings > Subscription and click \"Cancel Subscription\". Your access will continue until the end of your current billing period. You can reactivate your subscription at any time before it expires."
  },
  {
    id: "7",
    category: "technical",
    question: "What browsers are supported?",
    answer: "We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using Chrome or Firefox. Internet Explorer is not supported."
  },
  {
    id: "8",
    category: "features",
    question: "How do I collaborate with team members?",
    answer: "You can invite team members from the Team Settings page. Send them an invitation via email, and they'll be able to join your workspace with the appropriate permissions you set."
  }
];

const categories = [
  { id: "all", label: "All", value: "all" },
  { id: "account", label: "Account", value: "account" },
  { id: "billing", label: "Billing", value: "billing" },
  { id: "technical", label: "Technical", value: "technical" },
  { id: "features", label: "Features", value: "features" }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredFAQ, setFilteredFAQ] = useState<FAQType[]>(faqData);

  useEffect(() => {
    let filtered = [...faqData];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }

    setFilteredFAQ(filtered);
  }, [searchTerm, activeCategory]);

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
          <p className="text-slate-600">Find quick answers to common questions.</p>
        </div>

        {/* FAQ Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-3.5 text-slate-400"></i>
            <Input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.value ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(category.value)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="bg-white rounded-xl border border-slate-200">
          {filteredFAQ.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No FAQ items found for your search criteria.
            </div>
          ) : (
            <div>
              {filteredFAQ.map(faq => (
                <FAQItem key={faq.id} faq={faq} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
