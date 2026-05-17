import { useAuthStore } from "@/store/authStore";
import { AxiosError, AxiosRequestConfig } from "axios";
import {
  getAccessTokenMemory,
  refreshToken,
  setAccessTokenMemory,
} from "./auth";
import { api } from "./client";
import { clearUser, getRefreshToken, saveToken, saveUser } from "./storage";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    console.log("Response error status =>", error.response?.status);
    console.log("Request URL =>", originalRequest?.url);

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const storedRefreshToken = await getRefreshToken();
        if (!storedRefreshToken) {
          console.log("No refresh token found, clearing and rejecting");
          await clearUser();
          return Promise.reject(error);
        }

        const res = await refreshToken(storedRefreshToken);
        console.log("REFRESH RESPONSE =>", res.data);
        const { accessToken, refreshToken: newRefreshToken, user } = res.data;

        if (user) {
          await saveUser(user);
          useAuthStore.getState().setUser(user);
        }

        setAccessTokenMemory(accessToken);
        await saveToken(accessToken, newRefreshToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (err) {
        console.log("Critical Auth Failure", err);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

api.interceptors.request.use(async (config) => {
  const token = getAccessTokenMemory();

  if (!config.headers) {
    config.headers = {} as any;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("INTERCEPTOR HIT");
  console.log("FINAL TOKEN USED =>", token);
  console.log("FINAL HEADERS =>", config.headers);
  return config;
});
