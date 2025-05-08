import React, { createContext, useContext, useState } from "react";
import { Plan, Promotion, Sale, Video, Casting } from "@/types/types";
import { nanoid } from "nanoid";

type SalesContextType = {
  plans: Plan[];
  promotions: Promotion[];
  videos: Video[];
  sales: Sale[];
  castings: Casting[];
  addPlan: (plan: Omit<Plan, "id" | "createdAt">) => void;
  updatePlan: (plan: Plan) => void;
  deletePlan: (id: string) => void;
  addPromotion: (promotion: Omit<Promotion, "id" | "createdAt">) => void;
  updatePromotion: (promotion: Promotion) => void;
  deletePromotion: (id: string) => void;
  addVideo: (video: Omit<Video, "id" | "createdAt">) => void;
  updateVideo: (video: Video) => void;
  deleteVideo: (id: string) => void;
  addSale: (sale: Omit<Sale, "id" | "createdAt">) => void;
  updateSale: (sale: Sale) => void;
  deleteSale: (id: string) => void;
  addTelegramSale: (sale: Omit<Sale, "id" | "createdAt" | "source">) => void;
  getCastings: () => Casting[];
  updateCasting: (casting: Casting) => void;
  associateProjectWithCasting: (castingId: string, projectId: string) => void;
  removeProjectFromCasting: (castingId: string, projectId: string) => void;
};

// Generate mock plans for testing
const generateMockPlans = (): Plan[] => {
  return [
    {
      id: nanoid(),
      name: "Basic",
      description: "Standard subscription with basic features",
      price: 9.99,
      duration: 1,
      features: ["Basic content", "Monthly updates"],
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      name: "Premium",
      description: "Premium subscription with exclusive content",
      price: 19.99,
      duration: 3,
      features: ["All basic features", "Exclusive content", "Priority support"],
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      name: "Gold",
      description: "Gold tier with all premium features plus extras",
      price: 29.99,
      duration: 6,
      features: ["All premium features", "Early access", "Bonus content"],
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: nanoid(),
      name: "Platinum",
      description: "Our best yearly subscription with all features",
      price: 99.99,
      duration: 12,
      features: ["All gold features", "Casting priority", "Personalized content"],
      isActive: true,
      createdAt: new Date(),
    },
  ];
};

// Generate mock castings
const generateMockCastings = (): Casting[] => {
  return [
    {
      id: nanoid(),
      theme: "Summer Beach",
      numberOfPeople: 3,
      openingDate: new Date(),
      closingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      recordingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      postingDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      selectedSubscribers: [],
      createdAt: new Date(),
      associatedProjectIds: []
    },
    {
      id: nanoid(),
      theme: "Halloween Special",
      numberOfPeople: 4,
      openingDate: new Date(),
      closingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      recordingDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
      postingDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
      selectedSubscribers: [],
      createdAt: new Date(),
      associatedProjectIds: []
    }
  ];
};

// Generate mock videos
const generateMockVideos = (): Video[] => {
  return [
    {
      id: nanoid(),
      title: "Beach Day Fun",
      description: "Summer themed video at the beach",
      price: 19.99,
      duration: 15,
      url: "https://example.com/video1",
      createdAt: new Date(),
      participants: []
    },
    {
      id: nanoid(),
      title: "Sunset Shoot",
      description: "Beautiful sunset themed video",
      price: 24.99,
      duration: 20,
      url: "https://example.com/video2",
      createdAt: new Date(),
      participants: []
    }
  ];
};

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
};

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<Plan[]>(generateMockPlans());
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [videos, setVideos] = useState<Video[]>(generateMockVideos());
  const [sales, setSales] = useState<Sale[]>([]);
  const [castings, setCastings] = useState<Casting[]>(generateMockCastings());

  const addPlan = (plan: Omit<Plan, "id" | "createdAt">) => {
    const newPlan: Plan = {
      ...plan,
      id: nanoid(),
      createdAt: new Date(),
    };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (updatedPlan: Plan) => {
    setPlans(plans.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan));
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const addPromotion = (promotion: Omit<Promotion, "id" | "createdAt">) => {
    const newPromotion: Promotion = {
      ...promotion,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setPromotions([...promotions, newPromotion]);
  };

  const updatePromotion = (updatedPromotion: Promotion) => {
    setPromotions(promotions.map(promotion => 
      promotion.id === updatedPromotion.id ? updatedPromotion : promotion
    ));
  };

  const deletePromotion = (id: string) => {
    setPromotions(promotions.filter(promotion => promotion.id !== id));
  };

  const addVideo = (video: Omit<Video, "id" | "createdAt">) => {
    const newVideo: Video = {
      ...video,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setVideos([...videos, newVideo]);
  };

  const updateVideo = (updatedVideo: Video) => {
    setVideos(videos.map(video => video.id === updatedVideo.id ? updatedVideo : video));
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  const addSale = (sale: Omit<Sale, "id" | "createdAt">) => {
    const newSale: Sale = {
      ...sale,
      quantity: sale.quantity || 1, // Default to 1 if not specified
      id: crypto.randomUUID(),
      createdAt: new Date(),
      source: 'manual', // Default source is manual
    };
    setSales([...sales, newSale]);
  };

  const addTelegramSale = (sale: Omit<Sale, "id" | "createdAt" | "source">) => {
    const newSale: Sale = {
      ...sale,
      quantity: sale.quantity || 1,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      source: 'telegram', // Mark as coming from Telegram
    };
    setSales([...sales, newSale]);
  };

  const updateSale = (updatedSale: Sale) => {
    setSales(sales.map(sale => sale.id === updatedSale.id ? updatedSale : sale));
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter(sale => sale.id !== id));
  };

  const getCastings = () => castings;
  
  const updateCasting = (updatedCasting: Casting) => {
    setCastings(castings.map(casting => 
      casting.id === updatedCasting.id ? updatedCasting : casting
    ));
  };

  const associateProjectWithCasting = (castingId: string, projectId: string) => {
    setCastings(castings.map(casting => {
      if (casting.id === castingId) {
        const associatedProjectIds = casting.associatedProjectIds || [];
        if (!associatedProjectIds.includes(projectId)) {
          return {
            ...casting,
            associatedProjectIds: [...associatedProjectIds, projectId]
          };
        }
      }
      return casting;
    }));
  };

  const removeProjectFromCasting = (castingId: string, projectId: string) => {
    setCastings(castings.map(casting => {
      if (casting.id === castingId && casting.associatedProjectIds) {
        return {
          ...casting,
          associatedProjectIds: casting.associatedProjectIds.filter(id => id !== projectId)
        };
      }
      return casting;
    }));
  };

  return (
    <SalesContext.Provider value={{
      plans,
      promotions,
      videos,
      sales,
      castings,
      addPlan,
      updatePlan,
      deletePlan,
      addPromotion,
      updatePromotion,
      deletePromotion,
      addVideo,
      updateVideo,
      deleteVideo,
      addSale,
      updateSale,
      deleteSale,
      addTelegramSale,
      getCastings,
      updateCasting,
      associateProjectWithCasting,
      removeProjectFromCasting
    }}>
      {children}
    </SalesContext.Provider>
  );
};
