import axios from "axios";
import { create } from "zustand";

//* APP_API_BASE_URL is an environment variable that is set in .env file
//* APP_API_BASE_URL=http://localhost:5000/
const baseurl = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

interface UserStore {
  loadingStatus: boolean;
  message: string;
  successful: boolean;
  updateProfilePicture: (profile_picture: File | null) => Promise<void>; // return 🔔🔔🔔🔔
  updateProfile: (full_name: string, bio: string) => Promise<void>; // return 🔔🔔🔔🔔
  removeProfilePicture: () => Promise<void>; // return 🔔🔔🔔🔔
}

export const useUserStore = create<UserStore>((set) => ({
  loadingStatus: false,
  successful: false,
  message: "",
  updateProfilePicture: async (profile_picture: File | null) => {
    try {
      set({ loadingStatus: true });
      const formData = new FormData();
      if (profile_picture) {
        formData.append("avatar", profile_picture);
      }
      await axios
        .post(`${baseurl}api/v1/user/update/avatar`, formData, {
          headers: {
            authorization: `Bearer ${document.cookie.split(';')[0].split("=")[1]}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            set({
              message: response.data.message,
              successful: true,
            });
          } else {
            set({ message: response.data.message });
          }
          set({ loadingStatus: false });
        })
        .catch((error) => {
          set({ message: error.message, loadingStatus: false });
        });
    } catch (error: any) {
      set({ message: error.message, loadingStatus: false });
    }
  },
  updateProfile: async (full_name: string, bio: string) => {
    try {
      set({ loadingStatus: true });
      await axios
        .post(
          `${baseurl}api/v1/user/update/profile`,
          JSON.stringify({ full_name, bio }),
          {
            headers: {
              authorization: `Bearer ${document.cookie.split(';')[0].split("=")[1]}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            set({
              message: response.data.message,
              successful: true,
            });
          } else {
            set({ message: response.data.message });
          }
          set({ loadingStatus: false });
        })
        .catch((error) => {
          set({ message: error.message, loadingStatus: false });
        });
    } catch (error: any) {
      set({ message: error.message, loadingStatus: false });
    }
  },
  removeProfilePicture: async () => {
    try {
      set({ loadingStatus: true });
      await axios
        .delete(`${baseurl}api/v1/user/remove/avatar`, {
          headers: {
            authorization: `Bearer ${document.cookie.split(';')[0].split("=")[1]}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            set({
              message: response.data.message,
              successful: true,
              loadingStatus: false,
            });
          }
        })
        .catch((error) => {
          set({ message: error.message, loadingStatus: false });
        });
    } catch (error: any) {
      set({ message: error.message, loadingStatus: false });
    }
  },
}));
