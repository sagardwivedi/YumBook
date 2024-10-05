import { create } from "zustand";

import type { UserPublic } from "~/client";
import { readMeOptions } from "~/client/@tanstack/react-query.gen";
import { queryClient } from "~/index";

interface UserState {
  isAuthenticated: boolean;
  user: UserPublic | null; // Initialize as null when no user is authenticated
  initializeUser: () => Promise<void>; // Make this asynchronous
  logout: () => void; // Add a logout function to reset the store
}

// Create Zustand store for user state management
const useUserStore = create<UserState>()((set) => ({
  isAuthenticated: false, // Initially, the user is not authenticated
  user: null, // No user data initially

  // Asynchronously initialize the user data and mark as authenticated
  initializeUser: async () => {
    try {
      // Ensure the user data is fetched using react-query
      const user = await queryClient.ensureQueryData(readMeOptions());

      if (user) {
        set({
          user, // Set the fetched user data
          isAuthenticated: true, // Mark the user as authenticated
        });
      }
    } catch (error) {
      console.error("Failed to initialize user:", error);
      // Handle errors or unauthenticated state as needed
    }
  },

  // Reset the user data and mark as unauthenticated
  logout: () => {
    set({
      user: null, // Clear the user data
      isAuthenticated: false, // Mark the user as not authenticated
    });
  },
}));

export default useUserStore;
