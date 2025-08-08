import axios from "@/app/lib/axios";

export async function listInvites() {
    const response = await axios.get(`/invite-stats`);
    return response.data;
}

export async function sendInvite(data: {
  name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}) {
  const response = await axios.post("/invite/send", data);
  return response.data;
}
