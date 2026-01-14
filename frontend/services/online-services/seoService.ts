import axiosInstance from "@/lib/axios";

export interface PageSEO {
  id: string | null;
  pagePath: string;
  pageName: string;
  description: string | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string | null;
  isActive: boolean;
}

// Get SEO data for a specific page
export const getPageSEO = async (pagePath: string): Promise<PageSEO | null> => {
  try {
    const encodedPath = encodeURIComponent(pagePath);
    const response = await axiosInstance.get(`/api/web/seo/page/${encodedPath}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching page SEO:", error);
    return null;
  }
};

// Get all page SEO data
export const getAllPageSEO = async (): Promise<PageSEO[]> => {
  try {
    const response = await axiosInstance.get("/api/web/seo");
    
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching all page SEO:", error);
    return [];
  }
};
