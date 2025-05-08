
import React from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Video as VideoIcon } from "lucide-react";
import { Video } from "@/types/types";

interface VideoCardProps {
  video: Video;
  onEdit: (video: Video) => void;
  onDelete: (id: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onEdit, onDelete }) => {
  return (
    <Card key={video.id}>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="flex items-center gap-2">
            <VideoIcon className="h-4 w-4" /> {video.title}
          </CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" onClick={() => onEdit(video)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(video.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>${video.price} • {video.duration} min</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{video.description}</p>
        
        {video.url && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="mt-2 flex items-center"
            onClick={() => window.open(video.url, '_blank')}
          >
            <Eye className="mr-2 h-4 w-4" /> Preview Video
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
