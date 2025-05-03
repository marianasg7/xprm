
import React, { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Trash2,
  Edit,
  PlusCircle,
  Paperclip,
  X,
  Calendar,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatTimeAgo, getInitials } from "@/lib/utils";
import { useSubscribers } from "@/context/SubscriberContext";
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
    addRecoveryNote,
    updateRecoveryNote,
    deleteRecoveryNote,
    addAttachment,
    deleteAttachment,
    unsubscribe,
  } = useSubscribers();

  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  const [isEditNoteDialogOpen, setIsEditNoteDialogOpen] = useState(false);
  const [isAddAttachmentDialogOpen, setIsAddAttachmentDialogOpen] = useState(false);
  const [isUnsubscribeDialogOpen, setIsUnsubscribeDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<RecoveryNote | null>(null);

  // Ensure subscriber fields are properly initialized with fallbacks
  const safeSubscriber = {
    ...subscriber,
    tags: subscriber.tags || [],
    recoveryNotes: subscriber.recoveryNotes || [],
    attachments: subscriber.attachments || [],
  };

  const handleAddNote = (data: { content: string }) => {
    addRecoveryNote(subscriber.id, data.content);
    setIsAddNoteDialogOpen(false);
  };

  const handleEditNote = (data: { content: string }) => {
    if (currentNote) {
      updateRecoveryNote(subscriber.id, currentNote.id, data.content);
      setIsEditNoteDialogOpen(false);
      setCurrentNote(null);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteRecoveryNote(subscriber.id, noteId);
  };

  const handleAddAttachment = (data: { name: string; url: string; type: string }) => {
    addAttachment(subscriber.id, {
      name: data.name,
      url: data.url,
      type: data.type,
    });
    setIsAddAttachmentDialogOpen(false);
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    deleteAttachment(subscriber.id, attachmentId);
  };

  const handleUnsubscribe = (date: Date) => {
    unsubscribe(subscriber.id, date);
    setIsUnsubscribeDialogOpen(false);
    onClose(); // Close the detail view and go back to the list
  };

  const openEditNoteModal = (note: RecoveryNote) => {
    setCurrentNote(note);
    setIsEditNoteDialogOpen(true);
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
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {getInitials(safeSubscriber.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-2 text-xl font-bold">{safeSubscriber.name}</h3>
                {safeSubscriber.nickname && (
                  <p className="text-muted-foreground">@{safeSubscriber.nickname}</p>
                )}
                <Badge
                  className="mt-2"
                  variant={safeSubscriber.status === "active" ? "default" : "destructive"}
                >
                  {safeSubscriber.status === "active" ? "Active" : "Unsubscribed"}
                </Badge>
              </div>

              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Subscription Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{safeSubscriber.plan}</span>
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
              
              {safeSubscriber.status === "active" && (
                <Button
                  variant="outline"
                  className="w-full mt-2 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => setIsUnsubscribeDialogOpen(true)}
                >
                  Mark as Unsubscribed
                </Button>
              )}
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="recovery">Recovery Plan</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
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
    </div>
  );
};

export default SubscriberDetailView;
