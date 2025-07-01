import React from 'react';
import { Event } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock, Camera, FileText, X, Download, Eye } from 'lucide-react';

type Media = {
  id: number;
  name: string;
  type: 'image' | 'video';
  url: string;
};

type Document = {
  id: number;
  name: string;
  type: 'pdf' | 'excel' | 'word' | 'powerpoint' | 'text';
  url: string;
  size: string;
};

interface EventViewModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventViewModal: React.FC<EventViewModalProps> = ({ event, isOpen, onClose }) => {
  // Mock data for demonstration - in real app this would come from API
  const mockMedia: Media[] = [
    { id: 1, name: 'event_photo_1.jpg', type: 'image', url: '/placeholder.svg' },
    { id: 2, name: 'event_video_1.mp4', type: 'video', url: '/placeholder.svg' },
    { id: 3, name: 'event_photo_2.jpg', type: 'image', url: '/placeholder.svg' },
  ];

  const mockDocuments: Document[] = [
    { id: 1, name: 'Event_Proposal.pdf', type: 'pdf', url: '/placeholder.svg', size: '2.5 MB' },
    { id: 2, name: 'Budget_Breakdown.xlsx', type: 'excel', url: '/placeholder.svg', size: '1.2 MB' },
    { id: 3, name: 'Presentation.pptx', type: 'powerpoint', url: '/placeholder.svg', size: '5.8 MB' },
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'word': return '📝';
      case 'powerpoint': return '📋';
      case 'text': return '📄';
      default: return '📄';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'denied': return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isOpen || !event) return null;

  const totalAttendees = (event.expected_students || 0) + (event.expected_faculty || 0) + (event.expected_community || 0) + (event.expected_others || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{event.name}</h2>
              <p className="text-gray-600 mt-1">Event Details & Media Review</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(event.status)}
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Event Overview */}
          <Card className="shadow-lg border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">Event Overview</CardTitle>
              <CardDescription className="text-blue-100">Basic event information</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-gray-800">
              <div className="grid md:grid-cols-2 gap-4">
                <p><Calendar className="inline w-5 h-5 mr-2" /> {event.start_date} – {event.end_date}</p>
                <p><Clock className="inline w-5 h-5 mr-2" /> {event.start_time} – {event.end_time}</p>
                <p><MapPin className="inline w-5 h-5 mr-2" /> {event.venue}, {event.location}</p>
                <p><Users className="inline w-5 h-5 mr-2" /> {totalAttendees} expected attendees</p>
                <p><strong>Host:</strong> {event.host}</p>
                <p><strong>Department:</strong> {event.department}</p>
                <p><strong>Category:</strong> {event.category}</p>
                <p><strong>Target:</strong> {event.target_audience}</p>
              </div>
              <p><strong>Description:</strong> {event.description}</p>
              <p><strong>Goals:</strong> {event.goals}</p>
            </CardContent>
          </Card>

          {/* Event Media */}
          <Card className="shadow-lg border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold flex items-center">
                <Camera className="w-6 h-6 mr-2" /> Event Media
              </CardTitle>
              <CardDescription className="text-blue-100">Photos and videos from the event</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {mockMedia.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Media Files ({mockMedia.length}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockMedia.map((media) => (
                      <div key={media.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2">
                          {media.type === 'image' ? <Camera className="w-4 h-4 text-blue-600" /> : <FileText className="w-4 h-4 text-purple-600" />}
                          <span className="text-sm truncate max-w-32">{media.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => window.open(media.url)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No media files uploaded</p>
              )}
            </CardContent>
          </Card>

          {/* Event Documents */}
          <Card className="shadow-lg border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold flex items-center">
                <FileText className="w-6 h-6 mr-2" /> Event Documents
              </CardTitle>
              <CardDescription className="text-blue-100">Documentation and files related to the event</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {mockDocuments.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Document Files ({mockDocuments.length}):</h4>
                  <div className="space-y-2">
                    {mockDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                          <div>
                            <span className="text-sm font-medium">{doc.name}</span>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => window.open(doc.url)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No documents uploaded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventViewModal;