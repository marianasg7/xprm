
import React, { useEffect, useState } from "react";
import { SubscriberInterestedInCasting } from "./SubscriberInterestedInCasting";
import { useSubscribers } from "@/context/SubscriberContext";
import { Subscriber } from "@/types/types";

export function DetailViewEnhancer() {
  const [patched, setPatched] = useState(false);

  useEffect(() => {
    // This is a workaround to add our component to the details tab
    // We'll look for a specific element and append our component
    const patchDetailView = () => {
      const detailsTab = document.querySelector('[data-value="details"]');
      
      if (detailsTab && !patched) {
        // Find the subscriber ID from the URL or another source
        const urlParts = window.location.pathname.split('/');
        const subscriberId = urlParts[urlParts.length - 1];
        
        if (subscriberId) {
          // Create mount point
          const mountPoint = document.createElement('div');
          mountPoint.id = 'casting-participation-toggle-mount';
          detailsTab.appendChild(mountPoint);
          
          // Find the subscriber
          const subscriber = findSubscriberById(subscriberId);
          
          if (subscriber) {
            // Render our component
            const root = ReactDOM.createRoot(mountPoint);
            root.render(<SubscriberInterestedInCasting subscriber={subscriber} />);
            setPatched(true);
          }
        }
      }
    };

    // Try to patch after a short delay
    const timer = setTimeout(patchDetailView, 500);
    return () => clearTimeout(timer);
  }, [patched]);

  return null; // This component doesn't render anything directly
}

function findSubscriberById(id: string): Subscriber | undefined {
  const { subscribers } = useSubscribers();
  return subscribers.find(sub => sub.id === id);
}
