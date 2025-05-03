
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
