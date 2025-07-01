import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SiteSettingsManager: React.FC = () => {
  const [termsOfUse, setTermsOfUse] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [noMatchesMessage, setNoMatchesMessage] = useState("");
  const [otherMatchesMessage, setOtherMatchesMessage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoImageUrl, setSeoImageUrl] = useState("");
  const [mainHeading, setMainHeading] = useState("");
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

  useEffect(() => {
    if (siteSettings) {
      const terms = siteSettings.find(setting => setting.setting_key === 'terms_of_use');
      const privacy = siteSettings.find(setting => setting.setting_key === 'privacy_policy');
      const noMatches = siteSettings.find(setting => setting.setting_key === 'no_matches_message');
      const otherMatches = siteSettings.find(setting => setting.setting_key === 'other_matches_message');
      const seoTitleSetting = siteSettings.find(setting => setting.setting_key === 'seo_title');
      const seoDescSetting = siteSettings.find(setting => setting.setting_key === 'seo_description');
      const seoImageSetting = siteSettings.find(setting => setting.setting_key === 'seo_image_url');
      const mainHeadingSetting = siteSettings.find(setting => setting.setting_key === 'main_heading');
      
      if (terms) setTermsOfUse(terms.setting_value || '');
      if (privacy) setPrivacyPolicy(privacy.setting_value || '');
      if (noMatches) setNoMatchesMessage(noMatches.setting_value || '');
      if (otherMatches) setOtherMatchesMessage(otherMatches.setting_value || '');
      if (seoTitleSetting) setSeoTitle(seoTitleSetting.setting_value || '');
      if (seoDescSetting) setSeoDescription(seoDescSetting.setting_value || '');
      if (seoImageSetting) setSeoImageUrl(seoImageSetting.setting_value || '');
      if (mainHeadingSetting) setMainHeading(mainHeadingSetting.setting_value || '');
    }
  }, [siteSettings]);

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
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

  const handleSaveNoMatches = () => {
    updateSettingMutation.mutate({ key: 'no_matches_message', value: noMatchesMessage });
  };

  const handleSaveOtherMatches = () => {
    updateSettingMutation.mutate({ key: 'other_matches_message', value: otherMatchesMessage });
  };

  const handleSaveSeoTitle = () => {
    updateSettingMutation.mutate({ key: 'seo_title', value: seoTitle });
  };

  const handleSaveSeoDescription = () => {
    updateSettingMutation.mutate({ key: 'seo_description', value: seoDescription });
  };

  const handleSaveSeoImage = () => {
    updateSettingMutation.mutate({ key: 'seo_image_url', value: seoImageUrl });
  };

  const handleSaveMainHeading = () => {
    updateSettingMutation.mutate({ key: 'main_heading', value: mainHeading });
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
            <CardTitle>Main Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="mainHeading">Main Page Heading</Label>
              <Input
                id="mainHeading"
                value={mainHeading}
                onChange={(e) => setMainHeading(e.target.value)}
                placeholder="Enter the main heading for the homepage..."
              />
              <Button 
                onClick={handleSaveMainHeading}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save Heading'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="seoTitle">Page Title</Label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Enter the page title for search engines..."
              />
              <Button 
                onClick={handleSaveSeoTitle}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save Title'}
              </Button>
            </div>
            
            <div>
              <Label htmlFor="seoDescription">Meta Description</Label>
              <Textarea
                id="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Enter the meta description for search engines..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleSaveSeoDescription}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save Description'}
              </Button>
            </div>
            
            <div>
              <Label htmlFor="seoImage">Link Preview Image URL</Label>
              <Input
                id="seoImage"
                value={seoImageUrl}
                onChange={(e) => setSeoImageUrl(e.target.value)}
                placeholder="Enter the URL for the link preview image..."
              />
              <Button 
                onClick={handleSaveSeoImage}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save Image URL'}
              </Button>
            </div>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle>Quiz Results Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="noMatches">No Perfect Matches Message</Label>
              <Textarea
                id="noMatches"
                value={noMatchesMessage}
                onChange={(e) => setNoMatchesMessage(e.target.value)}
                placeholder="Message to display when no perfect matches are found..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleSaveNoMatches}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save No Matches Message'}
              </Button>
            </div>
            
            <div>
              <Label htmlFor="otherMatches">Other Matches Message</Label>
              <Textarea
                id="otherMatches"
                value={otherMatchesMessage}
                onChange={(e) => setOtherMatchesMessage(e.target.value)}
                placeholder="Message to display for other potential matches..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleSaveOtherMatches}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save Other Matches Message'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
