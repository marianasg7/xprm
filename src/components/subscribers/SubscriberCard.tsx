
import { Subscriber } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Circle } from "lucide-react";

interface SubscriberCardProps {
  subscriber: Subscriber;
  onClick: () => void;
}

export default function SubscriberCard({ subscriber, onClick }: SubscriberCardProps) {
  // Create a color mapping for different fetish types
  const getFetishColor = (fetish: string | undefined) => {
    if (!fetish) return "bg-gray-100 text-gray-500";
    
    const fetishColors: {[key: string]: string} = {
      "foot": "bg-blue-100 text-blue-700",
      "leather": "bg-amber-100 text-amber-800",
      "bdsm": "bg-purple-100 text-purple-700",
      "latex": "bg-pink-100 text-pink-700",
      "pee": "bg-yellow-100 text-yellow-700",
      "findom": "bg-green-100 text-green-700",
      "roleplay": "bg-indigo-100 text-indigo-700",
      "sph": "bg-orange-100 text-orange-700",
      "nylon": "bg-teal-100 text-teal-700"
    };
    
    // Try to match the fetish to our predefined colors
    const lowerFetish = fetish.toLowerCase();
    for (const [key, value] of Object.entries(fetishColors)) {
      if (lowerFetish.includes(key)) {
        return value;
      }
    }
    
    // Default color if no match found
    return "bg-violet-100 text-violet-700";
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              {subscriber.photoUrl ? (
                <AvatarImage src={subscriber.photoUrl} alt={subscriber.name} />
              ) : (
                <AvatarFallback className="bg-primary text-white">
                  {getInitials(subscriber.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {subscriber.nickname || subscriber.name}
                {subscriber.interestedInCasting && (
                  <Camera className="h-4 w-4 inline ml-2 text-amber-500" />
                )}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {subscriber.fanslyUser && <span>@{subscriber.fanslyUser}</span>}
              </div>
            </div>
          </div>
          {subscriber.status === 'active' ? (
            <Circle className="h-3 w-3 text-green-500 fill-green-500" />
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Size:</span>
            <span>{subscriber.size || 'N/A'}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Fetish:</span>
            {subscriber.fetish ? (
              <Badge 
                variant="outline" 
                className={`${getFetishColor(subscriber.fetish)} border-0`}
              >
                {subscriber.fetish}
              </Badge>
            ) : (
              <span>N/A</span>
            )}
          </div>
          
          <div className="mt-2">
            <div className="text-xs text-muted-foreground">Plan:</div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{subscriber.plan}</span>
              <Badge variant="outline">{subscriber.planDuration} months</Badge>
            </div>
          </div>
          {subscriber.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {subscriber.tags.map(tag => (
                <Badge key={tag.id} variant="outline" className="bg-primary-light">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
