export interface Message {
  id: string;
  type: "ai" | "user" | "micro-reflect";
  content: string;
  timestamp: number;
}

export interface SessionState {
  currentStep: number;
  answers: string[];
  messages: Message[];
  isAnalysing: boolean;
  analysisResult: AnalysisResult | null;
  isPaid: boolean;
}

export interface AnalysisResult {
  patternName: string;
  previewLine: string;
  sections: {
    heard: string;
    pattern: string;
    entryPoint: string;
    partnerExperience: string;
    action: string;
    closing: string;
  };
  safetyFlag?: boolean;
}

export interface Question {
  id: number;
  text: string;
  microReflect: string | null;
  label: string;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Razorpay global type
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: PaymentVerification) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}
