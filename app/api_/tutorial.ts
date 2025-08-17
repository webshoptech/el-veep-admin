import axios from "@/app/lib/axios";

export async function listTutorials() {
    const response = await axios.get(`/tutorials`);
    return response.data;
}

export async function createTutorial(formData: FormData) {
    const response = await axios.post(`/tutorials/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
    });
    return response.data;
}

export async function updateTutorial(id: string, formData: FormData) {
    const response = await axios.put(`/tutorials/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
    });
    return response.data;
}

export async function deleteTutorial(id: string) {
    const response = await axios.delete(`/tutorials/${id}`);
    return response.data;
}