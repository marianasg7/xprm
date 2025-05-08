
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSales } from "@/context/SalesContext";
import { useSubscribers } from "@/context/SubscriberContext";
import { TelegramConnectionForm, TelegramFormData } from "@/components/telegram/TelegramConnectionForm";
import { TelegramChatSimulator } from "@/components/telegram/TelegramChatSimulator";
import { TelegramInstructions } from "@/components/telegram/TelegramInstructions";

const TelegramPage: React.FC = () => {
  const { toast } = useToast();
  const { videos, addTelegramSale } = useSales();
  const { subscribers } = useSubscribers();
  const [connected, setConnected] = useState(false);

  const handleConnect = (data: TelegramFormData) => {
    // Simulate connecting to Telegram
    toast({
      title: "Connected to Telegram",
      description: "Your bot has been successfully connected.",
    });
    setConnected(true);
  };

  const handleTelegramSale = (videoId: string, subscriberId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      addTelegramSale({
        videoId: videoId,
        subscriberId: subscriberId,
        saleDate: new Date(),
        price: video.price,
        quantity: 1,
        paymentStatus: "pending",
        deliveryStatus: "pending",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Telegram Simulator</h1>
        <p className="text-muted-foreground mt-1">
          Simula a interação de clientes com seu bot do Telegram
        </p>
      </div>

      <Tabs defaultValue={connected ? "chat" : "connection"} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="connection">Conexão</TabsTrigger>
          <TabsTrigger value="chat" disabled={!connected}>
            Chat Simulator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle>Conectar Bot Telegram</CardTitle>
              <CardDescription>
                Vincule seu bot do Telegram para habilitar vendas automáticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TelegramConnectionForm onConnect={handleConnect} connected={connected} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <TelegramChatSimulator 
            connected={connected} 
            videos={videos} 
            subscribers={subscribers} 
            onSale={handleTelegramSale} 
          />
          
          <div className="mt-4">
            <TelegramInstructions />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelegramPage;
