import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from "@/config";

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();

  const email = location.state?.email || '';

  const handleVerifyOTP = async (e: React.FormEvent) => {
  e.preventDefault();

  if (otp.length !== 6) {
    toast({
      title: "Invalid OTP",
      description: "Please enter a 6-digit code.",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) throw new Error("OTP verification failed");

    const data = await response.json();

    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    setUser(data.user);

    toast({
      title: "Success!",
      description: "You have been successfully logged in.",
    });

  if (data.user.role === "admin") {
    navigate("/admin-dashboard");
  } else {
    navigate("/dashboard");
  }
  } catch (error) {
    toast({
      title: "Verification failed",
      description: "Invalid OTP. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleResendOTP = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/auth/otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    toast({
      title: "OTP Resent!",
      description: "Check your email again.",
    });
  } catch (error) {
    toast({
      title: "Resend failed",
      description: "Unable to resend OTP. Try again later.",
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-xl border-red-200">
        <CardHeader className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 mx-auto shadow-lg">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Verify Your Email</CardTitle>
          <CardDescription className="text-red-100">
            AURAK Event Management Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <p className="text-gray-600">We've sent a 6-digit verification code to</p>
            <p className="text-red-600 font-medium mt-1">{email}</p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map(index => (
                    <InputOTPSlot key={index} index={index} className="border-red-200 focus:border-red-500" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 transition-colors duration-200"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <button onClick={handleResendOTP} className="text-red-600 hover:text-red-700 text-sm font-medium underline">
                Didn't receive the code? Resend OTP
              </button>
            </div>
            <div className="text-center">
              <button onClick={() => navigate('/login')} className="inline-flex items-center text-gray-600 hover:text-gray-700 text-sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;
