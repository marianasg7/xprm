
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CastingParticipationToggle } from "./CastingParticipationToggle";
import { Subscriber } from "@/types/types";

interface SubscriberInterestedInCastingProps {
  subscriber: Subscriber;
}

export function SubscriberInterestedInCasting({ subscriber }: SubscriberInterestedInCastingProps) {
  // Only show for active subscribers
  if (subscriber.status !== "active") {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Casting Participation</CardTitle>
      </CardHeader>
      <CardContent>
        <CastingParticipationToggle subscriber={subscriber} />
        <p className="text-sm text-muted-foreground mt-2">
          Enable this option to include this subscriber in casting opportunities.
        </p>
      </CardContent>
    </Card>
  );
}
