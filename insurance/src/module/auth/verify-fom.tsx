"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useSessionStorage } from "@/utils/setSessionData";
import {
  LockOpenIcon as LockClosedIcon,
  ArrowLeftIcon as ArrowPathIcon,
} from "lucide-react";
import { encryptValue } from "@/utils/crypto";

export function VerifyForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { getSessionData } = useSessionStorage();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const token = getSessionData("token");
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!token) {
        router.push("/sign-up");
      }
    }, 2000);
    let timer: NodeJS.Timeout;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
      if (timer) clearInterval(timer);
    };
  }, [resendDisabled, countdown, router, token]);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const data = {
      otpValue,
      token: token.value,
    };
    try {
      const apiKey = await encryptValue(process.env.NEXT_PUBLIC_API_KEY!);
      const res = await fetch(`${process.env.BASE_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message);
      }

      router.push("/");
      toast({
        title: "OTP Verified",
        description: "Welcome 🙏.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  async function resendOTpHandler() {
    if (resendDisabled) return;

    const token = getSessionData("token");
    const data = {
      token: token.value,
    };
    try {
      const apiKey = await encryptValue(process.env.NEXT_PUBLIC_API_KEY!);
      setResendDisabled(true);
      const res = await fetch(`${process.env.BASE_URL}/api/v1/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message);
      }

      toast({
        title: "OTP Sent",
        description:
          "OTP has been sent successfully. Please wait 1 minute before requesting another.",
      });

      setCountdown(59);
      setTimeout(() => {
        setResendDisabled(false);
      }, 60000);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      setResendDisabled(false);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <CardContent>
          <form onSubmit={onSubmit} className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <LockClosedIcon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-primary">Verify OTP</h1>
                <p className="text-muted-foreground text-sm mt-2">
                  Enter the 6-digit code sent to your device
                </p>
              </div>
              <div className="my-4">
                <InputOTP
                  value={otpValue}
                  onChange={setOtpValue}
                  maxLength={6}
                  className="gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="rounded-md border-2" />
                    <InputOTPSlot index={1} className="rounded-md border-2" />
                    <InputOTPSlot index={2} className="rounded-md border-2" />
                  </InputOTPGroup>
                  <InputOTPSeparator>-</InputOTPSeparator>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="rounded-md border-2" />
                    <InputOTPSlot index={4} className="rounded-md border-2" />
                    <InputOTPSlot index={5} className="rounded-md border-2" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || otpValue.length !== 6 || !token}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-muted/50 p-4">
          <div className="w-full text-center">
            <Button
              onClick={resendOTpHandler}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              disabled={resendDisabled || !token}
            >
              {resendDisabled ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowPathIcon className="w-4 h-4" />
              )}
              {resendDisabled ? `Resend in ${countdown}s` : "Resend OTP"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
