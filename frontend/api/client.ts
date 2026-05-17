import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.12:8080/",
});

export const refreshApi = axios.create({
  baseURL: "http://192.168.1.12:8080/",
});
