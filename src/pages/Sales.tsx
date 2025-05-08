import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSales } from "@/context/SalesContext";
import { Sale, PaymentStatus, DeliveryStatus, Video } from "@/types/types";
import { useSubscribers } from "@/context/SubscriberContext";
import { PlusCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Import our new components
import { SalesStatistics } from "@/components/sales/SalesStatistics";
import { VideoCard } from "@/components/sales/VideoCard";
import { VideoDialog } from "@/components/sales/VideoDialog";
import { SaleDialog } from "@/components/sales/SaleDialog";
import { TelegramDialog } from "@/components/sales/TelegramDialog";
import { SalesTable } from "@/components/sales/SalesTable";

const Sales: React.FC = () => {
  const { toast } = useToast();
  const { videos, sales, addVideo, updateVideo, deleteVideo, addSale, updateSale, deleteSale } = useSales();
  const { subscribers } = useSubscribers();
  
  const [newVideo, setNewVideo] = useState<Omit<Video, "id" | "createdAt">>({
    title: "",
    description: "",
    price: 0,
    duration: 0,
    url: "",
    participants: []
  });

  const [newSale, setNewSale] = useState<Omit<Sale, "id" | "createdAt">>({
    videoId: "",
    subscriberId: "",
    saleDate: new Date(),
    price: 0,
    quantity: 1,
    paymentStatus: "pending" as PaymentStatus,
    deliveryStatus: "pending" as DeliveryStatus
  });

  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  
  const [telegramWebhookUrl, setTelegramWebhookUrl] = useState<string>("");
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);
  const [sendingSale, setSendingSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [telegramSales, setTelegramSales] = useState<Sale[]>([]);
  const [manualSales, setManualSales] = useState<Sale[]>([]);

  // Filter sales by source when tab changes
  useEffect(() => {
    setTelegramSales(sales.filter(sale => sale.source === 'telegram'));
    setManualSales(sales.filter(sale => sale.source !== 'telegram'));
  }, [sales]);

  const handleAddVideo = () => {
    if (editingVideo) {
      updateVideo({
        ...editingVideo,
      });
      setEditingVideo(null);
    } else {
      addVideo({
        ...newVideo,
        participants: []
      });
      setNewVideo({
        title: "",
        description: "",
        price: 0,
        duration: 0,
        url: "",
        participants: []
      });
    }
    setVideoDialogOpen(false);
  };

  const handleAddSale = () => {
    // Set the price from the selected video
    const selectedVideo = videos.find(v => v.id === (editingSale ? editingSale.videoId : newSale.videoId));
    const salePrice = selectedVideo?.price || 0;
    
    if (editingSale) {
      updateSale({
        ...editingSale,
        price: salePrice
      });
      setEditingSale(null);
    } else {
      addSale({
        ...newSale,
        price: salePrice
      });
      setNewSale({
        videoId: "",
        subscriberId: "",
        saleDate: new Date(),
        price: 0,
        quantity: 1,
        paymentStatus: "pending",
        deliveryStatus: "pending"
      });
    }
    setSaleDialogOpen(false);
  };

  const handleUpdatePaymentStatus = (sale: Sale, status: PaymentStatus) => {
    updateSale({
      ...sale,
      paymentStatus: status,
    });
  };

  const handleUpdateDeliveryStatus = (sale: Sale, status: DeliveryStatus) => {
    // Check if the order has been sent to Telegram first before allowing delivery
    if (status === "delivered" && !sale.sentDate) {
      toast({
        title: "Delivery Error",
        description: "You must send the sale to Telegram before marking as delivered",
        variant: "destructive",
      });
      return;
    }
    
    updateSale({
      ...sale,
      deliveryStatus: status,
      ...(status === "delivered" ? { sentDate: new Date() } : {})
    });
  };

  const openTelegramDialog = (sale: Sale) => {
    setSendingSale(sale);
    setDeliveryError(null);
    setTelegramDialogOpen(true);
  };

  const sendToTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendingSale || !telegramWebhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Telegram webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setDeliveryError(null);
    
    try {
      const subscriber = subscribers.find(s => s.id === sendingSale.subscriberId);
      const video = videos.find(v => v.id === sendingSale.videoId);
      
      // Mock sending to Telegram (in a real app, this would connect to an actual webhook)
      // Using no-cors mode to prevent CORS issues with the webhook
      await fetch(telegramWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          message: `Video: ${video?.title}\nSent to: ${subscriber?.name}\nQuantity: ${sendingSale.quantity || 1}\nPrice: $${sendingSale.price * (sendingSale.quantity || 1)}\nStatus: ${sendingSale.paymentStatus}`,
          timestamp: new Date().toISOString(),
        }),
      });

      toast({
        title: "Notification Sent",
        description: "The message was sent to Telegram successfully.",
      });
      
      // Update the sale to include sent date
      updateSale({
        ...sendingSale,
        sentDate: new Date()
      });
      
      setTelegramDialogOpen(false);
    } catch (error) {
      console.error("Error sending to Telegram:", error);
      setDeliveryError("Failed to send the message to Telegram. Please check the webhook URL and try again.");
      toast({
        title: "Error",
        description: "Failed to send the message to Telegram. Please check the webhook URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get video title
  const getVideoTitle = (id: string) => {
    const video = videos.find(v => v.id === id);
    return video ? video.title : "Unknown Video";
  };

  // Helper to check if a sale can be delivered
  const canBeDelivered = (sale: Sale) => {
    return sale.paymentStatus === "paid" && sale.sentDate && sale.deliveryStatus !== "delivered";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage video content and track sales
        </p>
      </div>

      {/* Sales Statistics */}
      <SalesStatistics sales={sales} />

      {/* Videos Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Videos</h2>
        <VideoDialog 
          open={videoDialogOpen} 
          onOpenChange={setVideoDialogOpen}
          editingVideo={editingVideo}
          onSave={handleAddVideo}
          newVideo={newVideo}
          setNewVideo={setNewVideo}
          setEditingVideo={setEditingVideo}
        />
        <DialogTrigger asChild onClick={() => {
          setEditingVideo(null);
          setNewVideo({
            title: "",
            description: "",
            price: 0,
            duration: 0,
            url: "",
            participants: []
          });
        }}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Video
          </Button>
        </DialogTrigger>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onEdit={handleEditVideo} 
            onDelete={deleteVideo} 
          />
        ))}

        {videos.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No videos added yet. Add a video to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sales Section */}
      <div className="flex justify-between items-center mt-8">
        <h2 className="text-xl font-semibold">Sales Records</h2>
        <SaleDialog 
          open={saleDialogOpen} 
          onOpenChange={setSaleDialogOpen}
          editingSale={editingSale}
          onSave={handleAddSale}
          newSale={newSale}
          setNewSale={setNewSale}
          setEditingSale={setEditingSale}
          videos={videos}
          subscribers={subscribers}
        />
        <DialogTrigger asChild onClick={() => {
          setEditingSale(null);
          setNewSale({
            videoId: videos.length > 0 ? videos[0].id : "",
            subscriberId: subscribers.length > 0 ? subscribers[0].id : "",
            saleDate: new Date(),
            price: 0,
            quantity: 1,
            paymentStatus: "pending",
            deliveryStatus: "pending"
          });
        }}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Record Sale
          </Button>
        </DialogTrigger>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Sales</TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Telegram Sales
            {telegramSales.length > 0 && (
              <Badge variant="secondary" className="ml-1">{telegramSales.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="manual">Manual Sales</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0 overflow-auto">
              <SalesTable
                sales={sales}
                subscribers={subscribers}
                getVideoTitle={getVideoTitle}
                onEdit={setEditingSale}
                onDelete={deleteSale}
                onSend={openTelegramDialog}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
                onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
                canBeDelivered={canBeDelivered}
                activeTab={activeTab}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="telegram">
          <Card>
            <CardContent className="p-0 overflow-auto">
              <SalesTable
                sales={telegramSales}
                subscribers={subscribers}
                getVideoTitle={getVideoTitle}
                onEdit={setEditingSale}
                onDelete={deleteSale}
                onSend={openTelegramDialog}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
                onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
                canBeDelivered={canBeDelivered}
                activeTab={activeTab}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manual">
          <Card>
            <CardContent className="p-0 overflow-auto">
              <SalesTable
                sales={manualSales}
                subscribers={subscribers}
                getVideoTitle={getVideoTitle}
                onEdit={setEditingSale}
                onDelete={deleteSale}
                onSend={openTelegramDialog}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
                onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
                canBeDelivered={canBeDelivered}
                activeTab={activeTab}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Telegram Dialog */}
      <TelegramDialog
        open={telegramDialogOpen}
        onOpenChange={setTelegramDialogOpen}
        sendingSale={sendingSale}
        telegramWebhookUrl={telegramWebhookUrl}
        setTelegramWebhookUrl={setTelegramWebhookUrl}
        isLoading={isLoading}
        deliveryError={deliveryError}
        onSubmit={sendToTelegram}
        getVideoTitle={getVideoTitle}
      />
    </div>
  );
};

export default Sales;
