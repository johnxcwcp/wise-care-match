
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TOTP, Secret } from "otpauth";

interface TwoFactorVerificationProps {
  secret: string;
  onVerificationSuccess: () => void;
  onCancel: () => void;
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({
  secret,
  onVerificationSuccess,
  onCancel,
}) => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyCode = () => {
    setIsVerifying(true);
    
    try {
      const totp = new TOTP({
        issuer: "CWCP Admin",
        label: "admin",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: Secret.fromBase32(secret),
      });

      console.log("Debug - Login verification:");
      console.log("- Entered code:", verificationCode);
      console.log("- Secret (first 10 chars):", secret.substring(0, 10) + "...");
      console.log("- Current timestamp:", Math.floor(Date.now() / 1000));
      console.log("- Current TOTP period:", Math.floor(Date.now() / 1000 / 30));
      
      // Generate current expected token for debugging
      const expectedToken = totp.generate();
      console.log("- Expected token:", expectedToken);

      // Increase window to 2 (allows ±2 time steps = ±60 seconds)
      const isValid = totp.validate({ token: verificationCode, window: 2 });
      console.log("- Validation result:", isValid);
      
      if (isValid !== null) {
        console.log("✅ 2FA login verification successful");
        toast.success("2FA verification successful!");
        onVerificationSuccess();
      } else {
        console.log("❌ 2FA login verification failed");
        toast.error(`Invalid verification code. Expected: ${expectedToken}, Got: ${verificationCode}`);
        setVerificationCode("");
      }
    } catch (error) {
      console.error("2FA login verification error:", error);
      toast.error("Error verifying code. Please try again.");
      setVerificationCode("");
    }
    
    setIsVerifying(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-medium text-cwcp-blue mb-4">Two-Factor Authentication</h3>
      
      <div className="space-y-4">
        <p className="text-cwcp-darkgray">
          Enter the 6-digit code from your authenticator app:
        </p>
        
        <div>
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            maxLength={6}
            className="text-center font-mono text-lg"
            autoFocus
          />
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleVerifyCode}
            disabled={verificationCode.length !== 6 || isVerifying}
            className="flex-1 bg-cwcp-blue hover:bg-cwcp-lightblue text-white"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-cwcp-gray text-cwcp-darkgray"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerification;
