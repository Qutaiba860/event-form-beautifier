import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Event } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import EventViewModal from '@/components/EventViewModal';
import { Filter, Users, Calendar, Download, Eye } from 'lucide-react';
import { getDepartmentForAdmin, isUltimateAdmin, getUserRole } from '@/utils/userUtils';

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const userEmail = user?.email || '';
  const userRole = getUserRole(userEmail);
  const adminDepartment = getDepartmentForAdmin(userEmail);
  const canViewAllEvents = isUltimateAdmin(userEmail);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Debug information
    console.log('Admin Department:', adminDepartment);
    console.log('Can View All Events:', canViewAllEvents);
    console.log('User Email:', userEmail);
    console.log('All Events:', events.map(e => ({ name: e.name, department: e.department })));

    // Filter by department access first
    if (!canViewAllEvents && adminDepartment) {
      // More flexible department matching - check if event department contains admin department or vice versa
      filtered = filtered.filter(event => {
        const eventDept = event.department?.toLowerCase().trim() || '';
        const adminDept = adminDepartment.toLowerCase().trim();
        
        console.log(`Comparing event dept: "${eventDept}" with admin dept: "${adminDept}"`);
        
        // Exact match
        if (eventDept === adminDept) return true;
        
        // Check if admin department contains key words from event department
        if (adminDept.includes('accounting') && eventDept.includes('accounting')) return true;
        if (adminDept.includes('finance') && eventDept.includes('finance')) return true;
        if (adminDept.includes('civil') && eventDept.includes('civil')) return true;
        if (adminDept.includes('chemical') && eventDept.includes('chemical')) return true;
        if (adminDept.includes('petroleum') && eventDept.includes('petroleum')) return true;
        if (adminDept.includes('computer') && eventDept.includes('computer')) return true;
        if (adminDept.includes('electrical') && eventDept.includes('electrical')) return true;
        if (adminDept.includes('electronic') && eventDept.includes('electronic')) return true;
        if (adminDept.includes('mechanical') && eventDept.includes('mechanical')) return true;
        if (adminDept.includes('architecture') && eventDept.includes('architecture')) return true;
        if (adminDept.includes('biotechnology') && eventDept.includes('biotechnology')) return true;
        if (adminDept.includes('humanities') && eventDept.includes('humanities')) return true;
        if (adminDept.includes('social') && eventDept.includes('social')) return true;
        if (adminDept.includes('mathematics') && eventDept.includes('mathematics')) return true;
        if (adminDept.includes('physics') && eventDept.includes('physics')) return true;
        if (adminDept.includes('management') && eventDept.includes('management')) return true;
        
        return false;
      });
      
      console.log('Filtered Events for Department:', filtered.map(e => ({ name: e.name, department: e.department })));
    }

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.host.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status.toLowerCase() === statusFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(event => event.department === departmentFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, departmentFilter, canViewAllEvents, adminDepartment]);

  const fetchEvents = async () => {
    try {
      const data = await apiService.getEvents();
      setEvents(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEventStatus = async (eventId: number, newStatus: string) => {
    try {
      await apiService.updateEvent(eventId, { status: newStatus });
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, status: newStatus } : event
      ));
      toast({
        title: "Success",
        description: `Event ${newStatus.toLowerCase()} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event status",
        variant: "destructive",
      });
    }
  };

  const exportEventsToCSV = (eventsToExport: Event[], filename: string) => {
    const headers = [
      'Event Name', 'Host', 'Department', 'Start Date', 'End Date',
      'Start Time', 'End Time', 'Venue', 'Location', 'Category', 'Status',
      'Expected Students', 'Expected Faculty', 'Expected Community', 'Expected Others',
      'Description', 'Goals'
    ];

    const csvContent = [
      headers.join(','),
      ...eventsToExport.map(event => [
        `"${event.name}"`,
        `"${event.host}"`,
        `"${event.department}"`,
        event.start_date,
        event.end_date,
        event.start_time,
        event.end_time,
        `"${event.venue}"`,
        `"${event.location}"`,
        event.category,
        event.status,
        event.expected_students ?? 0,
        event.expected_faculty ?? 0,
        event.expected_community ?? 0,
        event.expected_others ?? 0,
        `"${event.description}"`,
        `"${event.goals}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `${eventsToExport.length} event(s) exported to ${filename}`,
    });
  };

  const handleExportFiltered = () => {
    const filename = `filtered_events_${new Date().toISOString().split('T')[0]}.csv`;
    exportEventsToCSV(filteredEvents, filename);
  };

  const handleExportSingle = (event: Event) => {
    const filename = `${event.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${event.id}.csv`;
    exportEventsToCSV([event], filename);
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'denied': return 'destructive';
      default: return 'outline';
    }
  };

  const departments = [...new Set(events.map(event => event.department))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const getDashboardTitle = () => {
    if (canViewAllEvents) return 'Ultimate Admin Dashboard';
    if (adminDepartment) return `${adminDepartment} - Admin Dashboard`;
    return 'Admin Dashboard';
  };

  const getDashboardDescription = () => {
    if (canViewAllEvents) return 'Manage and approve all events across all departments';
    if (adminDepartment) return `Manage and approve events for ${adminDepartment}`;
    return 'Manage and approve events';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {getDashboardTitle()}
            </h1>
            <p className="text-muted-foreground mt-2">{getDashboardDescription()}</p>
            {adminDepartment && !canViewAllEvents && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-blue-600">
                  Viewing events for: {adminDepartment}
                </p>
                <p className="text-xs text-gray-500">
                  Debug: Found {filteredEvents.length} events for your department
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleExportFiltered}
              className="bg-green-600 hover:bg-green-700"
              disabled={filteredEvents.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Filtered Events ({filteredEvents.length})
            </Button>
            <span className="text-sm text-muted-foreground">Welcome, {user?.first_name}</span>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>

        {/* Debug Information for Department Admins */}
        {!canViewAllEvents && adminDepartment && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p><strong>Your Department:</strong> {adminDepartment}</p>
                <p><strong>Total Events in System:</strong> {events.length}</p>
                <p><strong>Events for Your Department:</strong> {filteredEvents.length}</p>
                <p><strong>All Event Departments:</strong> {Array.from(new Set(events.map(e => e.department))).join(', ')}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter events by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {canViewAllEvents && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Events ({filteredEvents.length})</CardTitle>
            <CardDescription>Manage event approvals and details</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.host}</TableCell>
                    <TableCell>{event.department}</TableCell>
                    <TableCell>{event.start_date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewEvent(event)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportSingle(event)}
                          className="bg-green-50 hover:bg-green-100"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        {event.status.toLowerCase() !== 'approved' && (
                          <Button
                            size="sm"
                            onClick={() => updateEventStatus(event.id, 'Approved')}
                          >
                            Approve
                          </Button>
                        )}
                        {event.status.toLowerCase() !== 'denied' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateEventStatus(event.id, 'Denied')}
                          >
                            Deny
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <EventViewModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;