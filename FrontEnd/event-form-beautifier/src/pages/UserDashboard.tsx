import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Plus, Filter, Check, X, Users, Clock, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [userRole] = useState<'admin' | 'user'>('user');

  const privilegedEmails = [ // Add more as needed
  "2023005883@aurak.ac.ae",
  "Imad.hoballah@aurak.ac.ae",
  "qutaiba.raid@gmail.com"
  ];

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await apiService.getEvents();
        const currentEmail = user?.email || "";
        const adminEmail = "admin@aurak.ac.ae";
        const filtered = data.filter(event =>
          privilegedEmails.includes(currentEmail) || event.creator?.email === currentEmail
        );
        setEvents(filtered);
      } catch (err) {
        toast({
          title: "Error loading events",
          description: err.message,
          variant: "destructive",
        });
      }
    }
    fetchEvents();
  }, [user]);



  const handleCreateEvent = () => {
    navigate('/events');
  };

  const handleViewEvent = (eventId: number) => {
    navigate(`/event-details/${eventId}`);
  };

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

  return (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 py-8 px-4">
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-xl border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center">
                <Calendar className="w-8 h-8 mr-3" />
                {user?.email === 'admin@aurak.ac.ae' ? 'Admin Dashboard' : 'My Events Dashboard'}
              </CardTitle>
              <CardDescription className="text-red-100 text-lg">
                AURAK Event Management Platform
              </CardDescription>
            </div>
            <Button
              onClick={handleCreateEvent}
              className="bg-white text-red-600 hover:bg-red-50 font-semibold px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Event
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* ✅ Move search bar here */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="sport">Sport</option>
              <option value="academic">Academic</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>

          {/* ✅ Then render the table */}
          {events.length > 0 ? (
            <Table className="mt-6">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events
                  .filter(event =>
                    event.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (filterCategory === 'all' || event.category.toLowerCase() === filterCategory)
                  )
                  .map(event => (
                    <TableRow key={event.id}>
                      <TableCell>{event.name}</TableCell>
                      <TableCell>{event.start_date} {event.start_time}</TableCell>
                      <TableCell>{event.end_date} {event.end_time}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleViewEvent(event.id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="mt-6 text-center text-gray-600">No events to display.</div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);

};

export default UserDashboard;