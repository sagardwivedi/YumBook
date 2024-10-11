import { create } from "zustand";
import { queryClient } from "~/App";
import { type UserPublic, logoutUser } from "~/client";
import { readMeOptions } from "~/client/@tanstack/react-query.gen";

interface UserState {
  isAuthenticated: boolean;
  user: UserPublic | null;
  initializeUser: () => Promise<void>;
  logout: () => void;
}

// Create Zustand store for user state management
export const useUserStore = create<UserState>()((set) => ({
  isAuthenticated: false,
  user: null,

  // Initialize user asynchronously by checking the server for JWT validity
  initializeUser: async () => {
    try {
      // Fetch the user from the server by validating the JWT
      const user = await queryClient.ensureQueryData(readMeOptions());

      if (user) {
        set({ user, isAuthenticated: true }); // User is authenticated
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error("Error during user initialization:", error);
      set({ isAuthenticated: false, user: null });
    }
  },

  // Logout user and reset state
  logout: () => {
    try {
      set({ user: null, isAuthenticated: false });
      logoutUser(); // This will also clear the JWT stored in the HTTP-only cookie
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
}));
