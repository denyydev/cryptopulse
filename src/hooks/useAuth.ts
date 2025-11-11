import { useAppStore } from "../store/useAppStore";

export const loginFake = (u: string, p: string) =>
  useAppStore.getState().login(u, p);
export const logout = () => useAppStore.getState().logout();
export const isAuthenticated = () => useAppStore.getState().isAuthenticated();
export const getUsername = () => useAppStore.getState().username ?? "guest";
