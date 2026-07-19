
export type AdminProfile = {
  id: number;
  username: string;
  email: string;
  contact: string;
};

export type UpdateAdminProfileDTO = Omit<AdminProfile, "id">;