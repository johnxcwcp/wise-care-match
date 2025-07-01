
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SiteSettingsManager: React.FC = () => {
  const queryClient = useQueryClient();
  
  const [mainHeading, setMainHeading] = useState("");
  const [noMatchesMessage, setNoMatchesMessage] = useState("");
  const [otherMatchesMessage, setOtherMatchesMessage] = useState("");
  const [termsOfUse, setTermsOfUse] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [specialtiesDisplayCount, setSpecialtiesDisplayCount] = useState("3");

  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['siteSettings-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      data?.forEach(setting => {
        if (setting.setting_key === 'main_heading') {
          setMainHeading(setting.setting_value || '');
        } else if (setting.setting_key === 'no_matches_message') {
          setNoMatchesMessage(setting.setting_value || '');
        } else if (setting.setting_key === 'other_matches_message') {
          setOtherMatchesMessage(setting.setting_value || '');
        } else if (setting.setting_key === 'terms_of_use') {
          setTermsOfUse(setting.setting_value || '');
        } else if (setting.setting_key === 'privacy_policy') {
          setPrivacyPolicy(setting.setting_value || '');
        } else if (setting.setting_key === 'specialties_display_count') {
          setSpecialtiesDisplayCount(setting.setting_value || '3');
        }
      });
    }
  });

  React.useEffect(() => {
    if (siteSettings) {
      siteSettings.forEach(setting => {
        if (setting.setting_key === 'main_heading') {
          setMainHeading(setting.setting_value || '');
        } else if (setting.setting_key === 'no_matches_message') {
          setNoMatchesMessage(setting.setting_value || '');
        } else if (setting.setting_key === 'other_matches_message') {
          setOtherMatchesMessage(setting.setting_value || '');
        } else if (setting.setting_key === 'terms_of_use') {
          setTermsOfUse(setting.setting_value || '');
        } else if (setting.setting_key === 'privacy_policy') {
          setPrivacyPolicy(setting.setting_value || '');
        } else if (setting.setting_key === 'specialties_display_count') {
          setSpecialtiesDisplayCount(setting.setting_value || '3');
        }
      });
    }
  }, [siteSettings]);

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          setting_key: key, 
          setting_value: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Setting updated successfully');
      queryClient.invalidateQueries({ queryKey: ['siteSettings-admin'] });
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
    onError: (error) => {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    }
  });

  const handleSaveSetting = (key: string, value: string) => {
    updateSetting.mutate({ key, value });
  };

  if (isLoading) {
    return <div>Loading site settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Main Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mainHeading">Main Heading</Label>
            <Input
              id="mainHeading"
              value={mainHeading}
              onChange={(e) => setMainHeading(e.target.value)}
              placeholder="Enter main heading text"
            />
            <Button 
              onClick={() => handleSaveSetting('main_heading', mainHeading)}
              className="mt-2"
              disabled={updateSetting.isPending}
            >
              Save Main Heading
            </Button>
          </div>
          
          <div>
            <Label htmlFor="specialtiesDisplayCount">Number of Specialties to Display (Default)</Label>
            <Input
              id="specialtiesDisplayCount"
              type="number"
              min="1"
              max="10"
              value={specialtiesDisplayCount}
              onChange={(e) => setSpecialtiesDisplayCount(e.target.value)}
              placeholder="3"
            />
            <Button 
              onClick={() => handleSaveSetting('specialties_display_count', specialtiesDisplayCount)}
              className="mt-2"
              disabled={updateSetting.isPending}
            >
              Save Display Count
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results Page Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="noMatchesMessage">No Matches Message</Label>
            <Textarea
              id="noMatchesMessage"
              value={noMatchesMessage}
              onChange={(e) => setNoMatchesMessage(e.target.value)}
              placeholder="Message shown when no perfect matches are found"
              rows={3}
            />
            <Button 
              onClick={() => handleSaveSetting('no_matches_message', noMatchesMessage)}
              className="mt-2"
              disabled={updateSetting.isPending}
            >
              Save No Matches Message
            </Button>
          </div>

          <div>
            <Label htmlFor="otherMatchesMessage">Other Matches Message</Label>
            <Textarea
              id="otherMatchesMessage"
              value={otherMatchesMessage}
              onChange={(e) => setOtherMatchesMessage(e.target.value)}
              placeholder="Message shown for other potential matches"
              rows={3}
            />
            <Button 
              onClick={() => handleSaveSetting('other_matches_message', otherMatchesMessage)}
              className="mt-2"
              disabled={updateSetting.isPending}
            >
              Save Other Matches Message
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legal Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="termsOfUse">Terms of Use</Label>
            <Textarea
              id="termsOfUse"
              value={termsOfUse}
              onChange={(e) => setTermsOfUse(e.target.value)}
              placeholder="Enter terms of use content"
              rows={10}
            />
            <Button 
              onClick={() => handleSaveSetting('terms_of_use', termsOfUse)}
              className="mt-2"
              disabled={updateSetting.isPending}
            >
              Save Terms of Use
            </Button>
          </div>

          <div>
            <Label htmlFor="privacyPolicy">Privacy Policy</Label>
            <Textarea
              id="privacyPolicy"
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
              placeholder="Enter privacy policy content"
              rows={10}
            />
            <Button 
              onClick={() => handleSaveSetting('privacy_policy', privacyPolicy)}
              className="mt-2"
              disabled={updateSetting.isPending}
            >
              Save Privacy Policy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsManager;
