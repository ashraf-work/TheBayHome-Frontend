// hooks/useGoogleAuth.js

import { useAuth } from "@/context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";

export const useGoogleAuth = ({ setLoading, router, next }) => {
    const {refresh} = useAuth();
  const googleLogin = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`,
          {
            code: codeResponse.code,
          },
          {
            withCredentials: true,
          },
        );

        await refresh();
        toast.success("Logged in with Google");

        router.replace(next);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Google login failed");
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      toast.error("Google login failed");
    },
  });

  return googleLogin;
};
