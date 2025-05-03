
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSubscribers } from "@/context/SubscriberContext";
import { Subscriber } from "@/types/types";

interface CastingParticipationToggleProps {
  subscriber: Subscriber;
}

export function CastingParticipationToggle({ subscriber }: CastingParticipationToggleProps) {
  const { updateSubscriber } = useSubscribers();

  const handleToggleChange = (checked: boolean) => {
    updateSubscriber(subscriber.id, { interestedInCasting: checked });
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <Switch 
        id="casting-interest"
        checked={subscriber.interestedInCasting}
        onCheckedChange={handleToggleChange}
      />
      <Label htmlFor="casting-interest">
        Interested in participating in castings
      </Label>
    </div>
  );
}
