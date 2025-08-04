import axios from "@/app/lib/axios";

export async function listInvites() {
    const response = await axios.get(`/invite-stats`);
    return response.data;
}

export async function sendInvite(formData: FormData) {
    const response = await axios.post("/invite/send", formData);
    return response.data;
}
