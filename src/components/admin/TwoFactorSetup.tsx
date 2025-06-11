
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TOTP, Secret } from "otpauth";

interface TwoFactorSetupProps {
  onSetupComplete: (secret: string) => void;
  onCancel: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onSetupComplete, onCancel }) => {
  const [secret, setSecret] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Generate a new secret
    const newSecret = new Secret();
    const secretString = newSecret.base32;
    setSecret(secretString);

    // Create TOTP instance
    const totp = new TOTP({
      issuer: "CWCP Admin",
      label: "admin",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: newSecret,
    });

    // Generate QR code URL
    const qrUrl = totp.toString();
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`);
  }, []);

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

      const isValid = totp.validate({ token: verificationCode, window: 1 });
      
      if (isValid !== null) {
        toast.success("2FA setup completed successfully!");
        onSetupComplete(secret);
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      toast.error("Error verifying code. Please try again.");
    }
    
    setIsVerifying(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-medium text-cwcp-blue mb-4">Set up Two-Factor Authentication</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-cwcp-darkgray mb-3">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </p>
          <div className="flex justify-center">
            <img src={qrCodeUrl} alt="2FA QR Code" className="border border-cwcp-gray rounded" />
          </div>
        </div>
        
        <div>
          <p className="text-sm text-cwcp-darkgray mb-2">
            Or manually enter this secret key:
          </p>
          <code className="block p-2 bg-cwcp-lightgray rounded text-xs font-mono break-all">
            {secret}
          </code>
        </div>
        
        <div>
          <label className="block text-cwcp-darkgray mb-2">
            Enter verification code from your app:
          </label>
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="text-center font-mono text-lg"
          />
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleVerifyCode}
            disabled={verificationCode.length !== 6 || isVerifying}
            className="flex-1 bg-cwcp-blue hover:bg-cwcp-lightblue text-white"
          >
            {isVerifying ? "Verifying..." : "Verify & Enable 2FA"}
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

export default TwoFactorSetup;
