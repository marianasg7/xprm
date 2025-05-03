
import { Subscriber } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, getInitials, formatTimeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Mail, Phone, User } from "lucide-react";

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
              <AvatarFallback className="bg-primary text-white">
                {getInitials(subscriber.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{subscriber.name}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {subscriber.nickname && <span>@{subscriber.nickname}</span>}
              </div>
            </div>
          </div>
          <Badge variant={subscriber.status === 'active' ? 'default' : 'destructive'}>
            {subscriber.status === 'active' ? 'Active' : 'Unsubscribed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{subscriber.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{subscriber.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Fansly: {subscriber.fanslyUser || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Subscribed: {formatDate(subscriber.subscriptionDate)}</span>
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
          <div className="text-xs text-muted-foreground text-right mt-2">
            Added {formatTimeAgo(subscriber.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
