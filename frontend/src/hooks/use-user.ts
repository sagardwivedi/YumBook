import { create } from "zustand";
import { queryClient } from "~/App";
import { type UserPublic, logoutUser } from "~/client";
import { getCurrentUserOptions } from "~/client/@tanstack/react-query.gen";

interface UserState {
  isAuthenticated: boolean;
  user: UserPublic | null;
  initializeUser: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  isAuthenticated: false,
  user: null,

  initializeUser: async () => {
    try {
      const user = await queryClient.ensureQueryData(getCurrentUserOptions());

      if (user) {
        set({ user, isAuthenticated: true });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error("Error during user initialization:", error);
      set({ isAuthenticated: false, user: null });
    }
  },

  logout: () => {
    try {
      set({ user: null, isAuthenticated: false });
      logoutUser();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
}));
