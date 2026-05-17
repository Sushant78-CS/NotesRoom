import { User } from "@/store/authStore";
import * as SecureStore from "expo-secure-store";

export const saveUser = async (user: User) => {
  try {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
  } catch (error) {
    console.log("Error saving user to secure storage", error);
  }
};

export const getUser = async () => {
  try {
    const user = await SecureStore.getItemAsync("user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error getting user from secure storage", err);
    return null;
  }
};

export const clearUser = async () => {
  await SecureStore.deleteItemAsync("user");
};

export const saveToken = async (accessToken: string, refreshToken: string) => {
  try {
    await SecureStore.setItemAsync("ACCESS_TOKEN", accessToken);
    await SecureStore.setItemAsync("REFRESH_TOKEN", refreshToken);
  } catch (error) {
    console.log("Error saving token to secure storage", error);
  }
};

export const getToken = async () => {
  try {
    const accessToken = await SecureStore.getItemAsync("ACCESS_TOKEN");
    const refreshToken = await SecureStore.getItemAsync("REFRESH_TOKEN");
    return { accessToken, refreshToken };
  } catch (err) {
    console.error("Error getting token from secure storage", err);
    return { accessToken: null, refreshToken: null };
  }
};

export const clearToken = async () => {
  await SecureStore.deleteItemAsync("ACCESS_TOKEN");
  await SecureStore.deleteItemAsync("REFRESH_TOKEN");
};

export const getRefreshToken = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync("REFRESH_TOKEN");
    return refreshToken;
  } catch (err) {
    console.error("Error getting refresh token from secure storage", err);
    return null;
  }
};

export const getAccessToken = async () => {
  try {
    const accessToken = await SecureStore.getItemAsync("ACCESS_TOKEN");
    return accessToken;
  } catch (err) {
    console.error("Error getting access token from secure storage", err);
    return null;
  }
};
