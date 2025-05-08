
export type Tag = {
  id: string;
  name: string;
};

export interface RecoveryNote {
  id: string;
  content: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  createdAt: Date;
}

export type SubscriberStatus = 'active' | 'inactive';

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  nickname: string;
  size: string;
  fetish: string;
  fanslyUser: string;
  photoUrl?: string;
  subscriptionDate: Date;
  endSubscriptionDate?: Date;
  status: SubscriberStatus;
  plan: string;
  planDuration: number;
  interestedInCasting: boolean;
  tags: Tag[];
  recoveryNotes: RecoveryNote[];
  attachments: Attachment[];
  castingParticipations: string[]; // IDs of castings the subscriber is selected for
  createdAt: Date;
  promotion?: string; // Optional promotion code applied to the subscription
}

export interface Casting {
  id: string;
  theme: string;
  numberOfPeople: number;
  openingDate: Date;
  closingDate: Date;
  recordingDate: Date;
  postingDate: Date;
  selectedSubscribers: string[]; // IDs of selected subscribers
  createdAt: Date;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type DeliveryStatus = 'pending' | 'delivered' | 'failed';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  features: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Promotion {
  id: string;
  planId: string;
  name: string;
  description: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
  url: string;
  thumbnail?: string;
  createdAt: Date;
  participants: string[]; // IDs of subscribers who participated
}

export interface Sale {
  id: string;
  videoId: string;
  subscriberId: string;
  saleDate: Date;
  price: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  sentDate?: Date;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  status: 'planned' | 'in-progress' | 'completed';
  description?: string;
  locationDetails?: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  ideasIds: string[];
  equipmentIds: string[];
  participantsIds: string[];
}

export interface Idea {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  projectIds: string[];
}

export interface Equipment {
  id: string;
  name: string;
  type?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  quantity?: number;
  projectIds: string[];
}
