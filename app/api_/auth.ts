import axios from "@/app/lib/axios";
import { UserAdminType } from "@/types/UserType";

export async function loginAdmin(email: string, password: string) {
  const { data } = await axios.post<UserAdminType>(
    "/login",
    `grant_type=password&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data;
}
