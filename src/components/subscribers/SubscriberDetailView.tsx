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
  Film,
  Plus,
} from "lucide-react";
import { Subscriber, RecoveryNote, Attachment } from "@/types/types";
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

interface SubscriberDetailViewProps {
  subscriber: Subscriber;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

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
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);
  const [appliedPromotionId, setAppliedPromotionId] = useState<string | null>(null);

  useEffect(() => {
    const latestSubscriber = subscribers.find(sub => sub.id === subscriber.id);
    if (latestSubscriber) {
      setCurrentSubscriber(latestSubscriber);
    }
  }, [subscriber.id, subscribers]);

  const safeSubscriber = {
    ...currentSubscriber,
    tags: currentSubscriber.tags || [],
    recoveryNotes: currentSubscriber.recoveryNotes || [],
    attachments: currentSubscriber.attachments || [],
    castingParticipations: currentSubscriber.castingParticipations || [],
    interestedInCasting: currentSubscriber.interestedInCasting || false,
  };

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
    onClose();
  };

  const openEditNoteModal = (note: RecoveryNote) => {
    setCurrentNote(note);
    setIsEditNoteDialogOpen(true);
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPhotoUrl(fileUrl);
    }
  };

  const handleSavePhoto = () => {
    if (photoUrl) {
      updateSubscriber(currentSubscriber.id, { photoUrl });
      setIsPhotoDialogOpen(false);
    }
  };

  const availablePlans = plans.filter(plan => plan.isActive);
  const subscriberCurrentPlan = safeSubscriber.plan;
  
  const activePromotions = promotions.filter(promo => 
    promo.isActive && 
    new Date(promo.endDate) >= new Date()
  );

  const showRecoveryTab = safeSubscriber.status === "inactive";
  const showCastingTab = safeSubscriber.status === "active" && safeSubscriber.interestedInCasting;
  
  const defaultTab = "details";

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

  const handleAssignPromotion = (promoId: string) => {
    setSelectedPromotion(promoId);
  };

  const calculatePlanEndDate = (subscriptionDate?: string | Date, planDuration?: number) => {
    if (!subscriptionDate || !planDuration) {
      return "N/A";
    }
    
    const startDate = new Date(subscriptionDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + planDuration);
    
    return formatDate(endDate);
  };

  const getAppliedPromotion = () => {
    const subscriberPlan = plans.find(p => p.name === safeSubscriber.plan);
    if (!subscriberPlan) return null;
    
    return activePromotions.find(p => p.planId === subscriberPlan.id);
  };

  const getFetishColor = (fetish: string | undefined) => {
    if (!fetish) return "bg-gray-100 text-gray-500";
    
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
    
    const lowerFetish = fetish.toLowerCase();
    for (const [key, value] of Object.entries(fetishColors)) {
      if (lowerFetish.includes(key)) {
        return value;
      }
    }
    
    const hash = Array.from(lowerFetish).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const hue = Math.abs(hash) % 360;
    return `bg-[hsl(${hue},85%,90%)] text-[hsl(${hue},85%,30%)]`;
  };

  const appliedPromotion = getAppliedPromotion();
  
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
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {safeSubscriber.photoUrl ? (
                      <AvatarImage src={safeSubscriber.photoUrl} alt={safeSubscriber.name} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-primary text-white">
                        {getInitials(safeSubscriber.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-background" 
                    onClick={() => setIsPhotoDialogOpen(true)}
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center mt-2">
                  <h3 className="text-xl font-bold">
                    {safeSubscriber.nickname || safeSubscriber.name}
                  </h3>
                  <div className="flex items-center ml-2">
                    {safeSubscriber.interestedInCasting && (
                      <span className="inline text-amber-500">🎬</span>
                    )}
                    {safeSubscriber.status === "active" && (
                      <Circle className="h-3 w-3 text-green-500 fill-green-500 ml-1" />
                    )}
                  </div>
                </div>
                {safeSubscriber.nickname && safeSubscriber.name !== safeSubscriber.nickname && (
                  <p className="text-muted-foreground">{safeSubscriber.name}</p>
                )}
                <div className="flex items-center mt-2">
                  {safeSubscriber.status === "active" ? (
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Unsubscribed</Badge>
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
                    <span className="font-medium">
                      {safeSubscriber.plan || "None"}
                      {appliedPromotionId && (
                        <Badge className="ml-2 bg-orange-100 text-orange-700 border-0">
                          {promotions.find(p => p.id === appliedPromotionId)?.discountPercentage}% OFF
                        </Badge>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{safeSubscriber.planDuration} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{formatDate(safeSubscriber.subscriptionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span>{calculatePlanEndDate(safeSubscriber.subscriptionDate, safeSubscriber.planDuration)}</span>
                  </div>
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
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">
                        {safeSubscriber.nickname || safeSubscriber.name}
                      </p>
                    </div>
                    {safeSubscriber.nickname && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Real Name</p>
                        <p className="text-sm text-muted-foreground">
                          {safeSubscriber.name}
                        </p>
                      </div>
                    )}
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
                      <p className="text-sm font-medium">Fansly User</p>
                      <p className="text-sm text-muted-foreground">
                        {safeSubscriber.fanslyUser ? `@${safeSubscriber.fanslyUser}` : "N/A"}
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
                      {safeSubscriber.fetish ? (
                        <Badge 
                          variant="outline" 
                          className={`${getFetishColor(safeSubscriber.fetish)} border-0`}
                        >
                          {safeSubscriber.fetish}
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground">N/A</p>
                      )}
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
                      <CardHeader className="pb-2 flex flex-row justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">Casting Opportunities</CardTitle>
                          <CardDescription>
                            Casting opportunities this subscriber is participating in
                          </CardDescription>
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
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
                                      <div className="flex space-x-2">
                                        <Button size="sm" variant="ghost">
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-red-500">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
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
                          <Plus className="h-4 w-4" />
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
                        <Plus className="h-4 w-4" />
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
                            <p className="text-sm font-medium">End Date</p>
                            <p className="text-sm text-muted-foreground">
                              {calculatePlanEndDate(safeSubscriber.subscriptionDate, safeSubscriber.planDuration)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Start Date</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(safeSubscriber.subscriptionDate)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Promotion</p>
                            <p className="text-sm">
                              {appliedPromotionId ? (
                                <Badge className="bg-orange-100 text-orange-700 border-0">
                                  {promotions.find(p => p.id === appliedPromotionId)?.name} 
                                  ({promotions.find(p => p.id === appliedPromotionId)?.discountPercentage}% OFF)
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">No promotion applied</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
