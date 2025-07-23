import axios from "@/app/lib/axios";
import { FinanceGraph, FinanceOverviewType } from "@/types/FinanceType";

export async function getFinanceOverview(params: {
    start_date?: string;
}): Promise<FinanceOverviewType> {
    const response = await axios.get<FinanceOverviewType>(
        "/earnings/overview",
        {
            params,
        }
    );
    return response.data;
}
export async function getFinanceGraph(params: {
    start_date?: string;
}): Promise<FinanceGraph> {
    const response = await axios.get<FinanceGraph>(
        "/earnings/graph",
        {
            params,
        }
    );
    return response.data;
}
