import { apiClient } from "./client.js";

export async function login(email, password) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
}

export async function register(payload) {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

export async function fetchProfile() {
  const { data } = await apiClient.get("/auth/profile");
  return data.user;
}
