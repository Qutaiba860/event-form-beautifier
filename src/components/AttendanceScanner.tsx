
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Scan, User, Download, UserCheck } from 'lucide-react';

interface Attendee {
  id: string;
  name: string;
  studentId: string;
  department: string;
  checkInTime: string;
}

interface AttendanceScannerProps {
  eventId: number;
}

const AttendanceScanner: React.FC<AttendanceScannerProps> = ({ eventId }) => {
  const { toast } = useToast();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [manualId, setManualId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock student database for demo
  const mockStudentDB: Record<string, { name: string; department: string }> = {
    '20210001': { name: 'Ahmed Al-Rashid', department: 'Computer Science' },
    '20210002': { name: 'Fatima Hassan', department: 'Business Administration' },
    '20210003': { name: 'Omar Abdullah', department: 'Engineering' },
    '20210004': { name: 'Aisha Mohammed', department: 'Psychology' },
    '20210005': { name: 'Khalid Al-Mansoori', department: 'Computer Science' },
  };

  const addAttendee = (studentId: string) => {
    // Check if already checked in
    if (attendees.find(a => a.studentId === studentId)) {
      toast({
        title: "Already Checked In",
        description: `Student ${studentId} is already marked as present.`,
        variant: "destructive",
      });
      return;
    }

    // Check if student exists in database
    const studentInfo = mockStudentDB[studentId];
    if (!studentInfo) {
      toast({
        title: "Student Not Found",
        description: `No student found with ID ${studentId}.`,
        variant: "destructive",
      });
      return;
    }

    const newAttendee: Attendee = {
      id: Date.now().toString(),
      name: studentInfo.name,
      studentId: studentId,
      department: studentInfo.department,
      checkInTime: new Date().toLocaleTimeString(),
    };

    setAttendees(prev => [...prev, newAttendee]);
    toast({
      title: "Attendance Recorded",
      description: `${studentInfo.name} has been marked as present.`,
    });
  };

  const handleManualEntry = () => {
    if (manualId.trim()) {
      addAttendee(manualId.trim());
      setManualId('');
    }
  };

  const startScanning = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please use manual entry.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const exportAttendance = () => {
    const csvContent = [
      ['Name', 'Student ID', 'Department', 'Check-in Time'],
      ...attendees.map(a => [a.name, a.studentId, a.department, a.checkInTime])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-event-${eventId}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Attendance Exported",
      description: "Attendance list has been downloaded as CSV file.",
    });
  };

  // Simulate QR code detection (in real app, you'd use a QR code library)
  const simulateQRScan = () => {
    const randomStudentIds = Object.keys(mockStudentDB);
    const randomId = randomStudentIds[Math.floor(Math.random() * randomStudentIds.length)];
    addAttendee(randomId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Attendance Scanner
          </CardTitle>
          <CardDescription>
            Scan student IDs or enter manually to record attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scanner Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">QR Code Scanner</h3>
              {!isScanning ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Scan className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Click to start scanning student IDs</p>
                  <Button
                    onClick={startScanning}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    Start Scanner
                  </Button>
                  {/* Demo button for testing */}
                  <Button
                    onClick={simulateQRScan}
                    variant="outline"
                    className="ml-2 border-red-200 text-red-600"
                  >
                    Simulate Scan (Demo)
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-48 bg-black rounded-lg"
                  />
                  <Button
                    onClick={stopScanning}
                    variant="outline"
                    className="w-full"
                  >
                    Stop Scanner
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Manual Entry</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Enter Student ID"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualEntry()}
                />
                <Button
                  onClick={handleManualEntry}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  Add Attendee
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                <p className="font-medium mb-1">Demo Student IDs:</p>
                <p>20210001, 20210002, 20210003, 20210004, 20210005</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Attendance List ({attendees.length})</CardTitle>
              <CardDescription>Students who have checked in for this event</CardDescription>
            </div>
            {attendees.length > 0 && (
              <Button
                onClick={exportAttendance}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {attendees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No attendees yet. Start scanning to record attendance.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendees.map((attendee, index) => (
                <div
                  key={attendee.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium text-gray-800">{attendee.name}</p>
                      <p className="text-sm text-gray-500">
                        ID: {attendee.studentId} • {attendee.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">{attendee.checkInTime}</p>
                    <Badge className="bg-green-100 text-green-800">Present</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceScanner;
