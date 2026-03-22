import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface UIState {
  // Compare
  compareList: string[];
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Recently Viewed
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      compareList: [],
      addToCompare: (productId) => {
        const { compareList } = get();
        if (compareList.length >= 4 || compareList.includes(productId)) return;
        set({ compareList: [...compareList, productId] });
      },
      removeFromCompare: (productId) => set({ compareList: get().compareList.filter(id => id !== productId) }),
      clearCompare: () => set({ compareList: [] }),
      isInCompare: (productId) => get().compareList.includes(productId),

      recentlyViewed: [],
      addToRecentlyViewed: (productId) => {
        const { recentlyViewed } = get();
        const updated = [productId, ...recentlyViewed.filter(id => id !== productId)].slice(0, 12);
        set({ recentlyViewed: updated });
      },

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchHistory: [],
      addToSearchHistory: (query) => {
        if (!query.trim()) return;
        const { searchHistory } = get();
        const updated = [query, ...searchHistory.filter(q => q !== query)].slice(0, 10);
        set({ searchHistory: updated });
      },
      clearSearchHistory: () => set({ searchHistory: [] }),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      theme: "system",
      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        if (theme === "system") {
          const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          root.classList.add(isDark ? "dark" : "light");
        } else {
          root.classList.add(theme);
        }
      },
    }),
    {
      name: "markethub-ui",
      partialize: (state) => ({
        compareList: state.compareList,
        recentlyViewed: state.recentlyViewed,
        searchHistory: state.searchHistory,
        theme: state.theme,
      }),
    }
  )
);
