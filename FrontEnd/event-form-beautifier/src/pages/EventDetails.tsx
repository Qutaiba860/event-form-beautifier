import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar, MapPin, Users, Clock, Upload, Camera,
  Scan, ArrowLeft, Download, Eye, Plus, X
} from 'lucide-react';

type Media = {
  id: number;
  name: string;
  type: 'image' | 'video';
  url: string;
};

type Event = {
  id: number;
  name: string;
  category: string;
  department: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  location: string;
  host: string;
  description: string;
  goals: string;
  expected_students?: number;
  expected_faculty?: number;
  expected_community?: number;
  expected_others?: number;
  full_name?: string;
  email?: string;
  phone?: string;
  target_audience?: string;
  status: string;
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedMedia, setUploadedMedia] = useState<Media[]>([]);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceList, setAttendanceList] = useState<Array<{ id: string, name: string, timestamp: string }>>([]);
  const [scannerValue, setScannerValue] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await apiService.getEventById(id!);
        setEventData(event);
      } catch (error) {
        console.error("Error fetching event:", error);
        setEventData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const newMedia = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
          url: URL.createObjectURL(file)
        };
        setUploadedMedia(prev => [...prev, newMedia]);
      });
      toast({ title: "Media Uploaded", description: `${files.length} file(s) uploaded.` });
    }
  };

  const handleRemoveMedia = (id: number) => {
    setUploadedMedia(prev => prev.filter(media => media.id !== id));
    toast({ title: "Media Removed", description: "File removed successfully." });
  };

  const handleScanAttendance = () => {
    if (scannerValue.trim()) {
      const id = scannerValue.trim();
      if (attendanceList.find(a => a.id === id)) {
        toast({ title: "Duplicate", description: "ID already scanned.", variant: "destructive" });
        return;
      }
      const newAttendee = {
        id,
        name: `Student ${id}`,
        timestamp: new Date().toLocaleString()
      };
      setAttendanceList(prev => [...prev, newAttendee]);
      setScannerValue('');
      toast({ title: "Recorded", description: `${newAttendee.name} marked present.` });
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
    a.download = `${eventData?.name}_attendance.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!eventData) return <div className="p-8 text-center text-red-500">Event not found.</div>;

  const totalAttendees = eventData.expected_students + eventData.expected_faculty + eventData.expected_community + eventData.expected_others;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <Card className="shadow-xl border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">{eventData.name}</CardTitle>
                <CardDescription className="text-red-100">Event Overview</CardDescription>
              </div>
              {getStatusBadge(eventData.status)}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-gray-800">
            <div className="grid md:grid-cols-2 gap-4">
              <p><Calendar className="inline w-5 h-5 mr-2" /> {eventData.start_date} – {eventData.end_date}</p>
              <p><Clock className="inline w-5 h-5 mr-2" /> {eventData.start_time} – {eventData.end_time}</p>
              <p><MapPin className="inline w-5 h-5 mr-2" /> {eventData.venue}, {eventData.location}</p>
              <p><Users className="inline w-5 h-5 mr-2" /> {totalAttendees} expected attendees</p>
              <p><strong>Host:</strong> {eventData.host}</p>
              <p><strong>Department:</strong> {eventData.department}</p>
              <p><strong>Category:</strong> {eventData.category}</p>
              <p><strong>Target:</strong> {eventData.target_audience}</p>
            </div>
            <p><strong>Description:</strong> {eventData.description}</p>
            <p><strong>Goals:</strong> {eventData.goals}</p>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center">
              <Camera className="w-6 h-6 mr-2" /> Event Media
            </CardTitle>
            <CardDescription className="text-red-100">Upload photos and videos</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="border-2 border-dashed border-red-200 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-4">Drop files here or click to upload</p>
              <Button onClick={() => fileInputRef.current?.click()} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" /> Add Media
              </Button>
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
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
          </CardContent>
        </Card>

        <Card className="shadow-xl border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Scan className="w-6 h-6 mr-2" /> Attendance Tracking
                </CardTitle>
                <CardDescription className="text-red-100">Scan student IDs</CardDescription>
              </div>
              {attendanceList.length > 0 && (
                <Button onClick={handleExportAttendance} className="bg-white text-red-600 hover:bg-red-50">
                  <Download className="w-4 h-4 mr-2" /> Export CSV
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Scan or enter student ID..."
                    value={scannerValue}
                    onChange={(e) => setScannerValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleScanAttendance()}
                  />
                  <Button onClick={handleScanAttendance} className="bg-red-600 hover:bg-red-700">
                    <Scan className="w-4 h-4 mr-2" /> Scan
                  </Button>
                </div>
                <div className="text-center p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Total Attended: <span className="font-bold text-red-600">{attendanceList.length}</span> / {totalAttendees}
                  </p>
                </div>
              </div>

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