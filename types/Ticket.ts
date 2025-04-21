export default interface Ticket {
    id: number;
    title: string;
    ticket_id: string;
    subject: string;
    description: string; // this is a JSON string
    file: string | null;
    file_public_id: string | null;
    priority_level: 'low' | 'medium' | 'high';
    response_status: 'open' | 'close';
    reporter_id: number;
    agent_id: number | null;
    created_at: string;
    updated_at: string;
    reporter: Reporter;
  }

  
  interface Reporter {
    id: number;
    name: string;
    last_name: string;
    phone: string;
    email: string;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    role: string;
    is_active: number;
    city: string;
    state: string;
    country: string;
    profile_photo: string;
    google_id: string | null;
    fcm_token: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  }
  