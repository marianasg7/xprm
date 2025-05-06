
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Trash2,
  Edit,
  PlusCircle,
  Paperclip,
  X,
  Calendar,
  Camera,
  Tags,
  ChevronDown,
  ChevronUp,
  Circle,
} from "lucide-react";
import { Subscriber, RecoveryNote } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatTimeAgo, getInitials } from "@/lib/utils";
import { useSubscribers } from "@/context/SubscriberContext";
import { useSales } from "@/context/SalesContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

interface SubscriberDetailViewProps {
  subscriber: Subscriber;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

interface RecoveryNoteFormProps {
  initialData?: RecoveryNote;
  onSubmit: (data: { content: string }) => void;
  onCancel: () => void;
}

interface AttachmentFormProps {
  onSubmit: (data: { name: string; url: string; type: string }) => void;
  onCancel: () => void;
}

interface UnsubscribeFormProps {
  onSubmit: (date: Date) => void;
  onCancel: () => void;
}

const RecoveryNoteForm: React.FC<RecoveryNoteFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const formSchema = z.object({
    content: z.string().min(1, "Content is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialData?.content || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recovery Note</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter recovery plan note..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Note" : "Add Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const AttachmentForm: React.FC<AttachmentFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    url: z.string().min(1, "URL is required"),
    type: z.string().min(1, "Type is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      type: "document",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter attachment name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter file type (e.g., PDF, image)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Attachment</Button>
        </div>
      </form>
    </Form>
  );
};

const UnsubscribeForm: React.FC<UnsubscribeFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [date, setDate] = React.useState<Date>(new Date());

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Unsubscribe Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yyyy") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => onSubmit(date)}
        >
          Confirm Unsubscribe
        </Button>
      </div>
    </div>
  );
};

const SubscriberDetailView: React.FC<SubscriberDetailViewProps> = ({
  subscriber,
  onClose,
  onEdit,
  onDelete,
}) => {
  const {
    castings,
    addRecoveryNote,
    updateRecoveryNote,
    deleteRecoveryNote,
    addAttachment,
    deleteAttachment,
    unsubscribe,
    updateSubscriber,
    subscribers,
  } = useSubscribers();
  
  const { plans, promotions } = useSales();

  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  const [isEditNoteDialogOpen, setIsEditNoteDialogOpen] = useState(false);
  const [isAddAttachmentDialogOpen, setIsAddAttachmentDialogOpen] = useState(false);
  const [isUnsubscribeDialogOpen, setIsUnsubscribeDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<RecoveryNote | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isAssignPlanDialogOpen, setIsAssignPlanDialogOpen] = useState(false);
  const [isPlansExpanded, setIsPlansExpanded] = useState(false);
  const [isPromotionsExpanded, setIsPromotionsExpanded] = useState(false);
  const [currentSubscriber, setCurrentSubscriber] = useState<Subscriber>(subscriber);

  // Find the latest subscriber data whenever the subscriber ID changes or subscribers list changes
  useEffect(() => {
    const latestSubscriber = subscribers.find(sub => sub.id === subscriber.id);
    if (latestSubscriber) {
      setCurrentSubscriber(latestSubscriber);
    }
  }, [subscriber.id, subscribers]);

  // Ensure subscriber fields are properly initialized with fallbacks
  const safeSubscriber = {
    ...currentSubscriber,
    tags: currentSubscriber.tags || [],
    recoveryNotes: currentSubscriber.recoveryNotes || [],
    attachments: currentSubscriber.attachments || [],
    castingParticipations: currentSubscriber.castingParticipations || [],
    interestedInCasting: currentSubscriber.interestedInCasting || false,
  };

  // Get all castings this subscriber is participating in
  const subscriberCastings = castings.filter(casting => 
    casting.selectedSubscribers.includes(currentSubscriber.id)
  );

  const handleAddNote = (data: { content: string }) => {
    addRecoveryNote(currentSubscriber.id, data.content);
    setIsAddNoteDialogOpen(false);
  };

  const handleEditNote = (data: { content: string }) => {
    if (currentNote) {
      updateRecoveryNote(currentSubscriber.id, currentNote.id, data.content);
      setIsEditNoteDialogOpen(false);
      setCurrentNote(null);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteRecoveryNote(currentSubscriber.id, noteId);
  };

  const handleAddAttachment = (data: { name: string; url: string; type: string }) => {
    addAttachment(currentSubscriber.id, {
      name: data.name,
      url: data.url,
      type: data.type,
    });
    setIsAddAttachmentDialogOpen(false);
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    deleteAttachment(currentSubscriber.id, attachmentId);
  };

  const handleUnsubscribe = (date: Date) => {
    unsubscribe(currentSubscriber.id, date);
    setIsUnsubscribeDialogOpen(false);
    onClose(); // Close the detail view and go back to the list
  };

  const openEditNoteModal = (note: RecoveryNote) => {
    setCurrentNote(note);
    setIsEditNoteDialogOpen(true);
  };

  // Get all plans this subscriber might use
  const availablePlans = plans.filter(plan => plan.isActive);
  const subscriberCurrentPlan = safeSubscriber.plan;
  
  // Get promotions relevant to this subscriber
  const activePromotions = promotions.filter(promo => 
    promo.isActive && 
    new Date(promo.endDate) >= new Date()
  );

  // Determine which tabs to show based on subscriber status
  const showRecoveryTab = safeSubscriber.status === "inactive";
  // Only show casting tab if subscriber is active AND interested in casting
  const showCastingTab = safeSubscriber.status === "active" && safeSubscriber.interestedInCasting;
  
  // Always default to details tab
  const defaultTab = "details";

  // Handle assigning a plan to the subscriber
  const handleAssignPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      updateSubscriber(currentSubscriber.id, { 
        plan: plan.name,
        planDuration: plan.duration
      });
      setIsAssignPlanDialogOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b z-10 flex justify-between items-center">
          <h2 className="text-xl font-bold">Subscriber Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <Avatar className="h-20 w-20">
                  {safeSubscriber.photoUrl ? (
                    <AvatarImage src={safeSubscriber.photoUrl} alt={safeSubscriber.name} />
                  ) : (
                    <AvatarFallback className="text-2xl bg-primary text-white">
                      {getInitials(safeSubscriber.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="mt-2 text-xl font-bold">{safeSubscriber.name}</h3>
                {safeSubscriber.nickname && (
                  <p className="text-muted-foreground">@{safeSubscriber.nickname}</p>
                )}
                <div className="flex items-center mt-2">
                  {safeSubscriber.status === "active" ? (
                    <Circle className="h-3 w-3 text-green-500 fill-green-500 mr-2" />
                  ) : (
                    <Badge variant="destructive">Unsubscribed</Badge>
                  )}
                  {safeSubscriber.interestedInCasting && safeSubscriber.status === "active" && (
                    <Badge className="ml-2 bg-orange-500" variant="outline">
                      <Camera className="h-3 w-3 mr-1" />
                    </Badge>
                  )}
                </div>
              </div>

              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Subscription Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{safeSubscriber.plan || "None"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{safeSubscriber.planDuration} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{formatDate(safeSubscriber.subscriptionDate)}</span>
                  </div>
                  {safeSubscriber.endSubscriptionDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Date:</span>
                      <span>{formatDate(safeSubscriber.endSubscriptionDate)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex space-x-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  {showCastingTab && (
                    <TabsTrigger value="casting">Casting</TabsTrigger>
                  )}
                  {showRecoveryTab && (
                    <TabsTrigger value="recovery">Recovery Plan</TabsTrigger>
                  )}
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  <TabsTrigger value="plans">
                    <Tags className="h-4 w-4 mr-1" />
                    Plans
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {safeSubscriber.email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {safeSubscriber.phone}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Fansly Username</p>
                      <p className="text-sm text-muted-foreground">
                        {safeSubscriber.fanslyUser || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Size</p>
                      <p className="text-sm text-muted-foreground">
                        {safeSubscriber.size || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Fetish</p>
                      <p className="text-sm text-muted-foreground">
                        {safeSubscriber.fetish || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Added on</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(safeSubscriber.createdAt)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {safeSubscriber.tags.length > 0 ? (
                        safeSubscriber.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="bg-primary-light"
                          >
                            {tag.name}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No tags</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {showCastingTab && (
                  <TabsContent value="casting" className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Casting Opportunities</CardTitle>
                        <CardDescription>
                          Casting opportunities this subscriber is participating in
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {subscriberCastings.length > 0 ? (
                          <div className="space-y-4">
                            {subscriberCastings.map((casting) => (
                              <Card key={casting.id}>
                                <CardContent className="p-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h3 className="text-lg font-medium">{casting.theme}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">Number of people:</span>
                                        <span className="ml-2">{casting.numberOfPeople}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Opening:</span>
                                        <span className="ml-2">{formatDate(casting.openingDate)}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Closing:</span>
                                        <span className="ml-2">{formatDate(casting.closingDate)}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Recording:</span>
                                        <span className="ml-2">{formatDate(casting.recordingDate)}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Posting:</span>
                                        <span className="ml-2">{formatDate(casting.postingDate)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">
                              No casting opportunities yet
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              This subscriber will appear in the casting selection pool
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {showRecoveryTab && (
                  <TabsContent value="recovery" className="mt-4">
                    <Card>
                      <CardHeader className="pb-2 flex flex-row justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">Recovery Plan</CardTitle>
                          <CardDescription>
                            Notes for recovering this subscriber
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setIsAddNoteDialogOpen(true)}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Add Note
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {safeSubscriber.recoveryNotes.length > 0 ? (
                          <div className="space-y-4">
                            {safeSubscriber.recoveryNotes.map((note) => (
                              <Card key={note.id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <p className="whitespace-pre-wrap">
                                      {note.content}
                                    </p>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditNoteModal(note)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteNote(note.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    {formatTimeAgo(note.createdAt)}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">
                              No recovery notes yet
                            </p>
                            <Button
                              variant="outline"
                              className="mt-2"
                              onClick={() => setIsAddNoteDialogOpen(true)}
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add First Note
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                <TabsContent value="attachments" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Attachments</CardTitle>
                        <CardDescription>
                          Files related to this subscriber
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setIsAddAttachmentDialogOpen(true)}
                      >
                        <Paperclip className="h-4 w-4 mr-1" />
                        Add File
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {safeSubscriber.attachments.length > 0 ? (
                        <div className="space-y-2">
                          {safeSubscriber.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center justify-between p-2 border rounded-md"
                            >
                              <div className="flex items-center">
                                <Paperclip className="h-4 w-4 mr-2" />
                                <div>
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {attachment.name}
                                  </a>
                                  <div className="text-xs text-muted-foreground">
                                    {attachment.type} •{" "}
                                    {formatDate(attachment.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDeleteAttachment(attachment.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">
                            No attachments yet
                          </p>
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => setIsAddAttachmentDialogOpen(true)}
                          >
                            <Paperclip className="h-4 w-4 mr-2" />
                            Add First Attachment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="plans" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Subscription Plans</CardTitle>
                        <CardDescription>
                          Manage subscriber's plan subscription
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setIsAssignPlanDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Assign Plan
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Current Plan</p>
                            <p className="text-sm text-muted-foreground">
                              {safeSubscriber.plan || "No plan assigned"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Duration</p>
                            <p className="text-sm text-muted-foreground">
                              {safeSubscriber.planDuration} months
                            </p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Collapsible 
                            open={isPlansExpanded} 
                            onOpenChange={setIsPlansExpanded}
                            className="w-full"
                          >
                            <CollapsibleTrigger asChild>
                              <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                                <p className="text-sm font-medium">Available Plans</p>
                                {isPlansExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              {availablePlans.length > 0 ? (
                                <div className="space-y-3 mt-2">
                                  {availablePlans.map((plan) => (
                                    <div key={plan.id} className="p-3 border rounded-md">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <h4 className="font-medium">{plan.name}</h4>
                                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium">${plan.price}</p>
                                          <p className="text-xs text-muted-foreground">{plan.duration} months</p>
                                        </div>
                                      </div>
                                      <div className="mt-2 flex gap-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => handleAssignPlan(plan.id)}
                                          disabled={safeSubscriber.plan === plan.name}
                                        >
                                          {safeSubscriber.plan === plan.name ? "Current Plan" : "Assign Plan"}
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground mt-2">No plans available</p>
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                          
                          {/* Add Promotions Collapsible */}
                          <Collapsible 
                            open={isPromotionsExpanded} 
                            onOpenChange={setIsPromotionsExpanded}
                            className="w-full mt-4"
                          >
                            <CollapsibleTrigger asChild>
                              <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                                <p className="text-sm font-medium">Active Promotions</p>
                                {isPromotionsExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              {activePromotions.length > 0 ? (
                                <div className="space-y-3 mt-2">
                                  {activePromotions.map((promo) => {
                                    // Find associated plan
                                    const plan = plans.find(p => p.id === promo.planId);
                                    return (
                                      <div key={promo.id} className="p-3 border rounded-md border-orange-200 bg-orange-50">
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <h4 className="font-medium">{promo.name}</h4>
                                            <p className="text-sm text-muted-foreground">{promo.description}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Valid until: {formatDate(promo.endDate)}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <div className="flex items-center gap-2">
                                              <Badge variant="outline" className="bg-orange-100">
                                                {promo.discountPercentage}% OFF
                                              </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {plan?.name || "Unknown plan"}
                                            </p>
                                          </div>
                                        </div>
                                        {plan && (
                                          <div className="mt-2 flex gap-2">
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => handleAssignPlan(plan.id)}
                                              className="border-orange-300 bg-orange-100 hover:bg-orange-200"
                                            >
                                              Apply Promotion
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground mt-2">No active promotions</p>
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Add Note Dialog */}
      <Dialog
        open={isAddNoteDialogOpen}
        onOpenChange={setIsAddNoteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Recovery Note</DialogTitle>
            <DialogDescription>
              Add a note to help with subscriber recovery
            </DialogDescription>
          </DialogHeader>
          <RecoveryNoteForm
            onSubmit={handleAddNote}
            onCancel={() => setIsAddNoteDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog
        open={isEditNoteDialogOpen}
        onOpenChange={setIsEditNoteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Recovery Note</DialogTitle>
            <DialogDescription>
              Update your recovery plan note
            </DialogDescription>
          </DialogHeader>
          <RecoveryNoteForm
            initialData={currentNote || undefined}
            onSubmit={handleEditNote}
            onCancel={() => {
              setIsEditNoteDialogOpen(false);
              setCurrentNote(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Attachment Dialog */}
      <Dialog
        open={isAddAttachmentDialogOpen}
        onOpenChange={setIsAddAttachmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attachment</DialogTitle>
            <DialogDescription>
              Add a new attachment for this subscriber
            </DialogDescription>
          </DialogHeader>
          <AttachmentForm
            onSubmit={handleAddAttachment}
            onCancel={() => setIsAddAttachmentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Unsubscribe Dialog */}
      <Dialog
        open={isUnsubscribeDialogOpen}
        onOpenChange={setIsUnsubscribeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Unsubscribed</DialogTitle>
            <DialogDescription>
              This will mark the subscriber as inactive
            </DialogDescription>
          </DialogHeader>
          <UnsubscribeForm
            onSubmit={handleUnsubscribe}
            onCancel={() => setIsUnsubscribeDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Assign Plan Dialog */}
      <Dialog
        open={isAssignPlanDialogOpen}
        onOpenChange={setIsAssignPlanDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Plan to Subscriber</DialogTitle>
            <DialogDescription>
              Select a plan to assign to this subscriber
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="plan-select">Plan</Label>
              <Select
                value={selectedPlan || undefined}
                onValueChange={setSelectedPlan}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.price} / {plan.duration} months
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignPlanDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedPlan && handleAssignPlan(selectedPlan)}
              disabled={!selectedPlan}
            >
              Assign Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriberDetailView;
