
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSubscribers } from "@/context/SubscriberContext";
import { Subscriber, Tag } from "@/types/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TagInput } from "@/components/ui/tag-input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  nickname: z.string().optional(),
  size: z.string().optional(),
  fetish: z.string().optional(),
  fanslyUser: z.string().optional(),
  photoUrl: z.string().optional(),
  subscriptionDate: z.date({ required_error: "Subscription date is required" }),
  plan: z.string().min(1, { message: "Plan is required" }),
  planDuration: z.number().min(1, { message: "Plan duration is required" }),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  isUnsubscribed: z.boolean().default(false),
  interestedInCasting: z.boolean().default(false),
  status: z.enum(["active", "inactive"]),
  endSubscriptionDate: z.date().optional(),
});

interface SubscriberFormProps {
  initialData?: Subscriber;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  enablePhotoUpload?: boolean;
}

const SubscriberForm: React.FC<SubscriberFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  enablePhotoUpload = false,
}) => {
  const { tags, addTag } = useSubscribers();
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          subscriptionDate: new Date(initialData.subscriptionDate),
          endSubscriptionDate: initialData.endSubscriptionDate
            ? new Date(initialData.endSubscriptionDate)
            : undefined,
          isUnsubscribed: initialData.status === "inactive",
          interestedInCasting: initialData.interestedInCasting || false,
        }
      : {
          name: "",
          email: "",
          phone: "",
          nickname: "",
          size: "",
          fetish: "",
          fanslyUser: "",
          photoUrl: "",
          subscriptionDate: new Date(),
          plan: "Basic",
          planDuration: 1,
          tags: [],
          isUnsubscribed: false,
          interestedInCasting: false,
          status: "active",
        },
  });

  const selectedTags = form.watch("tags") || [];
  const isUnsubscribed = form.watch("isUnsubscribed");

  // Update status when isUnsubscribed changes
  React.useEffect(() => {
    const newStatus = isUnsubscribed ? "inactive" : "active";
    form.setValue("status", newStatus);
  }, [isUnsubscribed, form]);

  const handleAddNewTag = (name: string): Tag => {
    return addTag(name);
  };

  const [photoFile, setPhotoFile] = React.useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          form.setValue("photoUrl", event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    // Add the photo file to the form data for processing in the parent component
    const formData = {
      ...data,
      photoFile: photoFile
    };
    onSubmit(formData as any);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 max-w-4xl"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Subscriber" : "Add New Subscriber"}
          </h2>

          {enablePhotoUpload && (
            <div className="mb-4">
              <FormLabel>Profile Photo</FormLabel>
              <div className="flex items-center space-x-4 mt-2">
                {form.watch("photoUrl") ? (
                  <div className="relative w-20 h-20">
                    <img 
                      src={form.watch("photoUrl")} 
                      alt="Profile preview" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => {
                        form.setValue("photoUrl", "");
                        setPhotoFile(null);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
                    <span className="text-3xl text-gray-400">+</span>
                  </div>
                )}
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="max-w-xs"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter nickname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="fetish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fetish</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter fetish" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fanslyUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fansly Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Fansly username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Select date</span>
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
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unsubscribed Checkbox */}
            <FormField
              control={form.control}
              name="isUnsubscribed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-end space-x-2 space-y-0 rounded-md p-4 border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mb-0">Unsubscribed</FormLabel>
                </FormItem>
              )}
            />

            {/* Interested In Casting Checkbox */}
            <FormField
              control={form.control}
              name="interestedInCasting"
              render={({ field }) => (
                <FormItem className="flex flex-row items-end space-x-2 space-y-0 rounded-md p-4 border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mb-0">Interested in Casting</FormLabel>
                </FormItem>
              )}
            />

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
                        <SelectValue placeholder="Select plan" />
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

            <FormField
              control={form.control}
              name="planDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (months)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Show Unsubscribe Date field only when the checkbox is checked */}
            {isUnsubscribed && (
              <FormField
                control={form.control}
                name="endSubscriptionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Unsubscribe Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Select date</span>
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
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagInput
                    existingTags={tags}
                    selectedTags={selectedTags as Tag[]}
                    onTagsChange={field.onChange}
                    onAddNewTag={handleAddNewTag}
                    placeholder="Add tags..."
                  />
                </FormControl>
                <FormDescription>
                  Enter tag name and press Enter to add it
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Subscriber" : "Add Subscriber"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubscriberForm;
