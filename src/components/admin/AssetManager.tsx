
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Copy, Trash2, Image, Upload } from "lucide-react";

const AssetManager: React.FC = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);

  const handleUpload = () => {
    toast.success("Asset upload feature requires Supabase integration");
    setIsUploadDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-cwcp-blue">
          Assets ({assets.length})
        </h2>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Upload Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Asset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Select File</Label>
                <Input
                  type="file"
                  id="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </div>
              
              <div>
                <Label htmlFor="path">File Name (optional)</Label>
                <Input
                  id="path"
                  placeholder="Leave empty to use original name"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-6 rounded-lg text-center">
        <Upload className="w-12 h-12 text-cwcp-darkgray mx-auto mb-4" />
        <p className="text-cwcp-darkgray mb-4">
          Asset management requires Supabase integration for file storage.
        </p>
        <p className="text-sm text-cwcp-darkgray">
          Connect Supabase to enable file uploads and management.
        </p>
      </div>
    </div>
  );
};

export default AssetManager;
