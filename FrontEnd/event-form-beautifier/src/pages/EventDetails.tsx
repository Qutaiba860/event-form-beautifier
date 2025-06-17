
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Users, MapPin, User, Target } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import AttendanceScanner from '@/components/AttendanceScanner';

// Mock event data - in real app this would come from API
const mockEventData = {
  1: {
    id: 1,
    name: "AI Workshop",
    description: "A comprehensive workshop on artificial intelligence and machine learning fundamentals.",
    start_date: "2024-01-15",
    end_date: "2024-01-15",
    start_time: "09:00",
    end_time: "17:00",
    host: "John Doe",
    venue: "Conference Hall A",
    location: "Main Campus",
    category: "Technology",
    department: "Computer Science",
    goals: "To provide students with practical knowledge of AI technologies and their applications.",
    expected_students: 30,
    expected_faculty: 5,
    expected_community: 10,
    expected_others: 0,
    status: "approved"
  },
  2: {
    id: 2,
    name: "Cultural Night",
    description: "An evening celebrating the diverse cultures represented at AURAK.",
    start_date: "2024-01-20",
    end_date: "2024-01-20",
    start_time: "18:00",
    end_time: "22:00",
    host: "Jane Smith",
    venue: "University Auditorium",
    location: "Main Campus",
    category: "Cultural",
    department: "Student Affairs",
    goals: "To promote cultural diversity and understanding among the university community.",
    expected_students: 100,
    expected_faculty: 20,
    expected_community: 0,
    expected_others: 0,
    status: "pending"
  }
};

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'attendance'>('details');

  useEffect(() => {
    if (id && mockEventData[id as keyof typeof mockEventData]) {
      setEvent(mockEventData[id as keyof typeof mockEventData]);
    }
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Event not found</div>
      </div>
    );
  }

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

  const totalExpected = (event.expected_students || 0) + (event.expected_faculty || 0) + 
                       (event.expected_community || 0) + (event.expected_others || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-4 border-red-200 text-red-600 hover:bg-red-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="shadow-xl border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">{event.name}</CardTitle>
                <CardDescription className="text-red-100 text-lg">
                  Event Details & Management
                </CardDescription>
              </div>
              {getStatusBadge(event.status)}
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Tab Navigation */}
            <div className="mb-6 border-b border-red-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'details'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Event Details
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'media'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Media Upload
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'attendance'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Attendance
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-800">Date</p>
                        <p className="text-gray-600">{event.start_date} to {event.end_date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-800">Time</p>
                        <p className="text-gray-600">{event.start_time} - {event.end_time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-800">Venue</p>
                        <p className="text-gray-600">{event.venue}, {event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-800">Host</p>
                        <p className="text-gray-600">{event.host}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-800">Expected Attendance</p>
                        <p className="text-gray-600">Total: {totalExpected} people</p>
                        <div className="text-sm text-gray-500">
                          <p>Students: {event.expected_students || 0}</p>
                          <p>Faculty: {event.expected_faculty || 0}</p>
                          <p>Community: {event.expected_community || 0}</p>
                          <p>Others: {event.expected_others || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">Category</p>
                      <Badge variant="secondary">{event.category}</Badge>
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">Department</p>
                      <p className="text-gray-600">{event.department}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-800 mb-2">Description</p>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{event.description}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-red-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Goals</p>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{event.goals}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <MediaUpload eventId={event.id} />
            )}

            {activeTab === 'attendance' && (
              <AttendanceScanner eventId={event.id} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;
