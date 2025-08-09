export interface TeamResponse {
    data: Team[];
    total: number;
    active: number;
    inactive: number;
    offset: number;
    limit: number;
}

export interface Team {
    id: number;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    status: number;
    last_login: string;
    password_changed_at: string;
}