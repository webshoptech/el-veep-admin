import axios from "axios";
import { API_URL } from "../setting";

export async function login(formData: FormData) {
  const response = await axios.post(`${API_URL}/login`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return response.data;
}

export async function changePassword(formData: FormData) {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/change-password`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
