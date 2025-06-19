
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Plus, Filter, Check, X, Users, Eye, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for demonstration
const mockUserEvents = [
  {
    id: 1,
    name: "AI Workshop",
    category: "Technology",
    date: "2024-01-15",
    status: "approved",
    attendees: 45
  },
  {
    id: 2,
    name: "Cultural Night",
    category: "Cultural",
    date: "2024-01-20",
    status: "pending",
    attendees: 120
  }
];

const mockAllEvents = [
  {
    id: 1,
    name: "AI Workshop",
    category: "Technology",
    date: "2024-01-15",
    status: "approved",
    attendees: 45,
    host: "John Doe",
    budget: 5000
  },
  {
    id: 2,
    name: "Cultural Night",
    category: "Cultural",
    date: "2024-01-20",
    status: "pending",
    attendees: 120,
    host: "Jane Smith",
    budget: 8000
  },
  {
    id: 3,
    name: "Science Fair",
    category: "Academic",
    date: "2024-01-25",
    status: "pending",
    attendees: 200,
    host: "Dr. Ahmed",
    budget: 12000
  }
];

const UserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Determine if user is admin based on email
  const isAdmin = user?.email === 'admin@aurak.ac.ae';

  const handleCreateEvent = () => {
    navigate('/events');
  };

  const handleViewEvent = (eventId: number) => {
    navigate(`/event-details/${eventId}`);
  };

  const handleApproveEvent = (eventId: number, eventName: string) => {
    toast({
      title: "Event Approved",
      description: `${eventName} has been approved successfully.`,
    });
  };

  const handleRejectEvent = (eventId: number, eventName: string) => {
    toast({
      title: "Event Rejected",
      description: `${eventName} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleApproveBudget = (eventId: number, eventName: string) => {
    toast({
      title: "Budget Approved",
      description: `Budget for ${eventName} has been approved.`,
    });
  };

  const handleDenyBudget = (eventId: number, eventName: string) => {
    toast({
      title: "Budget Denied",
      description: `Budget for ${eventName} has been denied.`,
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredEvents = mockAllEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.host.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-xl border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold flex items-center">
                    <Users className="w-8 h-8 mr-3" />
                    Admin Dashboard
                  </CardTitle>
                  <CardDescription className="text-red-100 text-lg">
                    AURAK Event Management Platform - Administrative Panel
                  </CardDescription>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-white text-red-600 hover:bg-red-50 border-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {/* Filters */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search events by name, category, or host..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-red-200 focus:border-red-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-red-200 rounded-md focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="technology">Technology</option>
                    <option value="cultural">Cultural</option>
                    <option value="academic">Academic</option>
                  </select>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Events Table */}
              <div className="rounded-lg border border-red-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-red-50">
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id} className="hover:bg-red-50">
                        <TableCell className="font-medium">
                          <button
                            onClick={() => handleViewEvent(event.id)}
                            className="text-red-600 hover:text-red-800 hover:underline font-medium"
                          >
                            {event.name}
                          </button>
                        </TableCell>
                        <TableCell>{event.host}</TableCell>
                        <TableCell>{event.category}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.attendees}</TableCell>
                        <TableCell>AED {event.budget.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewEvent(event.id)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApproveEvent(event.id, event.name)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectEvent(event.id, event.name)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveBudget(event.id, event.name)}
                              className="border-green-200 text-green-600 hover:bg-green-50"
                            >
                              Budget ✓
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDenyBudget(event.id, event.name)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Budget ✗
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Normal User View
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center">
                  <Calendar className="w-8 h-8 mr-3" />
                  My Events Dashboard
                </CardTitle>
                <CardDescription className="text-red-100 text-lg">
                  AURAK Event Management Platform
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateEvent}
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold px-6 py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Event
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-white text-red-600 hover:bg-red-50 border-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Past Events</h3>
              <div className="grid gap-4">
                {mockUserEvents.map((event) => (
                  <Card key={event.id} className="border-red-100 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <button
                              onClick={() => handleViewEvent(event.id)}
                              className="text-lg font-semibold text-red-600 hover:text-red-800 hover:underline"
                            >
                              {event.name}
                            </button>
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="flex items-center gap-6 text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{event.attendees} attendees</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{event.category}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleViewEvent(event.id)}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {mockUserEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
                <p className="text-gray-500 mb-6">Start by creating your first event!</p>
                <Button
                  onClick={handleCreateEvent}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserPage;
