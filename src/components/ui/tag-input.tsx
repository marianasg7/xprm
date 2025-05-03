
import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/types/types";

interface TagInputProps {
  existingTags: Tag[];
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onAddNewTag?: (name: string) => Tag;
  placeholder?: string;
  disabled?: boolean;
}

export function TagInput({
  existingTags,
  selectedTags,
  onTagsChange,
  onAddNewTag,
  placeholder = "Add tag...",
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const availableTags = existingTags.filter(
    (tag) => !selectedTags.find((selected) => selected.id === tag.id)
  );

  const handleAddTag = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
    setInputValue("");
  };

  const handleRemoveTag = (id: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== id));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      
      // Check if tag exists in available tags
      const existingTag = existingTags.find(
        (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
      );

      if (existingTag) {
        handleAddTag(existingTag);
      } else if (onAddNewTag) {
        // Create new tag if allowed
        const newTag = onAddNewTag(inputValue);
        handleAddTag(newTag);
      }
    } else if (e.key === "Backspace" && inputValue === "" && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1].id);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <Badge 
            key={tag.id} 
            variant="outline"
            className="px-2 py-1 flex items-center gap-1 bg-primary-light"
          >
            {tag.name}
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 rounded-full hover:bg-primary-dark hover:text-white"
                onClick={() => handleRemoveTag(tag.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag.name}</span>
              </Button>
            )}
          </Badge>
        ))}
      </div>
      {!disabled && (
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
            placeholder={placeholder}
            className="w-full"
          />
          {isInputFocused && inputValue && availableTags.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {availableTags
                .filter((tag) =>
                  tag.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((tag) => (
                  <div
                    key={tag.id}
                    className="px-4 py-2 hover:bg-primary-light cursor-pointer"
                    onClick={() => handleAddTag(tag)}
                  >
                    {tag.name}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
