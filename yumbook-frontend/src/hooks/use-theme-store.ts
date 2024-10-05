import { debounce } from "lodash";
import { create } from "zustand";

type THEME = "light" | "dark";

// Utility function to update <html> class with debounce
const updateHtmlClass = debounce((theme: THEME) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }
}, 100);

// Utility to detect the user's system theme preference
const getSystemTheme = (): THEME =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

// Utility to get the saved theme from localStorage
const getSavedTheme = (): THEME | null => {
  return localStorage.getItem("theme") as THEME | null;
};

// Save theme to localStorage
const saveTheme = (theme: THEME) => {
  localStorage.setItem("theme", theme);
};

// Create a Zustand store for theme management
interface ThemeState {
  theme: THEME;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: getSystemTheme(),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      saveTheme(newTheme); // Save to localStorage
      updateHtmlClass(newTheme); // Update <html> class
      return { theme: newTheme };
    }),

  // Initialize theme on app load, using saved theme or system preference
  initializeTheme: () => {
    const savedTheme = getSavedTheme();
    const initialTheme = savedTheme ? savedTheme : getSystemTheme();
    updateHtmlClass(initialTheme); // Apply theme to <html>
    set({ theme: initialTheme }); // Set theme in Zustand store
  },
}));
