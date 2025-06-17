import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import OtpInput from 'input-otp';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [otpCode, setOtpCode] = useState('');

  const handleVerifyOTP = () => {
    if (otpCode === '123456') {
      toast({
        title: "OTP Verified Successfully!",
        description: "Welcome to AURAK Event Management Platform",
      });
      
      // Navigate to user dashboard instead of events
      navigate('/dashboard');
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center py-8">
      <Card className="max-w-md w-full shadow-xl border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Verify OTP</CardTitle>
          <CardDescription className="text-red-100 text-lg text-center">
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600">Please enter the verification code we sent to your email address.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">OTP Code</label>
              <div className="mt-1">
                <OtpInput
                  numInputs={6}
                  value={otpCode}
                  onChange={setOtpCode}
                  separator=""
                  inputStyle="w-12 h-12 rounded-md border border-gray-300 focus:ring focus:ring-red-200 focus:border-red-300 text-center text-lg font-semibold"
                  containerStyle="flex justify-center space-x-3"
                />
              </div>
            </div>
            <div>
              <Button
                onClick={handleVerifyOTP}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Verify OTP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;
