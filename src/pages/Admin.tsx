import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import TherapistManager from "@/components/admin/TherapistManager";
import QuizManager from "@/components/admin/QuizManager";
import AssetManager from "@/components/admin/AssetManager";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";
import ServiceCardsManager from "@/components/admin/ServiceCardsManager";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { defaultQuestions } from "@/data/defaultQuestions";
import { QuizQuestion } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useLocalStorage<QuizQuestion[]>("quizQuestions", defaultQuestions);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setIsAdmin(false);
        setChecking(false);
      }
    });

    // Then load existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      if (!existing) {
        setChecking(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Check admin role whenever session changes
  useEffect(() => {
    if (!session) return;
    setChecking(true);
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) {
        console.error("Role check failed:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
      setChecking(false);
    })();
  }, [session]);

  // Redirect to /auth if not signed in
  useEffect(() => {
    if (!checking && !session) {
      navigate("/auth", { replace: true });
    }
  }, [checking, session, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth", { replace: true });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-cwcp-lightgray">
        <AdminHeader />
        <div className="max-w-md mx-auto mt-20 p-6 text-center text-cwcp-darkgray">Loading…</div>
      </div>
    );
  }

  if (!session) {
    return null; // redirecting
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cwcp-lightgray">
        <AdminHeader onLogout={handleLogout} />
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-medium text-cwcp-blue mb-3">Admin Access Required</h2>
          <p className="text-cwcp-darkgray mb-4">
            You're signed in as <strong>{session.user.email}</strong>, but your account doesn't have admin
            privileges. Please contact an existing administrator to grant you access.
          </p>
          <Button onClick={handleLogout} variant="outline">Sign Out</Button>
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
          <div className="text-sm text-cwcp-darkgray">Signed in as {session.user.email}</div>
        </div>

        <Tabs defaultValue="therapists" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="therapists">Therapists</TabsTrigger>
            <TabsTrigger value="quiz">Quiz Questions</TabsTrigger>
            <TabsTrigger value="services">Service Cards</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="settings">Site Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="therapists">
            <TherapistManager />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizManager questions={questions} setQuestions={setQuestions} />
          </TabsContent>

          <TabsContent value="services">
            <ServiceCardsManager />
          </TabsContent>

          <TabsContent value="assets">
            <AssetManager />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
