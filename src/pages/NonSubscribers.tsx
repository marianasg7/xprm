import React, { useState } from "react";
import { useSubscribers } from "@/context/SubscriberContext";
import { Subscriber } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SubscriberCard from "@/components/subscribers/SubscriberCard";
import SubscriberDetailView from "@/components/subscribers/SubscriberDetailView";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubscriberForm from "@/components/subscribers/SubscriberForm";

const NonSubscribersPage: React.FC = () => {
  const { subscribers, updateSubscriber, deleteSubscriber } = useSubscribers();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [subscriberToEdit, setSubscriberToEdit] = useState<Subscriber | null>(null);
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const inactiveSubscribers = subscribers.filter(
    (subscriber) => subscriber.status === "inactive"
  );

  const filteredSubscribers = inactiveSubscribers.filter((subscriber) =>
    subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscriber.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscriber.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscriber.fanslyUser?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSubscribers = [...filteredSubscribers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleEditSubscriber = (data: Omit<Subscriber, "id" | "createdAt">) => {
    if (subscriberToEdit) {
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
      
      updateSubscriber(subscriberToEdit.id, subscriberData);
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
        <h1 className="text-3xl font-bold tracking-tight">Unsubscribed Users</h1>
        <p className="text-muted-foreground mt-1">
          View and manage inactive subscribers
        </p>
      </div>

      <div className="flex gap-2">
        {isSearchOpen ? (
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search unsubscribed users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              onBlur={() => {
                if (!searchQuery) setIsSearchOpen(false);
              }}
            />
          </div>
        ) : (
          <Button variant="outline" onClick={() => setIsSearchOpen(true)}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        )}
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
          {inactiveSubscribers.length === 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-medium">No unsubscribed users</h3>
              <p className="text-muted-foreground">
                All your subscribers are currently active
              </p>
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

      {/* Edit Subscriber Modal */}
      <Dialog
        open={!!subscriberToEdit}
        onOpenChange={(open) => {
          if (!open) {
            setSubscriberToEdit(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subscriber</DialogTitle>
          </DialogHeader>
          <SubscriberForm
            initialData={subscriberToEdit || undefined}
            onSubmit={handleEditSubscriber}
            onCancel={() => setSubscriberToEdit(null)}
            enablePhotoUpload={true} // Add this prop to enable photo upload
          />
        </DialogContent>
      </Dialog>

      {/* Subscriber Detail View Modal */}
      {selectedSubscriber && (
        <SubscriberDetailView
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

export default NonSubscribersPage;
