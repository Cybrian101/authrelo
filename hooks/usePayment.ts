"use client";

import { useState, useCallback } from "react";
import { RazorpayOrder, PaymentVerification } from "@/types";

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const createOrder = useCallback(async (): Promise<RazorpayOrder | null> => {
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to create order");
      return await res.json();
    } catch (err) {
      setError("Could not create payment order. Please try again.");
      console.error(err);
      return null;
    }
  }, []);

  const verifyPayment = useCallback(
    async (data: PaymentVerification): Promise<boolean> => {
      try {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        return result.success === true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    []
  );

  const initiatePayment = useCallback(
    async (onSuccess: () => void, onFailure?: () => void) => {
      setIsLoading(true);
      setError(null);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Please try again.");
        setIsLoading(false);
        return;
      }

      const order = await createOrder();
      if (!order) {
        setIsLoading(false);
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "AuthRelo",
        description: "Relationship Pattern Reflection",
        order_id: order.orderId,
        handler: async (response: PaymentVerification) => {
          const verified = await verifyPayment(response);
          setIsLoading(false);
          if (verified) {
            onSuccess();
          } else {
            setError("Payment verification failed. Please contact support.");
            onFailure?.();
          }
        },
        theme: {
          color: "#F59E0B",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onFailure?.();
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    [loadRazorpayScript, createOrder, verifyPayment]
  );

  return {
    initiatePayment,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
