"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { BookingProvider } from "@/context/BookingContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }) {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    >
      <AuthProvider>
        <BookingProvider>
          {children}
          <Toaster />
        </BookingProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

// Convenience export
export { useAuth };