
import React, { useState } from "react";
import { useSubscribers } from "@/context/SubscriberContext";
import { Casting, Subscriber } from "@/types/types";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Cast, PlusCircle, Search, Trash2, Edit, Users, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const castingFormSchema = z.object({
  theme: z.string().min(1, { message: "Theme is required" }),
  numberOfPeople: z.number().min(1, { message: "Number of people must be at least 1" }),
  openingDate: z.date(),
  closingDate: z.date(),
  recordingDate: z.date(),
  postingDate: z.date(),
  selectedSubscribers: z.array(z.string())
});

interface CastingFormProps {
  initialData?: Casting;
  onSubmit: (data: z.infer<typeof castingFormSchema>) => void;
  onCancel: () => void;
}

const CastingForm: React.FC<CastingFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { subscribers } = useSubscribers();
  const isEditing = !!initialData;
  
  // Filter only active subscribers who are interested in casting
  const eligibleSubscribers = subscribers.filter(
    sub => sub.status === "active" && sub.interestedInCasting
  );

  const form = useForm<z.infer<typeof castingFormSchema>>({
    resolver: zodResolver(castingFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          openingDate: new Date(initialData.openingDate),
          closingDate: new Date(initialData.closingDate),
          recordingDate: new Date(initialData.recordingDate),
          postingDate: new Date(initialData.postingDate),
          selectedSubscribers: initialData.selectedSubscribers || [],
        }
      : {
          theme: "",
          numberOfPeople: 1,
          openingDate: new Date(),
          closingDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          recordingDate: new Date(new Date().setDate(new Date().getDate() + 14)),
          postingDate: new Date(new Date().setDate(new Date().getDate() + 21)),
          selectedSubscribers: [],
        },
  });
  
  const selectedSubscriberIds = form.watch("selectedSubscribers");
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <FormControl>
                  <Input placeholder="Enter casting theme" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="numberOfPeople"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of People</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter number of people"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="openingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Opening Date</FormLabel>
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
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
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
            
            <FormField
              control={form.control}
              name="closingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Closing Date</FormLabel>
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
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
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
            
            <FormField
              control={form.control}
              name="recordingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Recording Date</FormLabel>
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
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
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
            
            <FormField
              control={form.control}
              name="postingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Posting Date</FormLabel>
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
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
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
          </div>

          <div className="space-y-2">
            <FormLabel>Select Participants</FormLabel>
            <FormDescription>
              Select subscribers who will participate in this casting
              ({selectedSubscriberIds.length}/{form.getValues().numberOfPeople} selected)
            </FormDescription>
            
            <Card>
              <CardContent className="p-2">
                <ScrollArea className="h-[200px] pr-4">
                  {eligibleSubscribers.length > 0 ? (
                    <div className="space-y-2">
                      {eligibleSubscribers.map((sub) => {
                        const isSelected = selectedSubscriberIds.includes(sub.id);
                        const isDisabled = !isSelected && 
                          selectedSubscriberIds.length >= form.getValues().numberOfPeople;
                        
                        return (
                          <div key={sub.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                const currentSelected = [...selectedSubscriberIds];
                                
                                if (checked) {
                                  if (currentSelected.length < form.getValues().numberOfPeople) {
                                    form.setValue("selectedSubscribers", [...currentSelected, sub.id]);
                                  }
                                } else {
                                  form.setValue(
                                    "selectedSubscribers",
                                    currentSelected.filter((id) => id !== sub.id)
                                  );
                                }
                              }}
                              disabled={isDisabled && !isSelected}
                              id={`subscriber-${sub.id}`}
                            />
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback className="bg-primary text-white text-xs">
                                    {getInitials(sub.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{sub.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {sub.email}
                                  </p>
                                </div>
                              </div>
                              {isSelected && (
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                  <Check className="h-3 w-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">
                        No eligible subscribers found
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            
            <FormMessage>
              {selectedSubscriberIds.length > form.getValues().numberOfPeople && 
                "You have selected more subscribers than the number of people required"}
            </FormMessage>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={
            selectedSubscriberIds.length > form.getValues().numberOfPeople
          }>
            {isEditing ? "Update Casting" : "Create Casting"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const CastingsPage: React.FC = () => {
  const { castings, subscribers, addCasting, updateCasting, deleteCasting } = useSubscribers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [castingToEdit, setCastingToEdit] = useState<Casting | null>(null);
  const [castingToDelete, setCastingToDelete] = useState<string | null>(null);

  // Filter castings based on search query
  const filteredCastings = castings.filter((casting) =>
    casting.theme.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort castings by creation date, newest first
  const sortedCastings = [...filteredCastings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleAddCasting = (data: z.infer<typeof castingFormSchema>) => {
    addCasting(data);
    setIsFormOpen(false);
  };

  const handleEditCasting = (data: z.infer<typeof castingFormSchema>) => {
    if (castingToEdit) {
      updateCasting(castingToEdit.id, data);
      setCastingToEdit(null);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setCastingToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (castingToDelete) {
      deleteCasting(castingToDelete);
      setCastingToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Helper function to get subscriber names from IDs
  const getParticipantNames = (participantIds: string[]): string[] => {
    return participantIds.map(id => {
      const participant = subscribers.find(sub => sub.id === id);
      return participant ? participant.name : 'Unknown';
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Casting Opportunities</h1>
        <p className="text-muted-foreground mt-1">
          Manage casting opportunities and participant selection
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search castings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Casting
        </Button>
      </div>

      {sortedCastings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedCastings.map((casting) => {
            const participantNames = getParticipantNames(casting.selectedSubscribers);
            
            return (
              <Card key={casting.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-bold">
                        <Cast className="h-5 w-5 inline mr-2" />
                        {casting.theme}
                      </CardTitle>
                      <CardDescription>
                        {casting.selectedSubscribers.length}/{casting.numberOfPeople} participants selected
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCastingToEdit(casting)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleOpenDeleteDialog(casting.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-3">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Opening:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(casting.openingDate), "dd MMM yyyy")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Closing:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(casting.closingDate), "dd MMM yyyy")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recording:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(casting.recordingDate), "dd MMM yyyy")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Posting:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(casting.postingDate), "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Participants
                    </h4>
                    
                    {participantNames.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto">
                        {participantNames.map((name, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No participants selected yet</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/40 pt-3 pb-3 text-xs text-muted-foreground">
                  Created {format(new Date(casting.createdAt), "dd MMM yyyy")}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="space-y-3">
            <Cast className="h-12 w-12 mx-auto text-muted-foreground/70" />
            <h3 className="text-lg font-medium">No casting opportunities</h3>
            <p className="text-muted-foreground">
              Get started by creating your first casting opportunity
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Casting
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Casting Modal */}
      <Dialog
        open={isFormOpen || !!castingToEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setCastingToEdit(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {castingToEdit ? "Edit Casting" : "Add New Casting"}
            </DialogTitle>
          </DialogHeader>
          <CastingForm
            initialData={castingToEdit || undefined}
            onSubmit={castingToEdit ? handleEditCasting : handleAddCasting}
            onCancel={() => {
              setIsFormOpen(false);
              setCastingToEdit(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              casting opportunity and remove all participant selections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CastingsPage;
