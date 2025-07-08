import { API_BASE_URL } from "@/config";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  department: string;
  email: string;
  phone: string;
}

export interface Document {
  id: number;
  name: string;
  type: string;
  url: string;
  size: number;
  event: number;
  file?: string; // Backend field name might differ
}

export interface Event {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  host: string;
  venue: string;
  location: string;
  category: string;
  department: string;
  goals: string;
  expected_attendees: number;
  expected_students?: number;
  expected_faculty?: number;
  expected_community?: number;
  expected_others?: number;
  creator?: {
    email: string;
  };
  target_audience: string;
}

export interface Budget {
  id: number;
  item_name: string;
  item_quantity: number;
  item_cost: number;
  total_cost: number;
  budget_status: string;
  event: number;
}

export interface Media {
  id: number;
  url: string;
  file: string;
  media_type: string;
  name: string;
  uploaded_by: number;
  event: number;
  size: number;
}

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("access_token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    // Remove Content-Type for FormData requests
    if (options.body instanceof FormData) {
      delete headers["Content-Type"];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await this.parseError(response);
      throw new Error(errorData.message || "Request failed");
    }

    return response;
  }

  private async parseError(response: Response) {
    try {
      return await response.json();
    } catch {
      return {
        status: response.status,
        message: response.statusText,
      };
    }
  }

  // Auth Methods
  async loginWithEmail(email: string): Promise<{ detail: string }> {
    const response = await this.request("/api/auth/otp/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return response.json();
  }

  async verifyOTP(email: string, otp: string): Promise<User> {
    const response = await this.request("/api/auth/otp/verify/", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("current_user", JSON.stringify(data.user));
    return data.user;
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("current_user");
  }

  async refreshToken() {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) throw new Error("No refresh token");

    const response = await this.request("/api/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    return data;
  }

  // Document Methods
  async getDocuments(eventId?: number): Promise<Document[]> {
    const endpoint = eventId 
      ? `/api/documents/?event=${eventId}`
      : "/api/documents/";
    
    const response = await this.request(endpoint);
    return response.json();
  }

  async uploadDocument(formData: FormData): Promise<Document> {
    const response = await this.request("/api/documents/", {
      method: "POST",
      body: formData,
    });
    return response.json();
  }

  async deleteDocument(id: number): Promise<void> {
    await this.request(`/api/documents/${id}/`, {
      method: "DELETE",
    });
  }

  async downloadDocument(id: number): Promise<Response> {
    // First try the dedicated download endpoint
    try {
      return await this.request(`/api/documents/${id}/download/`, {
        headers: {
          Accept: "*/*", // Accept any file type
        },
      });
    } catch (error) {
      console.log("Download endpoint failed, trying direct access:", error);
    }

    // Fallback to getting document info and using the URL
    const document = await this.getDocumentById(id);
    if (!document.url && document.file) {
      document.url = `${API_BASE_URL}${document.file}`;
    }

    if (!document.url) {
      throw new Error("No download URL available for this document");
    }

    return this.request(document.url.startsWith("http") 
      ? document.url.replace(API_BASE_URL, "")
      : document.url, {
      headers: {
        Accept: "*/*",
      },
    });
  }

  async getDocumentById(id: number): Promise<Document> {
    const response = await this.request(`/api/documents/${id}/`);
    return response.json();
  }

  // Event Methods
  async getEvents(): Promise<Event[]> {
    const response = await this.request("/api/events/");
    return response.json();
  }

  async getEventById(id: number | string): Promise<Event> {
    const response = await this.request(`/api/events/${id}/`);
    return response.json();
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await this.request("/api/events/", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
    return response.json();
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
    const response = await this.request(`/api/events/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(eventData),
    });
    return response.json();
  }

  async approveEvent(id: number): Promise<Event> {
    return this.updateEvent(id, { status: "approved" });
  }

  async rejectEvent(id: number): Promise<Event> {
    return this.updateEvent(id, { status: "rejected" });
  }

  // Media Methods
  async getMedia(eventId?: number): Promise<Media[]> {
    const endpoint = eventId
      ? `/api/media/?event=${eventId}`
      : "/api/media/";
    const response = await this.request(endpoint);
    return response.json();
  }

  async uploadMedia(formData: FormData): Promise<Media> {
    const response = await this.request("/api/media/", {
      method: "POST",
      body: formData,
    });
    return response.json();
  }

  async deleteMedia(id: number): Promise<void> {
    await this.request(`/api/media/${id}/`, {
      method: "DELETE",
    });
  }

  // Budget Methods
  async getBudgets(eventId?: number): Promise<Budget[]> {
    const endpoint = eventId
      ? `/api/budgets/?event=${eventId}`
      : "/api/budgets/";
    const response = await this.request(endpoint);
    return response.json();
  }

  async createBudget(budgetData: Partial<Budget>): Promise<Budget> {
    const response = await this.request("/api/budgets/", {
      method: "POST",
      body: JSON.stringify(budgetData),
    });
    return response.json();
  }

  // User Methods
  async getUsers(): Promise<User[]> {
    const response = await this.request("/api/users/");
    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request("/api/auth/me/");
    return response.json();
  }
}

export const apiService = new ApiService();