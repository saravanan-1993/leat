import axiosInstance from "@/lib/axios";

// Admin Types
export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  image?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  currency?: string;
  companyName?: string;
  gstNumber?: string;
  role: string;
  workingHours?: WorkingHour[];
}

export interface WorkingHour {
  id: string;
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Auth Services
export const authService = {
  // Get current admin profile
  getCurrentAdmin: async (): Promise<AdminProfile> => {
    const response = await axiosInstance.get<ApiResponse<AdminProfile>>(
      "/api/auth/admin/me"
    );
    return response.data.data;
  },

  // Get admin currency
  getAdminCurrency: async (): Promise<string> => {
    const response = await axiosInstance.get<{ success: boolean; currency: string }>(
      "/api/auth/admin/currency"
    );
    return response.data.currency;
  },

  // Update admin profile
  updateAdminProfile: async (data: Partial<AdminProfile>): Promise<AdminProfile> => {
    const response = await axiosInstance.put<ApiResponse<AdminProfile>>(
      "/api/auth/admin/profile",
      data
    );
    return response.data.data;
  },
};
