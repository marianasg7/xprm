
import React, { useState } from 'react';
import { useSubscribers } from '@/context/SubscriberContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Casting, Subscriber } from '@/types/types';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Cast } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CastingsPage() {
  const { castings, subscribers, addCasting, updateCasting, deleteCasting, addSubscriberToCasting, removeSubscriberFromCasting } = useSubscribers();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] = useState(false);
  const [currentCasting, setCurrentCasting] = useState<Casting | null>(null);
  
  const [formData, setFormData] = useState({
    theme: '',
    numberOfPeople: 1,
    openingDate: new Date(),
    closingDate: new Date(),
    recordingDate: new Date(),
    postingDate: new Date(),
    selectedSubscribers: [] as string[]
  });
  
  // Filter subscribers who are interested in casting and active
  const eligibleSubscribers = subscribers.filter(sub => 
    sub.status === 'active' && sub.interestedInCasting
  );
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfPeople' ? parseInt(value) : value
    }));
  };
  
  const handleAddCasting = () => {
    // Make sure all required fields are present
    addCasting({
      theme: formData.theme,
      numberOfPeople: formData.numberOfPeople,
      openingDate: formData.openingDate,
      closingDate: formData.closingDate,
      recordingDate: formData.recordingDate,
      postingDate: formData.postingDate,
      selectedSubscribers: []
    });
    
    setFormData({
      theme: '',
      numberOfPeople: 1,
      openingDate: new Date(),
      closingDate: new Date(),
      recordingDate: new Date(),
      postingDate: new Date(),
      selectedSubscribers: []
    });
    setIsAddDialogOpen(false);
  };
  
  const handleEditCasting = () => {
    if (currentCasting) {
      updateCasting(currentCasting.id, {
        theme: formData.theme,
        numberOfPeople: formData.numberOfPeople,
        openingDate: formData.openingDate,
        closingDate: formData.closingDate,
        recordingDate: formData.recordingDate,
        postingDate: formData.postingDate
      });
      setCurrentCasting(null);
      setIsEditDialogOpen(false);
    }
  };
  
  const openEditDialog = (casting: Casting) => {
    setCurrentCasting(casting);
    setFormData({
      theme: casting.theme,
      numberOfPeople: casting.numberOfPeople,
      openingDate: casting.openingDate,
      closingDate: casting.closingDate,
      recordingDate: casting.recordingDate,
      postingDate: casting.postingDate,
      selectedSubscribers: casting.selectedSubscribers
    });
    setIsEditDialogOpen(true);
  };
  
  const openParticipantsDialog = (casting: Casting) => {
    setCurrentCasting(casting);
    setFormData(prev => ({
      ...prev,
      selectedSubscribers: casting.selectedSubscribers
    }));
    setIsParticipantsDialogOpen(true);
  };
  
  const handleToggleParticipant = (subscriberId: string) => {
    if (!currentCasting) return;
    
    if (currentCasting.selectedSubscribers.includes(subscriberId)) {
      removeSubscriberFromCasting(currentCasting.id, subscriberId);
    } else {
      addSubscriberToCasting(currentCasting.id, subscriberId);
    }
    
    // Update the current casting with the latest data
    const updatedCasting = castings.find(c => c.id === currentCasting.id);
    if (updatedCasting) {
      setCurrentCasting(updatedCasting);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Castings</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Add New Casting
        </Button>
      </div>
      
      {castings.length === 0 ? (
        <div className="text-center py-10">
          <Cast className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium">No castings yet</h2>
          <p className="mt-1 text-sm text-gray-500">
            Start by creating a new casting opportunity.
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add New Casting
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {castings.map((casting) => (
            <Card key={casting.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{casting.theme}</CardTitle>
                  <Badge>{casting.selectedSubscribers.length}/{casting.numberOfPeople}</Badge>
                </div>
                <CardDescription>
                  Created on {format(new Date(casting.createdAt), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Opening:</span>
                    <span>{format(new Date(casting.openingDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Closing:</span>
                    <span>{format(new Date(casting.closingDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recording:</span>
                    <span>{format(new Date(casting.recordingDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posting:</span>
                    <span>{format(new Date(casting.postingDate), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => openParticipantsDialog(casting)}>
                  Manage Participants
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(casting)}>
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Casting Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Casting</DialogTitle>
            <DialogDescription>
              Create a new casting opportunity for your subscribers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="theme" className="text-right">
                Theme
              </Label>
              <Input
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleFormChange}
                className="col-span-3"
                placeholder="Summer Beach Shoot"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numberOfPeople" className="text-right">
                People
              </Label>
              <Input
                id="numberOfPeople"
                name="numberOfPeople"
                type="number"
                min="1"
                value={formData.numberOfPeople}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            
            {/* Opening Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="openingDate" className="text-right">
                Opening
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.openingDate ? format(formData.openingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.openingDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, openingDate: date || new Date() }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Closing Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="closingDate" className="text-right">
                Closing
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.closingDate ? format(formData.closingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.closingDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, closingDate: date || new Date() }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Recording Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recordingDate" className="text-right">
                Recording
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.recordingDate ? format(formData.recordingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.recordingDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, recordingDate: date || new Date() }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Posting Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="postingDate" className="text-right">
                Posting
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.postingDate ? format(formData.postingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.postingDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, postingDate: date || new Date() }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCasting}>Create Casting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Casting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Casting</DialogTitle>
            <DialogDescription>
              Update the details of this casting opportunity.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-theme" className="text-right">
                Theme
              </Label>
              <Input
                id="edit-theme"
                name="theme"
                value={formData.theme}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-numberOfPeople" className="text-right">
                People
              </Label>
              <Input
                id="edit-numberOfPeople"
                name="numberOfPeople"
                type="number"
                min="1"
                value={formData.numberOfPeople}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            
            {/* Same date pickers as the Add dialog */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-openingDate" className="text-right">
                Opening
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.openingDate ? format(formData.openingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.openingDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, openingDate: date || new Date() }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Similar date pickers for other dates */}
            {/* Closing Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Closing</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.closingDate ? format(formData.closingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.closingDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, closingDate: date || new Date() }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Recording Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Recording</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.recordingDate ? format(formData.recordingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.recordingDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, recordingDate: date || new Date() }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Posting Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Posting</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.postingDate ? format(formData.postingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.postingDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, postingDate: date || new Date() }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (currentCasting) {
                  deleteCasting(currentCasting.id);
                  setCurrentCasting(null);
                  setIsEditDialogOpen(false);
                }
              }}
            >
              Delete
            </Button>
            <div className="flex-1"></div>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCasting}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Participants Dialog */}
      <Dialog 
        open={isParticipantsDialogOpen} 
        onOpenChange={setIsParticipantsDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Participants</DialogTitle>
            <DialogDescription>
              Select subscribers for this casting opportunity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="font-medium mb-2">Eligible Subscribers</h3>
            {eligibleSubscribers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No subscribers are currently interested in casting opportunities.
              </p>
            ) : (
              <div className="space-y-2">
                {eligibleSubscribers.map((subscriber) => {
                  const isSelected = currentCasting?.selectedSubscribers.includes(subscriber.id) || false;
                  
                  return (
                    <div 
                      key={subscriber.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-md border",
                        isSelected ? "bg-primary-light border-primary" : "bg-white"
                      )}
                    >
                      <div>
                        <p className="font-medium">{subscriber.name}</p>
                        <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                      </div>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleParticipant(subscriber.id)}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsParticipantsDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
