import axios from "../axios";

export async function listProducts(
    limit: number,
    offset: number,
    search?: string,
    type?: string,
    status?: string
) {
    const response = await axios.get("/items", {
        params: {
            limit,
            offset,
            ...(search ? { search } : {}),
            ...(type ? { type } : {}),
            ...(status ? { status } : {}),
        },
    });
    return response.data;
}

export async function deleteProduct(productId: number) {
    const response = await axios.delete(`/items/delete/${productId}`);
    return response.data;
}

export async function addItem(formData: FormData) {
    const response = await axios.post("/items/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function updateItem(ItemId: number, formData: FormData) {
    formData.append("_method", "PUT");
    const response = await axios.post(
        `/items/update/${ItemId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
}

export async function deleteItem(productId: number) {
    const { data } = await axios.delete(`/items/delete/${productId}`);
    return data.data;
}

export async function deleteItemPhoto(
    productId: number | string,
    publicId: string
) {
    const { data } = await axios.delete(
        `/vendor/items/image/delete/${productId}`,
        {
            data: {
                delete_public_ids: [publicId],
            },
        }
    );

    return data.data;
}

export async function productGraph(
    selectedPeriod?: string,
    type?: string,
    status?: string
) {
    const response = await axios.get(
        `/product-graph?start_date=${selectedPeriod}&type=${type}&status=${status}`
    );
    return response.data;
}

export async function mostSellingProducts(limit?: number, offset?: number) {
    const response = await axios.get(
        `/most-selling-products?limit=${limit}&offset=${offset}`
    );
    return response.data;
}

export async function mostSellingProductGraph(selectedPeriod?: string) {
    const response = await axios.get(
        `/most-selling-products-graph?start_date=${selectedPeriod}`
    );
    return response.data;
}

export async function updateItemStatus(productId: number, status: string) {
    const response = await axios.patch(
        `/product/${productId}/status/${status}`
    );
    return response.data;
}
