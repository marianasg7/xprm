
import React, { useState } from "react";
import { useSubscribers } from "@/context/SubscriberContext";
import { Subscriber } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, X } from "lucide-react";
import SubscriberForm from "@/components/subscribers/SubscriberForm";
import SubscriberCard from "@/components/subscribers/SubscriberCard";
import SubscriberDetailView from "@/components/subscribers/SubscriberDetailView";
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

const SubscribersPage: React.FC = () => {
  const { subscribers, addSubscriber, updateSubscriber, deleteSubscriber } =
    useSubscribers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [subscriberToEdit, setSubscriberToEdit] = useState<Subscriber | null>(null);
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const activeSubscribers = subscribers.filter(
    (subscriber) => subscriber.status === "active"
  );

  const filteredSubscribers = activeSubscribers.filter((subscriber) =>
    subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscriber.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscriber.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscriber.fanslyUser?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSubscribers = [...filteredSubscribers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleAddSubscriber = (data: Omit<Subscriber, "id" | "createdAt">) => {
    // Handle image upload if provided
    let subscriberData = data;
    if ((data as any).photoFile) {
      const photoFile = (data as any).photoFile;
      const photoUrl = URL.createObjectURL(photoFile);
      subscriberData = {
        ...data,
        photoUrl
      };
    }
    
    addSubscriber(subscriberData);
    setIsFormOpen(false);
  };

  const handleEditSubscriber = (data: Omit<Subscriber, "id" | "createdAt">) => {
    if (subscriberToEdit) {
      updateSubscriber(subscriberToEdit.id, data);
      setSubscriberToEdit(null);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setSubscriberToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subscriberToDelete) {
      deleteSubscriber(subscriberToDelete);
      setSubscriberToDelete(null);
      setIsDeleteDialogOpen(false);
      setSelectedSubscriber(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Subscribers</h1>
        <p className="text-muted-foreground mt-1">
          Manage all your active subscribers
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <div className="flex gap-2 ml-auto">
          {isSearchOpen ? (
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscribers..."
                className="pl-8 pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                onBlur={() => {
                  if (!searchQuery) setIsSearchOpen(false);
                }}
              />
              {searchQuery && (
                <button 
                  className="absolute right-2 top-3" 
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          ) : (
            <Button size="icon" variant="outline" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>
          )}
          <Button size="icon" onClick={() => setIsFormOpen(true)}>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {sortedSubscribers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSubscribers.map((subscriber) => (
            <SubscriberCard
              key={subscriber.id}
              subscriber={subscriber}
              onClick={() => setSelectedSubscriber(subscriber)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          {activeSubscribers.length === 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-medium">No active subscribers</h3>
              <p className="text-muted-foreground">
                Get started by adding your first subscriber
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Subscriber
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-medium">No matching subscribers</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query
              </p>
              <Badge variant="outline" className="mx-auto">
                {searchQuery}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Subscriber Modal */}
      <Dialog
        open={isFormOpen || !!subscriberToEdit}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setSubscriberToEdit(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {subscriberToEdit ? "Edit Subscriber" : "Add New Subscriber"}
            </DialogTitle>
          </DialogHeader>
          <SubscriberForm
            initialData={subscriberToEdit || undefined}
            onSubmit={subscriberToEdit ? handleEditSubscriber : handleAddSubscriber}
            onCancel={() => {
              setIsFormOpen(false);
              setSubscriberToEdit(null);
            }}
            enablePhotoUpload={false}
          />
        </DialogContent>
      </Dialog>

      {/* Subscriber Detail View Modal */}
      {selectedSubscriber && (
        <SubscriberDetailView
          key={`detail-${selectedSubscriber.id}-${selectedSubscriber.plan || 'no-plan'}`}
          subscriber={selectedSubscriber}
          onClose={() => setSelectedSubscriber(null)}
          onEdit={() => {
            setSubscriberToEdit(selectedSubscriber);
            setSelectedSubscriber(null);
          }}
          onDelete={() => handleOpenDeleteDialog(selectedSubscriber.id)}
        />
      )}

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
              subscriber and all associated data.
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

export default SubscribersPage;
