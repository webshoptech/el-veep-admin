export default interface User {
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
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
}
