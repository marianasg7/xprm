
import { Subscriber } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cast, Circle } from "lucide-react";

interface SubscriberCardProps {
  subscriber: Subscriber;
  onClick: () => void;
}

export default function SubscriberCard({ subscriber, onClick }: SubscriberCardProps) {
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
                  <Cast className="h-4 w-4 inline ml-2 text-amber-500" />
                )}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {subscriber.fanslyUser && <span>fansly: {subscriber.fanslyUser}</span>}
              </div>
            </div>
          </div>
          {subscriber.status === 'active' ? (
            <Circle className="h-3 w-3 text-green-500 fill-green-500" />
          ) : (
            <Badge variant="destructive">Unsubscribed</Badge>
          )}
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
            <span>{subscriber.fetish || 'N/A'}</span>
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
