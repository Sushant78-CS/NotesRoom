import { api, refreshApi } from "./client";

export const signUp = (data: { username: string; password: string }) => {
  return api.post("/auth/signup", data);
};

export const login = (data: { username: string; password: string }) => {
  return api.post("/auth/login", data);
};

export const refreshToken = (refreshToken: string) => {
  return refreshApi.post("/auth/refresh", { refreshToken });
};

let accessTokenMemory: string | null = null;

export const setAccessTokenMemory = (token: string | null) => {
  accessTokenMemory = token;
};

export const getAccessTokenMemory = () => {
  return accessTokenMemory;
};
