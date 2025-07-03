
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { apiService, Document } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar, Plus, Filter, Check, X, Users, Clock, Eye, 
  FileText, File, FileSpreadsheet, FileImage, Upload 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const documentInputRef = useRef<HTMLInputElement>(null);

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [userRole] = useState<'admin' | 'user'>('user');

  const privilegedEmails = [
    "2023005883@aurak.ac.ae",
    "Imad.hoballah@aurak.ac.ae",
    "qutaiba.raid@gmail.com"
  ];

  useEffect(() => {
    if (isLoading) return;
    async function fetchEvents() {
      try {
        const data = await apiService.getEvents();
        const currentEmail = user?.email || "";
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
  }, [user, isLoading]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const documents = await apiService.getDocuments();
      setUploadedDocuments(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleCreateEvent = () => {
    navigate('/events');
  };

  const handleViewEvent = (eventId: number) => {
    navigate(`/event-details/${eventId}`);
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const documentData = {
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
            size: file.size,
            uploaded_by: user?.id || 1,
            created_at: new Date().toISOString()
          };
          
          // Save to database
          const savedDocument = await apiService.createDocument(documentData);
          return savedDocument;
        });

        const savedDocuments = await Promise.all(uploadPromises);
        setUploadedDocuments(prev => [...prev, ...savedDocuments]);
        
        toast({
          title: "Documents Uploaded",
          description: `${files.length} document(s) uploaded successfully.`
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload documents.",
          variant: "destructive"
        });
      }
    }
  };

  const handleRemoveDocument = async (id: number) => {
    try {
      await apiService.deleteDocument(id);
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
      toast({
        title: "Document Removed",
        description: "Document removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove document.",
        variant: "destructive"
      });
    }
  };

  const getDocumentIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="w-4 h-4 text-blue-500" />;
    if (type.includes('presentation') || type.includes('powerpoint')) return <FileImage className="w-4 h-4 text-orange-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      <div className="max-w-6xl mx-auto space-y-8">
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

        {/* Document Upload Section */}
        <Card className="shadow-xl border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center">
              <FileText className="w-6 h-6 mr-2" /> Document Management
            </CardTitle>
            <CardDescription className="text-red-100">Upload and manage your documents</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="border-2 border-dashed border-red-200 rounded-lg p-6 text-center">
              <FileText className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-4">Drop documents here or click to upload</p>
              <p className="text-sm text-gray-500 mb-4">Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT</p>
              <Button onClick={() => documentInputRef.current?.click()} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" /> Add Documents
              </Button>
              <input 
                ref={documentInputRef} 
                type="file" 
                multiple 
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" 
                onChange={handleDocumentUpload} 
                className="hidden" 
              />
            </div>

            {uploadedDocuments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Documents ({uploadedDocuments.length}):</h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {uploadedDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(document.type)}
                        <div>
                          <span className="text-sm font-medium truncate block max-w-xs">{document.name}</span>
                          <span className="text-xs text-gray-500">{formatFileSize(document.size)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => window.open(document.url)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRemoveDocument(document.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
