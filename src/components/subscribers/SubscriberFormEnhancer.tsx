
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSubscribers } from "@/context/SubscriberContext";

interface SubscriberFormEnhancerProps {
  subscriberId?: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

export function SubscriberFormEnhancer({ 
  subscriberId, 
  formValues, 
  setFormValues 
}: SubscriberFormEnhancerProps) {
  const { subscribers } = useSubscribers();
  
  const subscriber = subscriberId 
    ? subscribers.find(s => s.id === subscriberId) 
    : undefined;
  
  const isInterestedInCasting = subscriber 
    ? subscriber.interestedInCasting 
    : formValues?.interestedInCasting || false;
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormValues((prev: any) => ({
      ...prev,
      interestedInCasting: checked,
    }));
  };
  
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Checkbox 
        id="interested-in-casting"
        checked={isInterestedInCasting}
        onCheckedChange={handleCheckboxChange}
      />
      <Label 
        htmlFor="interested-in-casting"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Interested in participating in castings
      </Label>
    </div>
  );
}
