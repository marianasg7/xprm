
import React, { createContext, useContext, useState } from "react";
import { Plan, Promotion, Sale, Video } from "@/types/types";

type SalesContextType = {
  plans: Plan[];
  promotions: Promotion[];
  videos: Video[];
  sales: Sale[];
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
  const [plans, setPlans] = useState<Plan[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  const addPlan = (plan: Omit<Plan, "id" | "createdAt">) => {
    const newPlan: Plan = {
      ...plan,
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setSales([...sales, newSale]);
  };

  const updateSale = (updatedSale: Sale) => {
    setSales(sales.map(sale => sale.id === updatedSale.id ? updatedSale : sale));
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter(sale => sale.id !== id));
  };

  return (
    <SalesContext.Provider value={{
      plans,
      promotions,
      videos,
      sales,
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
      deleteSale
    }}>
      {children}
    </SalesContext.Provider>
  );
};
