import { API_BASE_URL } from "@/config";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  department: string;
  email: string;
  phone: string;
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

  async loginWithEmail(email: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/auth/otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Failed to send OTP");
    return response.json();
  }

  async verifyOTP(email: string, otp: string): Promise<any> {
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
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error("Failed to update event");
    return response.json();
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

  async createMedia(mediaData: Partial<Media>): Promise<Media> {
    const response = await fetch(`${API_BASE_URL}/api/media/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(mediaData),
    });
    if (!response.ok) throw new Error("Failed to create media");
    return response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/api/users/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/user/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch current user");
    return response.json();
  }
}

export const apiService = new ApiService();
