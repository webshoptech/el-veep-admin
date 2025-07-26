import { SettlementAccount } from "./FinanceType";
import { User } from "./UserType";

export interface TransactionResponse {
    message: string;
    data: Transaction[];
    total: number;
    limit: string;
    offset: number;
    type: {
        product: number;
        subscription: number;
        withdrawal: number;
    };
    search: string;
    status: {
        pending: number;
        cancelled: number;
        completed: number;
        refunded: number;
        failed: number;
        approved: number;
        declined: number;
    };
}

export interface Transaction {
    id: number;
    reference: string;
    sender_id: number;
    receiver_id: number;
    amount: string;
    status: string;
    type: string;
    description: string;
    transaction_data: TransactionData;
    created_at: string;
    updated_at: string;
    settlement_account: SettlementAccount;
}

export interface TransactionData {
    id: number;
    vendor_id: number;
    settlement_account_id: number;
    amount: string;
    status: string;
    created_at: string;
    updated_at: string;
    vendor: User;
}
