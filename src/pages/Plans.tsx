
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { BadgePercent } from "lucide-react"; // Using BadgePercent for promotion
import { Plan, Promotion } from "@/types/types";
import { nanoid } from "nanoid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data
const initialPlans: Plan[] = [
  {
    id: "plan-1",
    name: "Basic",
    description: "Standard subscription with basic content",
    price: 9.99,
    duration: 1,
    features: ["Access to standard content", "Monthly updates"],
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "plan-2",
    name: "Premium",
    description: "Premium subscription with exclusive content",
    price: 19.99,
    duration: 1,
    features: ["Access to standard content", "Access to premium content", "Weekly updates", "Direct messaging"],
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "plan-3",
    name: "Gold",
    description: "Gold subscription with all content and priority access",
    price: 29.99,
    duration: 1,
    features: [
      "Access to all content", 
      "Priority updates", 
      "Direct messaging", 
      "Custom requests", 
      "Early access to new content"
    ],
    isActive: true,
    createdAt: new Date(),
  },
];

const initialPromotions: Promotion[] = [
  {
    id: "promo-1",
    planId: "plan-2",
    name: "Summer Sale",
    description: "Limited time summer discount",
    discountPercentage: 20,
    startDate: new Date(2025, 5, 1),
    endDate: new Date(2025, 7, 31),
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "promo-2",
    planId: "plan-1",
    name: "New User Discount",
    description: "Special offer for new subscribers",
    discountPercentage: 15,
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 11, 31),
    isActive: true,
    createdAt: new Date(),
  },
];

const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddPlan = () => {
    setIsPlanDialogOpen(true);
    // For demo purposes, we'll just show a toast instead of implementing the full form
    toast({
      title: "Add Plan",
      description: "This would open a form to create a new plan",
    });
  };

  const handleAddPromotion = () => {
    setIsPromotionDialogOpen(true);
    // For demo purposes, we'll just show a toast
    toast({
      title: "Add Promotion",
      description: "This would open a form to create a new promotion",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription plans and promotions
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleAddPromotion}>
            <BadgePercent className="mr-2 h-4 w-4" />
            Add Promotion
          </Button>
          <Button onClick={handleAddPlan}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Active Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.filter(plan => plan.isActive).map((plan) => (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <Badge>${plan.price.toFixed(2)}/mo</Badge>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm">{feature}</li>
                  ))}
                </ul>
                
                {/* Display linked promotions */}
                {promotions.filter(promo => promo.planId === plan.id && promo.isActive).length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Current promotions:</p>
                    {promotions
                      .filter(promo => promo.planId === plan.id && promo.isActive)
                      .map(promo => (
                        <div key={promo.id} className="bg-secondary/50 p-2 rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{promo.name}</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-0">
                              {promo.discountPercentage}% OFF
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{promo.description}</p>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex justify-end w-full space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        <h2 className="text-xl font-semibold">All Promotions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((promo) => {
            const relatedPlan = plans.find(p => p.id === promo.planId);
            return (
              <Card key={promo.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{promo.name}</CardTitle>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-0">
                      {promo.discountPercentage}% OFF
                    </Badge>
                  </div>
                  <CardDescription>{promo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Applied to: </span>
                      <span>{relatedPlan?.name || 'Unknown plan'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Valid from: </span>
                      <span>
                        {promo.startDate.toLocaleDateString()} to {promo.endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Status: </span>
                      <Badge variant={promo.isActive ? "default" : "secondary"}>
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-end w-full space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Plan Dialog - Just a placeholder */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>This would be a form to create a new plan.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Promotion Dialog - Just a placeholder */}
      <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Promotion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>This would be a form to create a new promotion.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansPage;
