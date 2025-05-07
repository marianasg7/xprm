import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubscribers } from "@/context/SubscriberContext";
import { Subscriber } from "@/types/types";

interface SubscriberFormProps {
  initialData?: Subscriber;
  onSubmit: (data: Omit<Subscriber, "id" | "createdAt">) => void;
  onCancel: () => void;
  enablePhotoUpload?: boolean;
}

const SubscriberForm: React.FC<SubscriberFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  enablePhotoUpload = false,
}) => {
  const { tags: allTags, addTag } = useSubscribers();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.tags.map((tag) => tag.id) || []
  );
  const [newTag, setNewTag] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photoUrl || null
  );

  // Modified fetish options with consistent colors
  const fetchFetishColors = (fetish: string) => {
    const fetishColors: {[key: string]: string} = {
      "foot": "bg-blue-100 text-blue-700",
      "feet": "bg-blue-100 text-blue-700",
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
    
    // Generate a consistent color based on the fetish name
    const hash = Array.from(lowerFetish).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const hue = Math.abs(hash) % 360;
    return `bg-[hsl(${hue},85%,90%)] text-[hsl(${hue},85%,30%)]`;
  };

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    nickname: z.string().optional(),
    size: z.string().optional(),
    fetish: z.string().optional(),
    fanslyUser: z.string().optional(),
    subscriptionDate: z.date({
      required_error: "Subscription date is required",
    }),
    status: z.enum(["active", "inactive"]).default("active"),
    plan: z.string().min(1, "Plan is required"),
    planDuration: z.number().int().positive().default(1),
    interestedInCasting: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    recoveryNotes: z.array(z.any()).default([]),
    attachments: z.array(z.any()).default([]),
    castingParticipations: z.array(z.string()).default([]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      nickname: initialData?.nickname || "",
      size: initialData?.size || "",
      fetish: initialData?.fetish || "",
      fanslyUser: initialData?.fanslyUser || "",
      subscriptionDate: initialData?.subscriptionDate
        ? new Date(initialData.subscriptionDate)
        : new Date(),
      status: initialData?.status || "active",
      plan: initialData?.plan || "",
      planDuration: initialData?.planDuration || 1,
      interestedInCasting: initialData?.interestedInCasting || false,
      tags: initialData?.tags.map((tag) => tag.id) || [],
      recoveryNotes: initialData?.recoveryNotes || [],
      attachments: initialData?.attachments || [],
      castingParticipations: initialData?.castingParticipations || [],
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const subscriberData: Omit<Subscriber, "id" | "createdAt"> = {
      ...data,
      tags: allTags.filter((tag) => selectedTags.includes(tag.id)),
    };

    if (photoFile) {
      (subscriberData as any).photoFile = photoFile;
    }

    onSubmit(subscriberData);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      const tag = addTag(newTag.trim());
      setSelectedTags([...selectedTags, tag.id]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Name and Nickname Fields */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter nickname (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Size Field */}
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter size" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fetish Field */}
            <FormField
              control={form.control}
              name="fetish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fetish</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter fetish" />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <div className="mt-2">
                      <Badge className={fetchFetishColors(field.value)}>
                        {field.value}
                      </Badge>
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Fansly User Field */}
            <FormField
              control={form.control}
              name="fanslyUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fansly User</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">
                        @
                      </span>
                      <Input
                        {...field}
                        className="pl-7"
                        placeholder="fansly_username"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            {/* Subscription Date Field */}
            <FormField
              control={form.control}
              name="subscriptionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Subscription Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plan Field - modified to show plans dropdown */}
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Promotion field replacing Duration */}
            <FormField
              control={form.control}
              name="promotion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a promotion (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="summer_promo">Summer Sale (20% OFF)</SelectItem>
                      <SelectItem value="new_user">New User (15% OFF)</SelectItem>
                      <SelectItem value="loyalty">Loyalty (10% OFF)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plan Duration is hidden and calculated automatically */}
            <input type="hidden" {...form.register("planDuration")} value="1" />

            {/* Tags Field */}
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tagId) => {
                  const tag = allTags.find((t) => t.id === tagId);
                  return (
                    tag && (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag.name}
                        <button
                          type="button"
                          className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                          onClick={() => handleRemoveTag(tag.id)}
                        >
                          &times;
                        </button>
                      </Badge>
                    )
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              <FormMessage />
            </FormItem>

            {/* Replace "Interested in Casting" with just "Casting" */}
            <FormField
              control={form.control}
              name="interestedInCasting"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="mb-0">Casting</FormLabel>
                    <FormDescription>
                      Mark this subscriber as interested in casting
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Photo upload - Remove for forms, keep only in details */}
            {enablePhotoUpload && (
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <div className="flex items-center gap-4">
                  {photoPreview && (
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Save" : "Add Subscriber"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubscriberForm;
