
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Subscriber, Tag, RecoveryNote, Attachment, SubscriberStatus, Casting } from '@/types/types';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';

interface SubscriberContextType {
  subscribers: Subscriber[];
  tags: Tag[];
  castings: Casting[];
  addSubscriber: (subscriber: Omit<Subscriber, 'id' | 'createdAt'>) => void;
  updateSubscriber: (id: string, subscriber: Partial<Subscriber>) => void;
  deleteSubscriber: (id: string) => void;
  addTag: (name: string) => Tag;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
  addRecoveryNote: (subscriberId: string, content: string) => void;
  updateRecoveryNote: (subscriberId: string, noteId: string, content: string) => void;
  deleteRecoveryNote: (subscriberId: string, noteId: string) => void;
  addAttachment: (subscriberId: string, attachment: Omit<Attachment, 'id' | 'createdAt'>) => void;
  deleteAttachment: (subscriberId: string, attachmentId: string) => void;
  unsubscribe: (id: string, date: Date) => void;
  addCasting: (casting: Omit<Casting, 'id' | 'createdAt'>) => void;
  updateCasting: (id: string, casting: Partial<Casting>) => void;
  deleteCasting: (id: string) => void;
  addSubscriberToCasting: (castingId: string, subscriberId: string) => void;
  removeSubscriberFromCasting: (castingId: string, subscriberId: string) => void;
}

const defaultTags: Tag[] = [
  { id: nanoid(), name: 'Premium' },
  { id: nanoid(), name: 'Annual' },
  { id: nanoid(), name: 'Monthly' },
  { id: nanoid(), name: 'VIP' },
];

// Generate mock data
const generateMockSubscribers = (): Subscriber[] => {
  const today = new Date();
  const statuses: SubscriberStatus[] = ['active', 'inactive'];
  const names = ['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Johnson', 'David Wilson'];
  const plans = ['Basic', 'Premium', 'Gold', 'Platinum'];
  
  return Array(8).fill(null).map((_, index) => {
    const subscriptionDate = new Date();
    subscriptionDate.setMonth(today.getMonth() - Math.floor(Math.random() * 12));
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const endSubscriptionDate = status === 'inactive' 
      ? new Date(subscriptionDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      : undefined;
    
    const subscriberTags = [];
    // Randomly assign 1-3 tags
    const numTags = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numTags; i++) {
      const randomTagIndex = Math.floor(Math.random() * defaultTags.length);
      if (!subscriberTags.some(t => t.id === defaultTags[randomTagIndex].id)) {
        subscriberTags.push(defaultTags[randomTagIndex]);
      }
    }
    
    return {
      id: nanoid(),
      name: names[Math.floor(Math.random() * names.length)],
      email: `user${index + 1}@example.com`,
      phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      nickname: `user${index + 1}`,
      size: `${Math.floor(Math.random() * 20) + 10}cm`,
      fetish: ['BDSM', 'Roleplaying', 'Voyeurism', 'Feet'][Math.floor(Math.random() * 4)],
      fanslyUser: `fansly_user${index + 1}`,
      subscriptionDate,
      endSubscriptionDate,
      status,
      plan: plans[Math.floor(Math.random() * plans.length)],
      planDuration: [1, 3, 6, 12][Math.floor(Math.random() * 4)],
      interestedInCasting: Math.random() > 0.5,
      tags: subscriberTags,
      recoveryNotes: status === 'inactive' ? [
        {
          id: nanoid(),
          content: 'Reached out via email, waiting for response.',
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        }
      ] : [],
      attachments: [],
      castingParticipations: [],
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    };
  });
};

// Generate mock casting opportunities
const generateMockCastings = (): Casting[] => {
  return Array(3).fill(null).map((_, index) => {
    const today = new Date();
    const openingDate = new Date(today);
    openingDate.setDate(today.getDate() - Math.floor(Math.random() * 10));
    
    const closingDate = new Date(openingDate);
    closingDate.setDate(openingDate.getDate() + Math.floor(Math.random() * 10) + 5);
    
    const recordingDate = new Date(closingDate);
    recordingDate.setDate(closingDate.getDate() + Math.floor(Math.random() * 14) + 7);
    
    const postingDate = new Date(recordingDate);
    postingDate.setDate(recordingDate.getDate() + Math.floor(Math.random() * 14) + 7);
    
    return {
      id: nanoid(),
      theme: ['Outdoor Adventure', 'Beach Party', 'Fantasy Roleplay', 'Lingerie Collection'][Math.floor(Math.random() * 4)],
      numberOfPeople: Math.floor(Math.random() * 5) + 1,
      openingDate,
      closingDate,
      recordingDate,
      postingDate,
      selectedSubscribers: [],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    };
  });
};

export const SubscriberContext = createContext<SubscriberContextType>({
  subscribers: [],
  tags: [],
  castings: [],
  addSubscriber: () => {},
  updateSubscriber: () => {},
  deleteSubscriber: () => {},
  addTag: () => ({ id: '', name: '' }),
  updateTag: () => {},
  deleteTag: () => {},
  addRecoveryNote: () => {},
  updateRecoveryNote: () => {},
  deleteRecoveryNote: () => {},
  addAttachment: () => {},
  deleteAttachment: () => {},
  unsubscribe: () => {},
  addCasting: () => {},
  updateCasting: () => {},
  deleteCasting: () => {},
  addSubscriberToCasting: () => {},
  removeSubscriberFromCasting: () => {},
});

export const SubscriberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(generateMockSubscribers());
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const [castings, setCastings] = useState<Casting[]>(generateMockCastings());
  const { toast } = useToast();

  const addSubscriber = (subscriber: Omit<Subscriber, 'id' | 'createdAt'>) => {
    const newSubscriber: Subscriber = {
      ...subscriber,
      id: nanoid(),
      createdAt: new Date(),
    };
    setSubscribers(prev => [newSubscriber, ...prev]);
    toast({
      title: "Subscriber added",
      description: `${subscriber.name} has been added successfully.`,
    });
  };

  const updateSubscriber = (id: string, updatedFields: Partial<Subscriber>) => {
    setSubscribers(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, ...updatedFields } : sub))
    );
    toast({
      title: "Subscriber updated",
      description: "The subscriber has been updated successfully.",
    });
  };

  const deleteSubscriber = (id: string) => {
    // Remove subscriber from all castings first
    setCastings(prev => 
      prev.map(casting => ({
        ...casting,
        selectedSubscribers: casting.selectedSubscribers.filter(subId => subId !== id)
      }))
    );
    
    // Then delete the subscriber
    setSubscribers(prev => prev.filter(sub => sub.id !== id));
    toast({
      title: "Subscriber deleted",
      description: "The subscriber has been deleted successfully.",
    });
  };

  const addTag = (name: string): Tag => {
    const newTag = { id: nanoid(), name };
    setTags(prev => [...prev, newTag]);
    return newTag;
  };

  const updateTag = (id: string, name: string) => {
    setTags(prev => prev.map(tag => (tag.id === id ? { ...tag, name } : tag)));
    
    // Update the tag in all subscribers that have it
    setSubscribers(prev =>
      prev.map(sub => ({
        ...sub,
        tags: sub.tags.map(tag => (tag.id === id ? { ...tag, name } : tag)),
      }))
    );
  };

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
    
    // Remove the tag from all subscribers that have it
    setSubscribers(prev =>
      prev.map(sub => ({
        ...sub,
        tags: sub.tags.filter(tag => tag.id !== id),
      }))
    );
  };

  const addRecoveryNote = (subscriberId: string, content: string) => {
    const newNote: RecoveryNote = {
      id: nanoid(),
      content,
      createdAt: new Date(),
    };
    
    setSubscribers(prev =>
      prev.map(sub =>
        sub.id === subscriberId
          ? { ...sub, recoveryNotes: [newNote, ...sub.recoveryNotes] }
          : sub
      )
    );
    toast({
      title: "Note added",
      description: "Recovery note has been added successfully.",
    });
  };

  const updateRecoveryNote = (subscriberId: string, noteId: string, content: string) => {
    setSubscribers(prev =>
      prev.map(sub =>
        sub.id === subscriberId
          ? {
              ...sub,
              recoveryNotes: sub.recoveryNotes.map(note =>
                note.id === noteId ? { ...note, content } : note
              ),
            }
          : sub
      )
    );
  };

  const deleteRecoveryNote = (subscriberId: string, noteId: string) => {
    setSubscribers(prev =>
      prev.map(sub =>
        sub.id === subscriberId
          ? {
              ...sub,
              recoveryNotes: sub.recoveryNotes.filter(note => note.id !== noteId),
            }
          : sub
      )
    );
  };

  const addAttachment = (subscriberId: string, attachment: Omit<Attachment, 'id' | 'createdAt'>) => {
    const newAttachment: Attachment = {
      ...attachment,
      id: nanoid(),
      createdAt: new Date(),
    };
    
    setSubscribers(prev =>
      prev.map(sub =>
        sub.id === subscriberId
          ? { ...sub, attachments: [newAttachment, ...sub.attachments] }
          : sub
      )
    );
    toast({
      title: "Attachment added",
      description: "Attachment has been added successfully.",
    });
  };

  const deleteAttachment = (subscriberId: string, attachmentId: string) => {
    setSubscribers(prev =>
      prev.map(sub =>
        sub.id === subscriberId
          ? {
              ...sub,
              attachments: sub.attachments.filter(att => att.id !== attachmentId),
            }
          : sub
      )
    );
  };

  const unsubscribe = (id: string, date: Date) => {
    setSubscribers(prev =>
      prev.map(sub =>
        sub.id === id
          ? { ...sub, status: 'inactive', endSubscriptionDate: date }
          : sub
      )
    );
    toast({
      title: "Status updated",
      description: "Subscriber has been marked as unsubscribed.",
    });
  };

  // Casting related functions
  const addCasting = (casting: Omit<Casting, 'id' | 'createdAt'>) => {
    const newCasting: Casting = {
      ...casting,
      id: nanoid(),
      createdAt: new Date(),
    };
    setCastings(prev => [newCasting, ...prev]);
    toast({
      title: "Casting added",
      description: `${casting.theme} casting has been created successfully.`,
    });
  };

  const updateCasting = (id: string, updatedFields: Partial<Casting>) => {
    setCastings(prev =>
      prev.map(cast => (cast.id === id ? { ...cast, ...updatedFields } : cast))
    );
    toast({
      title: "Casting updated",
      description: "The casting has been updated successfully.",
    });
  };

  const deleteCasting = (id: string) => {
    // Remove casting reference from all subscribers
    setSubscribers(prev =>
      prev.map(sub => ({
        ...sub,
        castingParticipations: sub.castingParticipations.filter(castId => castId !== id)
      }))
    );
    
    // Delete the casting
    setCastings(prev => prev.filter(cast => cast.id !== id));
    toast({
      title: "Casting deleted",
      description: "The casting has been deleted successfully.",
    });
  };

  const addSubscriberToCasting = (castingId: string, subscriberId: string) => {
    // Add subscriber to casting
    setCastings(prev =>
      prev.map(cast =>
        cast.id === castingId 
          ? { 
              ...cast, 
              selectedSubscribers: cast.selectedSubscribers.includes(subscriberId) 
                ? cast.selectedSubscribers 
                : [...cast.selectedSubscribers, subscriberId] 
            }
          : cast
      )
    );
    
    // Add casting to subscriber's participations
    setSubscribers(prev =>
      prev.map(sub =>
        sub.id === subscriberId
          ? { 
              ...sub, 
              castingParticipations: sub.castingParticipations.includes(castingId)
                ? sub.castingParticipations
                : [...sub.castingParticipations, castingId]
            }
          : sub
      )
    );
    
    toast({
      title: "Subscriber added to casting",
      description: "The subscriber has been added to the casting successfully.",
    });
  };

  const removeSubscriberFromCasting = (castingId: string, subscriberId: string) => {
    // Remove subscriber from casting
    setCastings(prev =>
      prev.map(cast =>
        cast.id === castingId
          ? {
              ...cast,
              selectedSubscribers: cast.selectedSubscribers.filter(id => id !== subscriberId)
            }
          : cast
      )
    );
    
    // Remove casting from subscriber's participations
    setSubscribers(prev =>
      prev.map(sub =>
        sub.id === subscriberId
          ? {
              ...sub,
              castingParticipations: sub.castingParticipations.filter(id => id !== castingId)
            }
          : sub
      )
    );
    
    toast({
      title: "Subscriber removed from casting",
      description: "The subscriber has been removed from the casting successfully.",
    });
  };

  return (
    <SubscriberContext.Provider
      value={{
        subscribers,
        tags,
        castings,
        addSubscriber,
        updateSubscriber,
        deleteSubscriber,
        addTag,
        updateTag,
        deleteTag,
        addRecoveryNote,
        updateRecoveryNote,
        deleteRecoveryNote,
        addAttachment,
        deleteAttachment,
        unsubscribe,
        addCasting,
        updateCasting,
        deleteCasting,
        addSubscriberToCasting,
        removeSubscriberFromCasting
      }}
    >
      {children}
    </SubscriberContext.Provider>
  );
};

export const useSubscribers = () => useContext(SubscriberContext);
