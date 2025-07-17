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
  const [metaDescription, setMetaDescription] = useState("");
  const [seoImageUrl, setSeoImageUrl] = useState("");
  const [specialtiesDisplayCount, setSpecialtiesDisplayCount] = useState("3");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");
  const [socialTiktok, setSocialTiktok] = useState("");
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
      const metaDescSetting = siteSettings.find(setting => setting.setting_key === 'meta_description');
      const seoImageSetting = siteSettings.find(setting => setting.setting_key === 'seo_image_url');
      const specialtiesCount = siteSettings.find(setting => setting.setting_key === 'specialties_display_count');
      const facebook = siteSettings.find(setting => setting.setting_key === 'social_facebook');
      const instagram = siteSettings.find(setting => setting.setting_key === 'social_instagram');
      const youtube = siteSettings.find(setting => setting.setting_key === 'social_youtube');
      const tiktok = siteSettings.find(setting => setting.setting_key === 'social_tiktok');
      
      if (terms) setTermsOfUse(terms.setting_value || '');
      if (privacy) setPrivacyPolicy(privacy.setting_value || '');
      if (noMatches) setNoMatchesMessage(noMatches.setting_value || '');
      if (otherMatches) setOtherMatchesMessage(otherMatches.setting_value || '');
      if (seoTitleSetting) setSeoTitle(seoTitleSetting.setting_value || '');
      if (seoDescSetting) setSeoDescription(seoDescSetting.setting_value || '');
      if (metaDescSetting) setMetaDescription(metaDescSetting.setting_value || '');
      if (seoImageSetting) setSeoImageUrl(seoImageSetting.setting_value || '');
      if (specialtiesCount) setSpecialtiesDisplayCount(specialtiesCount.setting_value || '3');
      if (facebook) setSocialFacebook(facebook.setting_value || '');
      if (instagram) setSocialInstagram(instagram.setting_value || '');
      if (youtube) setSocialYoutube(youtube.setting_value || '');
      if (tiktok) setSocialTiktok(tiktok.setting_value || '');
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

  const handleSaveSpecialtiesCount = () => {
    updateSettingMutation.mutate({ key: 'specialties_display_count', value: specialtiesDisplayCount });
  };

  const handleSaveMetaDescription = () => {
    updateSettingMutation.mutate({ key: 'meta_description', value: metaDescription });
  };

  const handleSaveSocialFacebook = () => {
    updateSettingMutation.mutate({ key: 'social_facebook', value: socialFacebook });
  };

  const handleSaveSocialInstagram = () => {
    updateSettingMutation.mutate({ key: 'social_instagram', value: socialInstagram });
  };

  const handleSaveSocialYoutube = () => {
    updateSettingMutation.mutate({ key: 'social_youtube', value: socialYoutube });
  };

  const handleSaveSocialTiktok = () => {
    updateSettingMutation.mutate({ key: 'social_tiktok', value: socialTiktok });
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
            <CardTitle>Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="specialtiesCount">Number of Specialties to Display by Default</Label>
              <Input
                id="specialtiesCount"
                type="number"
                min="1"
                max="10"
                value={specialtiesDisplayCount}
                onChange={(e) => setSpecialtiesDisplayCount(e.target.value)}
                placeholder="Enter number of specialties to show..."
              />
              <Button 
                onClick={() => updateSettingMutation.mutate({ key: 'specialties_display_count', value: specialtiesDisplayCount })}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save Count'}
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
                onClick={() => updateSettingMutation.mutate({ key: 'seo_title', value: seoTitle })}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save Title'}
              </Button>
            </div>
            
            <div>
              <Label htmlFor="seoDescription">Meta Description (for SEO and social sharing)</Label>
              <Textarea
                id="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Enter the meta description for search engines and social sharing..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={() => updateSettingMutation.mutate({ key: 'seo_description', value: seoDescription })}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save SEO Description'}
              </Button>
            </div>

            <div>
              <Label htmlFor="metaDescription">Page Meta Description (for HTML meta tag)</Label>
              <Textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Enter the meta description for the HTML meta tag..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleSaveMetaDescription}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save Meta Description'}
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
                onClick={() => updateSettingMutation.mutate({ key: 'seo_image_url', value: seoImageUrl })}
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
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="socialFacebook">Facebook URL</Label>
              <Input
                id="socialFacebook"
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
                placeholder="https://www.facebook.com/cwcp.ca"
              />
              <Button 
                onClick={handleSaveSocialFacebook}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save Facebook URL'}
              </Button>
            </div>

            <div>
              <Label htmlFor="socialInstagram">Instagram URL</Label>
              <Input
                id="socialInstagram"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                placeholder="https://www.instagram.com/cwcp.ca"
              />
              <Button 
                onClick={handleSaveSocialInstagram}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save Instagram URL'}
              </Button>
            </div>

            <div>
              <Label htmlFor="socialYoutube">YouTube URL</Label>
              <Input
                id="socialYoutube"
                value={socialYoutube}
                onChange={(e) => setSocialYoutube(e.target.value)}
                placeholder="https://www.youtube.com/@cwcp"
              />
              <Button 
                onClick={handleSaveSocialYoutube}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save YouTube URL'}
              </Button>
            </div>

            <div>
              <Label htmlFor="socialTiktok">TikTok URL</Label>
              <Input
                id="socialTiktok"
                value={socialTiktok}
                onChange={(e) => setSocialTiktok(e.target.value)}
                placeholder="https://www.tiktok.com/@cwcp.ca"
              />
              <Button 
                onClick={handleSaveSocialTiktok}
                disabled={updateSettingMutation.isPending}
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
              >
                {updateSettingMutation.isPending ? 'Saving...' : 'Save TikTok URL'}
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
