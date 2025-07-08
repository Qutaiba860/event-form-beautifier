import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, IdCard } from 'lucide-react';
import { API_BASE_URL } from '@/config';
import { useParams } from "react-router-dom";

const guestFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  affiliation: z.enum(['faculty', 'student', 'staff', 'external'], {
    required_error: 'Please select your affiliation',
  }),
  aurakId: z.string().optional(),
  department: z.string().optional(),
  organization: z.string().optional(),
  position: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  specialRequests: z.string().optional(),
}).refine((data) => {
  if (data.affiliation !== 'external' && !data.aurakId) {
    return false;
  }
  return true;
}, {
  message: "AURAK ID is required for faculty, students, and staff",
  path: ["aurakId"],
});

type GuestFormData = z.infer<typeof guestFormSchema>;

const GuestInvitationForm = () => {
  const { toast } = useToast();
  const { eventId } = useParams<{ eventId: string }>();
  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      affiliation: undefined,
      aurakId: '',
      department: '',
      organization: '',
      position: '',
      dietaryRestrictions: '',
      specialRequests: '',
    },
  });

  const watchedAffiliation = form.watch('affiliation');
  const isAurakAffiliated = watchedAffiliation && watchedAffiliation !== 'external';

  const onSubmit = async (data: GuestFormData) => {
        try {
    if (!eventId) {
        toast({
        title: "Invalid Link",
        description: "This registration link is missing the event ID.",
        variant: "destructive",
        });
        return;
    }

    const payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone_number: data.phoneNumber,
    affiliation: data.affiliation,
    aurak_id: data.aurakId,
    department: data.department,
    organization: data.organization,
    position: data.position,
    dietary_restrictions: data.dietaryRestrictions,
    special_requests: data.specialRequests,
    event: eventId,
    };

    const response = await fetch(`${API_BASE_URL}/api/attendance/register/`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
  console.log(await response.text());
  throw new Error("Failed to register guest");
}

    const result = await response.json();

    toast({
        title: "Registration Successful",
        description: `Your unique barcode is: ${result.barcode}`,
    });

    form.reset();
    } catch (error) {
    console.error("Error submitting guest form:", error);
    toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
    });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Guest Invitation Form
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Please fill in your details to register for the event
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Affiliation Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Affiliation
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="affiliation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Are you AURAK Faculty, Student, or Staff? *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="faculty" id="faculty" />
                              <Label htmlFor="faculty">Faculty</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="student" id="student" />
                              <Label htmlFor="student">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="staff" id="staff" />
                              <Label htmlFor="staff">Staff</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="external" id="external" />
                              <Label htmlFor="external">External Guest</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isAurakAffiliated && (
                    <FormField
                      control={form.control}
                      name="aurakId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <IdCard className="w-4 h-4" />
                            AURAK ID *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your AURAK ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department/School</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your department or school" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedAffiliation === 'external' && (
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your organization" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position/Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your position or title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Additional Information
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dietary Restrictions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please specify any dietary restrictions or allergies"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests or Accessibility Needs</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please specify any special requests or accessibility needs"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Registering...' : 'Register for Event'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestInvitationForm;