import { clearToken, clearUser, getUser } from "@/api/storage";
import { create } from "zustand";

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  setIsLoading: (isLoading: boolean) => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user: User) => set({ user }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  loadUser: async () => {
    try {
      const storedUser = await getUser();
      if (storedUser) {
        set({ user: storedUser });
      }
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    await clearToken();
    await clearUser();
    set({ user: null, isLoading: false });
  },
}));
