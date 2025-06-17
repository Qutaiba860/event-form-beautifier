
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Event, Media } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, FileText, Plus } from 'lucide-react';

const HostDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [newMedia, setNewMedia] = useState({
    name: '',
    url: '',
    media_type: 'image',
    size: 0
  });
  const { user, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await apiService.getEvents();
      // Filter events for current user (assuming host field matches user's name)
      const userEvents = data.filter(event => 
        event.host.toLowerCase().includes(user?.first_name?.toLowerCase() || '') ||
        event.host.toLowerCase().includes(user?.last_name?.toLowerCase() || '')
      );
      setEvents(userEvents);
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

  const fetchEventMedia = async (eventId: number) => {
    try {
      const data = await apiService.getMedia(eventId);
      setMedia(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch media",
        variant: "destructive",
      });
    }
  };

  const handleAddMedia = async () => {
    if (!selectedEvent || !newMedia.name || !newMedia.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiService.createMedia({
        ...newMedia,
        event: selectedEvent.id,
        uploaded_by: user?.id
      });
      
      await fetchEventMedia(selectedEvent.id);
      setNewMedia({ name: '', url: '', media_type: 'image', size: 0 });
      setIsMediaDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Media added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add media",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'denied': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Host Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage your events and media</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.first_name}</span>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Events</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => e.status.toLowerCase() === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.reduce((sum, event) => sum + (event.expected_attendees || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>My Events ({events.length})</CardTitle>
            <CardDescription>View and manage your event details</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.start_date}</TableCell>
                    <TableCell>{event.expected_attendees || 0}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          fetchEventMedia(event.id);
                        }}
                      >
                        Manage Media
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Media Management */}
        {selectedEvent && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Media for {selectedEvent.name}</CardTitle>
                  <CardDescription>Manage photos, videos, and documents</CardDescription>
                </div>
                <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Media
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Media</DialogTitle>
                      <DialogDescription>
                        Upload new media for this event
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="media-name">Media Name</Label>
                        <Input
                          id="media-name"
                          value={newMedia.name}
                          onChange={(e) => setNewMedia({...newMedia, name: e.target.value})}
                          placeholder="Enter media name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="media-url">Media URL</Label>
                        <Input
                          id="media-url"
                          value={newMedia.url}
                          onChange={(e) => setNewMedia({...newMedia, url: e.target.value})}
                          placeholder="Enter media URL"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="media-type">Media Type</Label>
                        <select
                          id="media-type"
                          value={newMedia.media_type}
                          onChange={(e) => setNewMedia({...newMedia, media_type: e.target.value})}
                          className="w-full px-3 py-2 border border-input rounded-md"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                          <option value="document">Document</option>
                        </select>
                      </div>
                      <Button onClick={handleAddMedia} className="w-full">
                        Add Media
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {media.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{item.media_type}</p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Media
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No media uploaded for this event yet.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
