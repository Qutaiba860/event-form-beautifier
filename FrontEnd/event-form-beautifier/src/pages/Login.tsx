
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { API_BASE_URL } from "@/config";
const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send OTP");
    }

    toast({
      title: "OTP Sent!",
      description: "Please check your email (console) for the verification code.",
    });

    navigate("/verify-otp", { state: { email } });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to send OTP. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-xl border-red-200">
        <CardHeader className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 mx-auto shadow-lg">
            <Mail className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">AURAK Event Management Platform</CardTitle>
          <CardDescription className="text-red-100">
            American University of Ras Al Khaimah
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@aurak.ac.ae"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-red-200 focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Enter your AURAK email to receive a verification code
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
