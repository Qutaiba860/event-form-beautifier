
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Upload, 
  Camera, 
  Scan, 
  ArrowLeft,
  Download,
  Eye,
  Plus,
  X
} from 'lucide-react';

// Mock event data - in real app this would come from API
const mockEventData = {
  1: {
    id: 1,
    name: "AI Workshop",
    category: "Technology",
    department: "Computer Science",
    date: "2024-01-15",
    start_time: "09:00",
    end_time: "17:00",
    venue: "Tech Hub Auditorium",
    location: "Building A, Floor 3",
    host: "Dr. John Smith",
    description: "A comprehensive workshop on artificial intelligence and machine learning fundamentals.",
    goals: "Introduce students to AI concepts and practical applications",
    expected_attendees: 45,
    status: "approved"
  },
  2: {
    id: 2,
    name: "Cultural Night",
    category: "Cultural",
    department: "Student Affairs",
    date: "2024-01-20",
    start_time: "18:00",
    end_time: "22:00",
    venue: "Main Auditorium",
    location: "Student Center",
    host: "Jane Doe",
    description: "Annual cultural celebration featuring performances from various countries.",
    goals: "Promote cultural diversity and student engagement",
    expected_attendees: 120,
    status: "pending"
  }
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedMedia, setUploadedMedia] = useState<Array<{id: number, name: string, type: string, url: string}>>([]);
  const [attendanceList, setAttendanceList] = useState<Array<{id: string, name: string, timestamp: string}>>([]);
  const [scannerValue, setScannerValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const eventData = mockEventData[id as keyof typeof mockEventData];

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Event Not Found</h2>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const newMedia = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: URL.createObjectURL(file)
        };
        setUploadedMedia(prev => [...prev, newMedia]);
      });
      toast({
        title: "Media Uploaded",
        description: `${files.length} file(s) uploaded successfully.`,
      });
    }
  };

  const handleRemoveMedia = (id: number) => {
    setUploadedMedia(prev => prev.filter(media => media.id !== id));
    toast({
      title: "Media Removed",
      description: "File removed successfully.",
    });
  };

  const handleScanAttendance = () => {
    if (scannerValue.trim()) {
      const newAttendee = {
        id: scannerValue.trim(),
        name: `Student ${scannerValue.trim()}`, // In real app, this would lookup the name
        timestamp: new Date().toLocaleString()
      };
      
      // Check if already scanned
      if (attendanceList.find(attendee => attendee.id === scannerValue.trim())) {
        toast({
          title: "Already Recorded",
          description: "This ID has already been scanned.",
          variant: "destructive",
        });
        return;
      }
      
      setAttendanceList(prev => [...prev, newAttendee]);
      setScannerValue('');
      toast({
        title: "Attendance Recorded",
        description: `${newAttendee.name} marked as present.`,
      });
    }
  };

  const handleExportAttendance = () => {
    const csvContent = [
      ['ID', 'Name', 'Timestamp'],
      ...attendanceList.map(attendee => [attendee.id, attendee.name, attendee.timestamp])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventData.name}_attendance.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Event Details */}
          <Card className="shadow-xl border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">{eventData.name}</CardTitle>
                  <CardDescription className="text-red-100">
                    Event Details & Information
                  </CardDescription>
                </div>
                {getStatusBadge(eventData.status)}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span className="font-medium">Date:</span>
                    <span>{eventData.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span className="font-medium">Time:</span>
                    <span>{eventData.start_time} - {eventData.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="font-medium">Venue:</span>
                    <span>{eventData.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-red-600" />
                    <span className="font-medium">Expected:</span>
                    <span>{eventData.expected_attendees} attendees</span>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{eventData.location}</span>
                </div>
                
                <div>
                  <span className="font-medium">Host:</span>
                  <span className="ml-2">{eventData.host}</span>
                </div>
                
                <div>
                  <span className="font-medium">Department:</span>
                  <span className="ml-2">{eventData.department}</span>
                </div>
                
                <div>
                  <span className="font-medium">Category:</span>
                  <Badge variant="outline" className="ml-2">{eventData.category}</Badge>
                </div>
                
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-gray-700">{eventData.description}</p>
                </div>
                
                <div>
                  <span className="font-medium">Goals:</span>
                  <p className="mt-1 text-gray-700">{eventData.goals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card className="shadow-xl border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold flex items-center">
                <Camera className="w-6 h-6 mr-2" />
                Event Media
              </CardTitle>
              <CardDescription className="text-red-100">
                Upload photos and videos from the event
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-red-200 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-4">Drop files here or click to upload</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Media
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                
                {uploadedMedia.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Files:</h4>
                    {uploadedMedia.map((media) => (
                      <div key={media.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {media.type === 'image' ? <Camera className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                          <span className="text-sm truncate">{media.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => window.open(media.url)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRemoveMedia(media.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Tracking */}
        <Card className="shadow-xl border-red-200 mt-6">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Scan className="w-6 h-6 mr-2" />
                  Attendance Tracking
                </CardTitle>
                <CardDescription className="text-red-100">
                  Scan student IDs to record attendance
                </CardDescription>
              </div>
              {attendanceList.length > 0 && (
                <Button
                  onClick={handleExportAttendance}
                  className="bg-white text-red-600 hover:bg-red-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Scanner Input */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Scan or enter student ID..."
                    value={scannerValue}
                    onChange={(e) => setScannerValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleScanAttendance()}
                    className="border-red-200 focus:border-red-500"
                  />
                  <Button
                    onClick={handleScanAttendance}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    Scan
                  </Button>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Total Attended: <span className="font-bold text-red-600">{attendanceList.length}</span> / {eventData.expected_attendees}
                  </p>
                </div>
              </div>

              {/* Attendance List */}
              <div className="space-y-2">
                <h4 className="font-medium">Attendance List:</h4>
                <div className="max-h-64 overflow-y-auto border rounded-lg">
                  {attendanceList.length === 0 ? (
                    <p className="p-4 text-gray-500 text-center">No attendees scanned yet</p>
                  ) : (
                    <div className="divide-y">
                      {attendanceList.map((attendee, index) => (
                        <div key={index} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{attendee.name}</p>
                            <p className="text-sm text-gray-500">ID: {attendee.id}</p>
                          </div>
                          <p className="text-xs text-gray-400">{attendee.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;
