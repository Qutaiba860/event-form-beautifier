
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { KeyRound } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const email = location.state?.email || '';

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // For demo purposes, accept any 6-digit OTP for valid emails
      if (email === 'user@aurak.ac.ae' || email === 'admin@aurak.ac.ae') {
        await login(email, 'dummy_password');
        toast({
          title: "Login Successful!",
          description: "Welcome to AURAK Event Management Platform.",
        });
        navigate('/user-page');
      } else {
        throw new Error('Invalid email');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please try again with a valid AURAK email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    toast({
      title: "OTP Resent!",
      description: "A new verification code has been sent to your email.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-xl border-red-200">
        <CardHeader className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 mx-auto shadow-lg">
            <KeyRound className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Enter Verification Code</CardTitle>
          <CardDescription className="text-red-100">
            We've sent a 6-digit code to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="border-red-200 focus:border-red-500" />
                  <InputOTPSlot index={1} className="border-red-200 focus:border-red-500" />
                  <InputOTPSlot index={2} className="border-red-200 focus:border-red-500" />
                  <InputOTPSlot index={3} className="border-red-200 focus:border-red-500" />
                  <InputOTPSlot index={4} className="border-red-200 focus:border-red-500" />
                  <InputOTPSlot index={5} className="border-red-200 focus:border-red-500" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <Button 
              onClick={handleVerifyOTP}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 transition-colors duration-200"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Login"}
            </Button>
            
            <div className="text-center">
              <button
                onClick={handleResendOTP}
                className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200"
              >
                Didn't receive the code? Resend OTP
              </button>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2 font-medium">Demo Accounts:</p>
            <p className="text-xs text-gray-500">• user@aurak.ac.ae (Normal User)</p>
            <p className="text-xs text-gray-500">• admin@aurak.ac.ae (Admin)</p>
            <p className="text-xs text-gray-500 mt-2">Use any 6-digit code to login</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;
