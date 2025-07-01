
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Footer: React.FC = () => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const { data: siteSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const getSettingValue = (key: string) => {
    return siteSettings?.find(setting => setting.setting_key === key)?.setting_value || '';
  };

  return (
    <>
      <footer className="bg-white border-t border-cwcp-gray py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6">
            <Button 
              variant="link" 
              onClick={() => setTermsOpen(true)}
              className="text-cwcp-blue hover:text-cwcp-lightblue"
            >
              Terms of Use
            </Button>
            <Button 
              variant="link" 
              onClick={() => setPrivacyOpen(true)}
              className="text-cwcp-blue hover:text-cwcp-lightblue"
            >
              Privacy Policy
            </Button>
          </div>
          <p className="text-cwcp-darkgray text-sm mt-4">
            © 2025 CWCP. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Terms of Use Modal */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
          <DialogHeader className="relative">
            <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogTitle className="text-2xl font-medium text-cwcp-blue">
              Terms of Use
            </DialogTitle>
          </DialogHeader>
          <div className="prose max-w-none text-cwcp-text">
            <div className="whitespace-pre-wrap">
              {getSettingValue('terms_of_use')}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
          <DialogHeader className="relative">
            <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogTitle className="text-2xl font-medium text-cwcp-blue">
              Privacy Policy
            </DialogTitle>
          </DialogHeader>
          <div className="prose max-w-none text-cwcp-text">
            <div className="whitespace-pre-wrap">
              {getSettingValue('privacy_policy')}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
