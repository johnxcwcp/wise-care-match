
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SiteSettingsManager: React.FC = () => {
  const [termsOfUse, setTermsOfUse] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const queryClient = useQueryClient();

  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  // Use useEffect instead of onSuccess
  useEffect(() => {
    if (siteSettings) {
      const terms = siteSettings.find(setting => setting.setting_key === 'terms_of_use');
      const privacy = siteSettings.find(setting => setting.setting_key === 'privacy_policy');
      
      if (terms) setTermsOfUse(terms.setting_value || '');
      if (privacy) setPrivacyPolicy(privacy.setting_value || '');
    }
  }, [siteSettings]);

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq('setting_key', key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error('Error updating settings');
    }
  });

  const handleSaveTerms = () => {
    updateSettingMutation.mutate({ key: 'terms_of_use', value: termsOfUse });
  };

  const handleSavePrivacy = () => {
    updateSettingMutation.mutate({ key: 'privacy_policy', value: privacyPolicy });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium text-cwcp-blue">Site Settings</h2>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Terms of Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="terms">Terms of Use Content</Label>
              <Textarea
                id="terms"
                value={termsOfUse}
                onChange={(e) => setTermsOfUse(e.target.value)}
                placeholder="Enter your Terms of Use content..."
                className="min-h-[200px]"
              />
            </div>
            <Button 
              onClick={handleSaveTerms}
              disabled={updateSettingMutation.isPending}
              className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white"
            >
              {updateSettingMutation.isPending ? 'Saving...' : 'Save Terms of Use'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="privacy">Privacy Policy Content</Label>
              <Textarea
                id="privacy"
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                placeholder="Enter your Privacy Policy content..."
                className="min-h-[200px]"
              />
            </div>
            <Button 
              onClick={handleSavePrivacy}
              disabled={updateSettingMutation.isPending}
              className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white"
            >
              {updateSettingMutation.isPending ? 'Saving...' : 'Save Privacy Policy'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
