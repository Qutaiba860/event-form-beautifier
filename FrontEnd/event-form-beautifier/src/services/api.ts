
export const API_BASE_URL = "http://192.168.72.1:8000/api"; // or localhost
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
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');

    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });

    if (!response.ok) throw new Error('Token refresh failed');

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    return data;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  }

  async getEventById(id: number | string): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events/${id}/`, {
    headers: this.getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch event");
  return response.json();
}

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData)
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}/`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData)
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  }

  // Budgets
  async getBudgets(eventId?: number): Promise<Budget[]> {
    const url = eventId ? `${API_BASE_URL}/budgets/?event=${eventId}` : `${API_BASE_URL}/budgets/`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch budgets');
    return response.json();
  }

  async createBudget(budgetData: Partial<Budget>): Promise<Budget> {
    const response = await fetch(`${API_BASE_URL}/budgets/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(budgetData)
    });
    if (!response.ok) throw new Error('Failed to create budget');
    return response.json();
  }

  // Media
  async getMedia(eventId?: number): Promise<Media[]> {
    const url = eventId ? `${API_BASE_URL}/media/?event=${eventId}` : `${API_BASE_URL}/media/`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch media');
    return response.json();
  }

  async createMedia(mediaData: Partial<Media>): Promise<Media> {
    const response = await fetch(`${API_BASE_URL}/media/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(mediaData)
    });
    if (!response.ok) throw new Error('Failed to create media');
    return response.json();
  }

  // Users
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/user/`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch current user');
    return response.json();
  }
}

export const apiService = new ApiService();
