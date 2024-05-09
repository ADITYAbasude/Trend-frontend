import { getToken } from "@/utils/utils";
import { serialize } from "cookie";
import { create } from "zustand";
import axios from "axios";

//* APP_API_BASE_URL is an environment variable that is set in .env file
//* APP_API_BASE_URL=http://localhost:5000/
const baseurl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
interface AuthStore {
  successful: boolean;
  loading: boolean;
  valid: boolean;
  message: string;
  otpSend: boolean;
  register: (
    moilId: string,
    fullName: String,
    username: String,
    password: string
  ) => Promise<void>;
  verifyOtp: (otp: string, mailId: string) => Promise<void>;
  login: (mailId: string, password: string) => Promise<void>;
  verifyUser: () => Promise<void>;
  // googleLogin: (code: any) => Promise<void>;
}

let controller: AbortController | null = null;

export const useAuthStore = create<AuthStore>()((set) => ({
  successful: false,
  loading: false,
  valid: false,
  otpSend: false,
  message: "",

  //TODO: check after login and signup the token verification is executed or not
  register: async (
    mailId: string,
    fullName: String,
    username: String,
    password: string
  ) => {
    try {
      set({ loading: true });
      const response = await axios.post(
        `${baseurl}api/v1/auth/register`,
        {
          mailId,
          fullName,
          username,
          password,
        },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
      if (response.status === 200) {
        set({
          message: response.data.message,
          loading: false,
          otpSend: true,
          successful: false,
        });
      } else {
        set({
          successful: false,
          message: response.data.message,
          loading: false,
          otpSend: false,
        });
      }
    } catch (error: any) {
      set({
        successful: false,
        message: error.message,
        loading: false,
        otpSend: false,
      });
    }
  },
  verifyOtp: async (otp: string, mailId: string) => {
    try {
      set({ loading: true });
      const response = await axios.post(
        `${baseurl}api/v1/auth/verifyOtp`,
        {
          otp,
          mailId,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        document.cookie = serialize("token", response.data.token, {
          path: "/",
          maxAge: 7 * 24 * 12 * 60 * 60,
        });
        set({
          successful: true,
          message: response.data.message,
          loading: false,
          otpSend: false,
        });
      } else
        set({
          successful: false,
          message: response.data.message,
          loading: false,
        });
    } catch (error: any) {
      set({ successful: false, message: error.message, loading: false });
    }
  },
  login: async (mailId: string, password: string) => {
    try {
      set({ loading: true });
      const response = await axios.post(
        `${baseurl}api/v1/auth/login`,
        { mailId, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (response.status === 200) {
        document.cookie = serialize("token", data.token, {
          path: "/",
          maxAge: 7 * 24 * 12 * 60 * 60,
        });
        set({ successful: true, message: data.message, loading: false });
      }
    } catch (error: any) {
      set({ message: error.message });
    } finally {
      set({ loading: false });
    }
  },
  verifyUser: async () => {
    const token: any = await getToken();
    if (controller !== null) (controller as AbortController).abort();
    controller = new AbortController();
    const signal = controller.signal;
    set({ loading: true });
    try {
      const response = await axios.get(`${baseurl}api/v1/auth/verify`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        signal,
      });

      const data = response.data;
      if (response.status === 200) {
        document.cookie = serialize("userId", data.id, {
          path: "/",
          maxAge: 7 * 24 * 12 * 60 * 60,
        });
        set({
          message: data.message,
          loading: false,
          valid: data.valid,
        });
      } else set({ message: data.message, loading: false, valid: data.valid });
    } catch (error: any) {
      set({ message: error.message, loading: false, valid: false });
    }
  },
}));
