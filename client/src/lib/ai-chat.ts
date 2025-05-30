// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "default_key",
  dangerouslyAllowBrowser: true
});

export interface AIResponse {
  message: string;
  suggestedActions?: string[];
}

export class AIChatService {
  private isOpenAIConfigured(): boolean {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    return apiKey !== undefined && apiKey !== "default_key" && apiKey.trim() !== "";
  }

  async generateResponse(userMessage: string, conversationHistory: string[] = []): Promise<AIResponse> {
    if (!this.isOpenAIConfigured()) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      const messages = [
        {
          role: "system" as const,
          content: `You are a helpful customer support AI assistant. Provide concise, helpful responses to customer inquiries. 
          Focus on common support topics like:
          - Account issues (login, password reset, profile updates)
          - Billing questions (charges, subscriptions, payment methods)
          - Technical problems (app performance, connectivity, features)
          - General product information

          Always be polite, professional, and suggest creating a support ticket for complex issues.
          Keep responses under 100 words when possible.`
        },
        ...conversationHistory.map((msg, index) => ({
          role: (index % 2 === 0 ? "user" : "assistant") as const,
          content: msg
        })),
        {
          role: "user" as const,
          content: userMessage
        }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 150,
        temperature: 0.7
      });

      const aiMessage = response.choices[0]?.message?.content || "I apologize, but I'm having trouble generating a response right now.";
      
      return {
        message: aiMessage,
        suggestedActions: this.getSuggestedActions(userMessage)
      };

    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): AIResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('password') || lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
      return {
        message: 'For password issues, you can reset it using the "Forgot Password" link on the login page. If you continue having trouble, please create a support ticket for personalized assistance.',
        suggestedActions: ['Create support ticket', 'View FAQ']
      };
    }
    
    if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('charge') || lowerMessage.includes('subscription')) {
      return {
        message: 'For billing questions, you can check your account settings or create a billing support ticket. Our team will help you resolve any payment-related issues quickly.',
        suggestedActions: ['Create billing ticket', 'View billing FAQ']
      };
    }
    
    if (lowerMessage.includes('slow') || lowerMessage.includes('performance') || lowerMessage.includes('loading') || lowerMessage.includes('crash')) {
      return {
        message: 'Performance issues can often be resolved by clearing your browser cache and refreshing the page. If the problem persists, please create a technical support ticket with details about your device and browser.',
        suggestedActions: ['Create technical ticket', 'View technical FAQ']
      };
    }
    
    if (lowerMessage.includes('cancel') || lowerMessage.includes('delete') || lowerMessage.includes('close account')) {
      return {
        message: 'You can manage your subscription and account settings in your profile. If you need help with cancellation or account closure, please create a support ticket and we\'ll assist you with the process.',
        suggestedActions: ['Create account ticket', 'View account FAQ']
      };
    }
    
    return {
      message: 'Thank you for your question! I\'m here to help with common support issues. For the best assistance with your specific situation, I recommend creating a support ticket or browsing our FAQ section.',
      suggestedActions: ['Create support ticket', 'Browse FAQ', 'View all categories']
    };
  }

  private getSuggestedActions(userMessage: string): string[] {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('password') || lowerMessage.includes('login')) {
      return ['Reset password', 'Create technical ticket'];
    }
    
    if (lowerMessage.includes('billing') || lowerMessage.includes('payment')) {
      return ['View billing settings', 'Create billing ticket'];
    }
    
    if (lowerMessage.includes('slow') || lowerMessage.includes('performance')) {
      return ['Clear browser cache', 'Create technical ticket'];
    }
    
    return ['Create support ticket', 'Browse FAQ'];
  }
}

export const aiChatService = new AIChatService();
