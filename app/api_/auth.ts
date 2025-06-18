import axios from "axios";
import { API_URL } from "@/app/setting";
import { UserAdminType } from "@/types/User";

export async function loginAdmin(email: string, password: string) {
  const { data } = await axios.post<UserAdminType>(
    `${API_URL}/login`,
    `grant_type=password&username=${encodeURI(email)}&password=${password}`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data;
}
