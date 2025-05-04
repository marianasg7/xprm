
import React, { useState } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle,
  CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSales } from "@/context/SalesContext";
import { Plan, Promotion } from "@/types/types";
import { formatDate } from "@/lib/utils";
import { useSubscribers } from "@/context/SubscriberContext";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

const Plans: React.FC = () => {
  const { plans, promotions, addPlan, updatePlan, deletePlan, addPromotion, updatePromotion, deletePromotion } = useSales();
  const { subscribers } = useSubscribers();
  
  const [newPlan, setNewPlan] = useState<Omit<Plan, "id" | "createdAt">>({
    name: "",
    description: "",
    price: 0,
    duration: 1,
    features: [],
    isActive: true
  });

  const [newPromotion, setNewPromotion] = useState<Omit<Promotion, "id" | "createdAt">>({
    planId: "",
    name: "",
    description: "",
    discountPercentage: 0,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true
  });

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);

  const handleAddPlan = () => {
    if (editingPlan) {
      updatePlan(editingPlan);
      setEditingPlan(null);
    } else {
      addPlan(newPlan);
      setNewPlan({
        name: "",
        description: "",
        price: 0,
        duration: 1,
        features: [],
        isActive: true
      });
    }
    setPlanDialogOpen(false);
  };

  const handleAddPromotion = () => {
    if (editingPromotion) {
      updatePromotion(editingPromotion);
      setEditingPromotion(null);
    } else {
      addPromotion(newPromotion);
      setNewPromotion({
        planId: "",
        name: "",
        description: "",
        discountPercentage: 0,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        isActive: true
      });
    }
    setPromoDialogOpen(false);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanDialogOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setPromoDialogOpen(true);
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, newFeature]
      });
    } else {
      setNewPlan({
        ...newPlan,
        features: [...newPlan.features, newFeature]
      });
    }
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    if (editingPlan) {
      const updatedFeatures = [...editingPlan.features];
      updatedFeatures.splice(index, 1);
      setEditingPlan({
        ...editingPlan,
        features: updatedFeatures
      });
    } else {
      const updatedFeatures = [...newPlan.features];
      updatedFeatures.splice(index, 1);
      setNewPlan({
        ...newPlan,
        features: updatedFeatures
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plans & Promotions</h1>
        <p className="text-muted-foreground mt-1">
          Manage subscription plans and promotional offers
        </p>
      </div>

      {/* Plans Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Subscription Plans</h2>
        <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPlan(null);
              setNewPlan({
                name: "",
                description: "",
                price: 0,
                duration: 1,
                features: [],
                isActive: true
              });
            }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
              <DialogDescription>
                Create a new subscription plan for your subscribers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-name" className="col-span-1">Name</Label>
                <Input
                  id="plan-name"
                  className="col-span-3"
                  value={editingPlan ? editingPlan.name : newPlan.name}
                  onChange={(e) => editingPlan 
                    ? setEditingPlan({...editingPlan, name: e.target.value})
                    : setNewPlan({...newPlan, name: e.target.value})
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-description" className="col-span-1">Description</Label>
                <Textarea
                  id="plan-description"
                  className="col-span-3"
                  value={editingPlan ? editingPlan.description : newPlan.description}
                  onChange={(e) => editingPlan
                    ? setEditingPlan({...editingPlan, description: e.target.value})
                    : setNewPlan({...newPlan, description: e.target.value})
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-price" className="col-span-1">Price ($)</Label>
                <Input
                  id="plan-price"
                  className="col-span-3"
                  type="number"
                  value={editingPlan ? editingPlan.price : newPlan.price}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    editingPlan
                      ? setEditingPlan({...editingPlan, price: value})
                      : setNewPlan({...newPlan, price: value});
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan-duration" className="col-span-1">Duration (months)</Label>
                <Input
                  id="plan-duration"
                  className="col-span-3"
                  type="number"
                  value={editingPlan ? editingPlan.duration : newPlan.duration}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    editingPlan
                      ? setEditingPlan({...editingPlan, duration: value})
                      : setNewPlan({...newPlan, duration: value});
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-1">Features</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                    />
                    <Button type="button" onClick={handleAddFeature}>Add</Button>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {(editingPlan ? editingPlan.features : newPlan.features).map((feature, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{feature}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveFeature(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="plan-active" 
                  checked={editingPlan ? editingPlan.isActive : newPlan.isActive}
                  onCheckedChange={(checked) => {
                    const isActive = checked === true;
                    editingPlan
                      ? setEditingPlan({...editingPlan, isActive})
                      : setNewPlan({...newPlan, isActive});
                  }}
                />
                <Label htmlFor="plan-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddPlan}>{editingPlan ? "Update" : "Create"} Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.isActive ? "" : "opacity-70"}>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    {plan.name}
                    {!plan.isActive && <span className="ml-2 text-xs text-red-500">(Inactive)</span>}
                  </CardTitle>
                  <CardDescription>${plan.price} / {plan.duration} {plan.duration === 1 ? "month" : "months"}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditPlan(plan)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deletePlan(plan.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{plan.description}</p>
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Created: {formatDate(plan.createdAt)}</p>
            </CardFooter>
          </Card>
        ))}

        {plans.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No plans created yet. Add a plan to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Promotions Section */}
      <div className="flex justify-between items-center mt-8">
        <h2 className="text-xl font-semibold">Promotions</h2>
        <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPromotion(null);
              setNewPromotion({
                planId: plans.length > 0 ? plans[0].id : "",
                name: "",
                description: "",
                discountPercentage: 0,
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                isActive: true
              });
            }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingPromotion ? "Edit Promotion" : "Add New Promotion"}</DialogTitle>
              <DialogDescription>
                Create a promotional offer for a subscription plan
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="promo-plan" className="col-span-1">Plan</Label>
                <select
                  id="promo-plan"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editingPromotion ? editingPromotion.planId : newPromotion.planId}
                  onChange={(e) => editingPromotion
                    ? setEditingPromotion({...editingPromotion, planId: e.target.value})
                    : setNewPromotion({...newPromotion, planId: e.target.value})
                  }
                >
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="promo-name" className="col-span-1">Name</Label>
                <Input
                  id="promo-name"
                  className="col-span-3"
                  value={editingPromotion ? editingPromotion.name : newPromotion.name}
                  onChange={(e) => editingPromotion
                    ? setEditingPromotion({...editingPromotion, name: e.target.value})
                    : setNewPromotion({...newPromotion, name: e.target.value})
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="promo-description" className="col-span-1">Description</Label>
                <Textarea
                  id="promo-description"
                  className="col-span-3"
                  value={editingPromotion ? editingPromotion.description : newPromotion.description}
                  onChange={(e) => editingPromotion
                    ? setEditingPromotion({...editingPromotion, description: e.target.value})
                    : setNewPromotion({...newPromotion, description: e.target.value})
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount" className="col-span-1">Discount %</Label>
                <Input
                  id="discount"
                  className="col-span-3"
                  type="number"
                  min="0" 
                  max="100"
                  value={editingPromotion ? editingPromotion.discountPercentage : newPromotion.discountPercentage}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    editingPromotion
                      ? setEditingPromotion({...editingPromotion, discountPercentage: value})
                      : setNewPromotion({...newPromotion, discountPercentage: value});
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-date" className="col-span-1">Start Date</Label>
                <Input
                  id="start-date"
                  className="col-span-3"
                  type="date"
                  value={editingPromotion 
                    ? new Date(editingPromotion.startDate).toISOString().split('T')[0] 
                    : new Date(newPromotion.startDate).toISOString().split('T')[0]
                  }
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    editingPromotion
                      ? setEditingPromotion({...editingPromotion, startDate: date})
                      : setNewPromotion({...newPromotion, startDate: date});
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="col-span-1">End Date</Label>
                <Input
                  id="end-date"
                  className="col-span-3"
                  type="date"
                  value={editingPromotion
                    ? new Date(editingPromotion.endDate).toISOString().split('T')[0]
                    : new Date(newPromotion.endDate).toISOString().split('T')[0]
                  }
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    editingPromotion
                      ? setEditingPromotion({...editingPromotion, endDate: date})
                      : setNewPromotion({...newPromotion, endDate: date});
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="promo-active" 
                  checked={editingPromotion ? editingPromotion.isActive : newPromotion.isActive}
                  onCheckedChange={(checked) => {
                    const isActive = checked === true;
                    editingPromotion
                      ? setEditingPromotion({...editingPromotion, isActive})
                      : setNewPromotion({...newPromotion, isActive});
                  }}
                />
                <Label htmlFor="promo-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddPromotion}>
                {editingPromotion ? "Update" : "Create"} Promotion
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion) => {
          const relatedPlan = plans.find(p => p.id === promotion.planId);
          return (
            <Card key={promotion.id} className={promotion.isActive ? "" : "opacity-70"}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {promotion.name}
                      {!promotion.isActive && <span className="ml-2 text-xs text-red-500">(Inactive)</span>}
                    </CardTitle>
                    <CardDescription>{relatedPlan?.name || "Unknown Plan"} - {promotion.discountPercentage}% off</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEditPromotion(promotion)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deletePromotion(promotion.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{promotion.description}</p>
                <div className="text-sm">
                  <p><span className="font-medium">Start Date:</span> {formatDate(promotion.startDate)}</p>
                  <p><span className="font-medium">End Date:</span> {formatDate(promotion.endDate)}</p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">Created: {formatDate(promotion.createdAt)}</p>
              </CardFooter>
            </Card>
          );
        })}

        {promotions.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No promotions created yet. Add a promotion to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Plans;
