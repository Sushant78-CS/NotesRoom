import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = user?.role === "ROLE_ADMIN";
  const isAuth = !!user;
  const isLoading = useAuthStore((state) => state.isLoading);
  const loadUser = useAuthStore((state) => state.loadUser);

  return { user, setUser, logout, isAdmin, isAuth, isLoading, loadUser };
};
