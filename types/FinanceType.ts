export interface FinanceOverviewType {
    status: "success";
    data: {
        sales_summary: {
            total_orders: number;
            completed_orders: number;
            total_platform_revenue: number;
            customer_pending_payments: number;
        };
        vendor_summary: {
            unpaid_vendor_earnings: number;
            total_vendors: number;
        };
        wallet_summary: {
            total_earnings_recorded: number;
            total_available_to_withdraw: number;
        };
    };
}

export interface FinanceGraph {
    status: "success";
    data: {
        day: string;
        total: number;
    };
}
