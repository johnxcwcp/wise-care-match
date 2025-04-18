
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import TherapistManager from "@/components/admin/TherapistManager";
import QuizManager from "@/components/admin/QuizManager";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { defaultQuestions } from "@/data/defaultQuestions";
import { QuizQuestion } from "@/types";

const Admin: React.FC = () => {
  // Load quiz questions from localStorage or use defaults
  const [questions, setQuestions] = useLocalStorage<QuizQuestion[]>("quizQuestions", defaultQuestions);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("cms_authenticated") === "true"
  );
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in a real app, use a proper authentication system
    if (username === "admin" && password === "cwcp2025") {
      setIsAuthenticated(true);
      localStorage.setItem("cms_authenticated", "true");
      toast.success("Successfully logged in");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("cms_authenticated");
    toast.success("Logged out successfully");
  };

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
        <h1 className="text-3xl font-medium text-cwcp-blue mb-8">CWCP Admin Dashboard</h1>
        
        <Tabs defaultValue="therapists" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="therapists">Therapists</TabsTrigger>
            <TabsTrigger value="quiz">Quiz Questions</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
