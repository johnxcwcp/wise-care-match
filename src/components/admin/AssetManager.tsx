
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Copy, Trash2, Image, Upload, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Asset {
  id: string;
  name: string;
  size: number;
  created_at: string;
  public_url: string;
}

const AssetManager: React.FC = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFileName, setCustomFileName] = useState("");

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('assets')
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Error loading assets:', error);
        toast.error('Failed to load assets');
        return;
      }

      const assetsWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('assets')
            .getPublicUrl(file.name);

          return {
            id: file.id || file.name,
            name: file.name,
            size: file.metadata?.size || 0,
            created_at: file.created_at || '',
            public_url: publicUrl
          };
        })
      );

      setAssets(assetsWithUrls);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('Failed to load assets');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    
    try {
      const fileName = customFileName.trim() || selectedFile.name;
      
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error(`Upload failed: ${error.message}`);
        return;
      }

      toast.success('Asset uploaded successfully');
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setCustomFileName("");
      loadAssets(); // Reload the assets list
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('assets')
        .remove([fileName]);

      if (error) {
        console.error('Delete error:', error);
        toast.error(`Delete failed: ${error.message}`);
        return;
      }

      toast.success('Asset deleted successfully');
      loadAssets(); // Reload the assets list
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete failed');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
              
              <div>
                <Label htmlFor="path">File Name (optional)</Label>
                <Input
                  id="path"
                  placeholder="Leave empty to use original name"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={isLoading || !selectedFile}>
                  {isLoading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white p-6 rounded-lg text-center">
          <Upload className="w-12 h-12 text-cwcp-darkgray mx-auto mb-4" />
          <p className="text-cwcp-darkgray mb-4">
            No assets uploaded yet.
          </p>
          <p className="text-sm text-cwcp-darkgray">
            Upload your first asset using the button above.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-cwcp-gray">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cwcp-lightgray border-b border-cwcp-gray">
                <tr>
                  <th className="text-left p-4 font-medium text-cwcp-darkgray">Name</th>
                  <th className="text-left p-4 font-medium text-cwcp-darkgray">Size</th>
                  <th className="text-left p-4 font-medium text-cwcp-darkgray">Uploaded</th>
                  <th className="text-right p-4 font-medium text-cwcp-darkgray">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-b border-cwcp-gray hover:bg-cwcp-lightgray/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image className="w-5 h-5 text-cwcp-darkgray" />
                        <span className="font-medium">{asset.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-cwcp-darkgray">
                      {formatFileSize(asset.size)}
                    </td>
                    <td className="p-4 text-cwcp-darkgray">
                      {asset.created_at ? new Date(asset.created_at).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(asset.public_url)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(asset.public_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(asset.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManager;
