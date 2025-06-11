
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import TherapistManager from "@/components/admin/TherapistManager";
import QuizManager from "@/components/admin/QuizManager";
import AssetManager from "@/components/admin/AssetManager";
import TwoFactorSetup from "@/components/admin/TwoFactorSetup";
import TwoFactorVerification from "@/components/admin/TwoFactorVerification";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { defaultQuestions } from "@/data/defaultQuestions";
import { QuizQuestion } from "@/types";
import { Shield } from "lucide-react";

const Admin: React.FC = () => {
  // Load quiz questions from localStorage or use defaults
  const [questions, setQuestions] = useLocalStorage<QuizQuestion[]>("quizQuestions", defaultQuestions);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("cms_authenticated") === "true"
  );
  const [twoFactorSecret, setTwoFactorSecret] = useLocalStorage<string | null>("admin_2fa_secret", null);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [showTwoFactorVerification, setShowTwoFactorVerification] = useState(false);
  const [pendingLogin, setPendingLogin] = useState(false);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in a real app, use a proper authentication system
    if (username === "admin" && password === "cwcp2025") {
      if (twoFactorSecret) {
        // 2FA is enabled, show verification
        setPendingLogin(true);
        setShowTwoFactorVerification(true);
      } else {
        // No 2FA, login directly
        setIsAuthenticated(true);
        localStorage.setItem("cms_authenticated", "true");
        toast.success("Successfully logged in");
      }
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleTwoFactorSetupComplete = (secret: string) => {
    setTwoFactorSecret(secret);
    setShowTwoFactorSetup(false);
    toast.success("Two-factor authentication has been enabled for your account");
  };

  const handleTwoFactorVerificationSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("cms_authenticated", "true");
    setShowTwoFactorVerification(false);
    setPendingLogin(false);
    toast.success("Successfully logged in with 2FA");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("cms_authenticated");
    toast.success("Logged out successfully");
  };

  const handleDisable2FA = () => {
    setTwoFactorSecret(null);
    toast.success("Two-factor authentication has been disabled");
  };

  const handleCancel2FA = () => {
    setShowTwoFactorSetup(false);
    setShowTwoFactorVerification(false);
    setPendingLogin(false);
    setUsername("");
    setPassword("");
  };

  if (showTwoFactorSetup) {
    return (
      <div className="min-h-screen bg-cwcp-lightgray">
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <TwoFactorSetup
            onSetupComplete={handleTwoFactorSetupComplete}
            onCancel={handleCancel2FA}
          />
        </div>
      </div>
    );
  }

  if (showTwoFactorVerification) {
    return (
      <div className="min-h-screen bg-cwcp-lightgray">
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <TwoFactorVerification
            secret={twoFactorSecret!}
            onVerificationSuccess={handleTwoFactorVerificationSuccess}
            onCancel={handleCancel2FA}
          />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cwcp-lightgray">
        <AdminHeader />
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-medium text-cwcp-blue mb-6">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-cwcp-darkgray mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-cwcp-gray rounded"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-cwcp-darkgray mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-cwcp-gray rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cwcp-blue hover:bg-cwcp-lightblue text-white py-2 rounded transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cwcp-lightgray">
      <AdminHeader onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-medium text-cwcp-blue">CWCP Admin Dashboard</h1>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-cwcp-darkgray">
              <Shield size={16} />
              <span>2FA: {twoFactorSecret ? "Enabled" : "Disabled"}</span>
            </div>
            {twoFactorSecret ? (
              <Button
                onClick={handleDisable2FA}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Disable 2FA
              </Button>
            ) : (
              <Button
                onClick={() => setShowTwoFactorSetup(true)}
                variant="outline"
                size="sm"
                className="border-cwcp-blue text-cwcp-blue hover:bg-blue-50"
              >
                Enable 2FA
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="therapists" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="therapists">Therapists</TabsTrigger>
            <TabsTrigger value="quiz">Quiz Questions</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="therapists">
            <TherapistManager />
          </TabsContent>
          
          <TabsContent value="quiz">
            <QuizManager 
              questions={questions} 
              setQuestions={setQuestions} 
            />
          </TabsContent>
          
          <TabsContent value="assets">
            <AssetManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
