
import React, { useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function SubscriberFormCastingOption() {
  useEffect(() => {
    // Look for the subscriber form
    const injectCastingOption = () => {
      const form = document.querySelector('form');
      if (!form) return;
      
      // Look for common form patterns to inject our option
      const fieldsets = form.querySelectorAll('fieldset');
      if (fieldsets.length === 0) return;
      
      // Try to find a good place to inject our option
      let targetElement: Element | null = null;
      
      // First preference: look for a fieldset with "preferences" or similar text
      for (const fieldset of fieldsets) {
        const legendText = fieldset.querySelector('legend')?.textContent?.toLowerCase();
        if (legendText && (legendText.includes('preference') || legendText.includes('option'))) {
          targetElement = fieldset;
          break;
        }
      }
      
      // If no preference fieldset found, use the last fieldset as a fallback
      if (!targetElement) {
        targetElement = fieldsets[fieldsets.length - 1];
      }
      
      // Create our checkbox element
      const castingOptionDiv = document.createElement('div');
      castingOptionDiv.className = 'flex items-center space-x-2';
      castingOptionDiv.innerHTML = `
        <input type="checkbox" id="interestedInCasting" name="interestedInCasting" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
        <label for="interestedInCasting" class="text-sm font-medium text-gray-700">
          Interested in participating in castings
        </label>
      `;
      
      // Append it to the target element
      targetElement.appendChild(castingOptionDiv);
      
      // Add event listener to update form data
      const checkbox = castingOptionDiv.querySelector('input');
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          // We need to find a way to update the form data
          const formEvent = new CustomEvent('castingOptionChange', {
            detail: { checked: target.checked }
          });
          document.dispatchEvent(formEvent);
        });
      }
    };
    
    // Try to inject after a short delay to ensure the form is rendered
    const timer = setTimeout(injectCastingOption, 500);
    return () => clearTimeout(timer);
  }, []);
  
  return null; // This component doesn't render anything directly
}
