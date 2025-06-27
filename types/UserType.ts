export type User = {
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
};


export default interface UserResponse  {
  status: "success";
  data: User[];
  total: number;
  limit: number;
  offset: number;
};

export interface UserAdminType {
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
