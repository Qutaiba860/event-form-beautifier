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
  url: string;       // for your frontend logic
  file: string;      // actual backend field from Django (FileField)
  media_type: string;
  name: string;
  uploaded_by: number;
  event: number;
  size: number;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async loginWithEmail(email: string): Promise<{ detail: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Failed to send OTP");
    return response.json();
  }

  async verifyOTP(email: string, otp: string): Promise<{detail: string}> {
    const response = await fetch(`${API_BASE_URL}/api/auth/otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) throw new Error("OTP verification failed");

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("current_user", JSON.stringify(data.user));
    return data.user;
  }

  async logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("current_user");
  }

  async refreshToken() {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) throw new Error("No refresh token");

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) throw new Error("Token refresh failed");

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    return data;
  }

  async getEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/api/events/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
  }

  async getEventById(id: number | string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch event");
    return response.json();
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error("Failed to create event");
    return response.json();
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}/`, {
      method: "PATCH",  // Changed from PUT to PATCH for partial updates
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Update event error:", response.status, errorData);
      throw new Error(`Failed to update event: ${response.status}`);
    }
    
    return response.json();
  }

  async approveEvent(id: number): Promise<Event> {
    return this.updateEvent(id, { status: 'approved' });
  }

  async rejectEvent(id: number): Promise<Event> {
    return this.updateEvent(id, { status: 'rejected' });
  }

  async uploadDocument(formData: FormData): Promise<Document> {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/documents/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Let the browser set Content-Type for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("📄 Document Upload Error:", error);
      throw new Error(error.detail || "Failed to upload document");
    }

    return await response.json();
  }

  async getDocuments(eventId?: number): Promise<Document[]> {
    const url = eventId
      ? `${API_BASE_URL}/api/documents/?event=${eventId}`
      : `${API_BASE_URL}/api/documents/`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch documents");
    return await response.json();
  }

  async deleteDocument(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete document");
  }

  async getBudgets(eventId?: number): Promise<Budget[]> {
    const url = eventId
      ? `${API_BASE_URL}/api/budgets/?event=${eventId}`
      : `${API_BASE_URL}/api/budgets/`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch budgets");
    return response.json();
  }

  async createBudget(budgetData: Partial<Budget>): Promise<Budget> {
    const response = await fetch(`${API_BASE_URL}/api/budgets/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(budgetData),
    });
    if (!response.ok) throw new Error("Failed to create budget");
    return response.json();
  }

  async getMedia(eventId?: number): Promise<Media[]> {
    const url = eventId
      ? `${API_BASE_URL}/api/media/?event=${eventId}`
      : `${API_BASE_URL}/api/media/`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch media");
    return response.json();
  }
  
  async deleteMedia(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/media/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete media");
    }
  }

  async uploadMedia(formData: FormData): Promise<Media> {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/api/media/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // No Content-Type! Let browser handle it for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to upload media");
    }

    return await response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/api/users/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Unauthorized");
    return await response.json();
  }
}

export const apiService = new ApiService();