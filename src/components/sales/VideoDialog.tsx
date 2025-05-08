
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Eye } from "lucide-react";
import { Video } from "@/types/types";

interface VideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingVideo: Video | null;
  onSave: () => void;
  newVideo: Omit<Video, "id" | "createdAt">;
  setNewVideo: React.Dispatch<React.SetStateAction<Omit<Video, "id" | "createdAt">>>;
  setEditingVideo: React.Dispatch<React.SetStateAction<Video | null>>;
}

export const VideoDialog: React.FC<VideoDialogProps> = ({
  open,
  onOpenChange,
  editingVideo,
  onSave,
  newVideo,
  setNewVideo,
  setEditingVideo
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a URL for the video preview
    const objectUrl = URL.createObjectURL(file);
    setVideoPreview(objectUrl);
    
    // Update video details based on file
    const videoData = editingVideo ? {...editingVideo} : {...newVideo};
    videoData.title = videoData.title || file.name.split('.')[0];
    videoData.url = objectUrl;
    
    if (editingVideo) {
      setEditingVideo(videoData as Video);
    } else {
      setNewVideo(videoData);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
          <DialogDescription>
            Create a new video product for sale
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-title" className="col-span-1">Title</Label>
            <Input
              id="video-title"
              className="col-span-3"
              value={editingVideo ? editingVideo.title : newVideo.title}
              onChange={(e) => editingVideo 
                ? setEditingVideo({...editingVideo, title: e.target.value})
                : setNewVideo({...newVideo, title: e.target.value})
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-description" className="col-span-1">Description</Label>
            <Textarea
              id="video-description"
              className="col-span-3"
              value={editingVideo ? editingVideo.description : newVideo.description}
              onChange={(e) => editingVideo
                ? setEditingVideo({...editingVideo, description: e.target.value})
                : setNewVideo({...newVideo, description: e.target.value})
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-price" className="col-span-1">Price ($)</Label>
            <Input
              id="video-price"
              className="col-span-3"
              type="number"
              value={editingVideo ? editingVideo.price : newVideo.price}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                editingVideo
                  ? setEditingVideo({...editingVideo, price: value})
                  : setNewVideo({...newVideo, price: value});
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-duration" className="col-span-1">Duration (min)</Label>
            <Input
              id="video-duration"
              className="col-span-3"
              type="number"
              value={editingVideo ? editingVideo.duration : newVideo.duration}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                editingVideo
                  ? setEditingVideo({...editingVideo, duration: value})
                  : setNewVideo({...newVideo, duration: value});
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="col-span-1">Video File</Label>
            <div className="col-span-3">
              <input 
                type="file" 
                ref={fileInputRef}
                accept="video/*"
                className="hidden" 
                onChange={handleFileChange}
              />
              <div className="flex flex-col gap-3">
                <Button type="button" onClick={triggerFileInput} variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Upload Video
                </Button>
                {videoPreview && (
                  <div className="mt-2">
                    <Label htmlFor="video-preview" className="mb-1">Preview</Label>
                    <div className="relative aspect-video w-full bg-slate-100 rounded-md overflow-hidden">
                      <video 
                        src={videoPreview} 
                        controls 
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                )}
                {!videoPreview && (editingVideo?.url || newVideo.url) && (
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex items-center"
                      onClick={() => window.open(editingVideo?.url || newVideo.url, '_blank')}
                    >
                      <Eye className="mr-2 h-4 w-4" /> View Current Video
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSave}>
            {editingVideo ? "Update" : "Create"} Video
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
