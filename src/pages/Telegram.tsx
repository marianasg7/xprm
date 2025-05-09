
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSales } from "@/context/SalesContext";
import { useSubscribers } from "@/context/SubscriberContext";
import { TelegramConnectionForm, TelegramFormData } from "@/components/telegram/TelegramConnectionForm";
import { TelegramChatSimulator } from "@/components/telegram/TelegramChatSimulator";
import { TelegramInstructions } from "@/components/telegram/TelegramInstructions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Menu, Phone, VideoIcon, ArrowLeft, MoreVertical } from "lucide-react";

const TelegramPage: React.FC = () => {
  const { toast } = useToast();
  const { videos, addTelegramSale } = useSales();
  const { subscribers } = useSubscribers();
  const [connected, setConnected] = useState(false);
  const [chatView, setChatView] = useState<'list' | 'chat'>('list');
  const [selectedUser, setSelectedUser] = useState<{name: string, photoUrl?: string} | null>(null);

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

  const handleChatSelect = (subscriber: any) => {
    setSelectedUser(subscriber);
    setChatView('chat');
  };

  const handleBackToList = () => {
    setChatView('list');
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Telegram Simulator</h1>
        <p className="text-muted-foreground mt-1">
          Simula a interação de clientes com seu bot do Telegram
        </p>
      </div>

      <Tabs defaultValue={connected ? "telegram" : "connection"} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="connection">Conexão</TabsTrigger>
          <TabsTrigger value="telegram" disabled={!connected}>
            Telegram Simulator
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

        <TabsContent value="telegram">
          <Card className="border-0 shadow-md overflow-hidden">
            {/* Telegram App Header */}
            <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
              {chatView === 'chat' && (
                <Button variant="ghost" size="icon" className="text-white" onClick={handleBackToList}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              
              <div className="flex-1 px-3">
                <h2 className="text-lg font-bold">
                  {chatView === 'list' ? 'Telegram' : selectedUser?.name}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                {chatView === 'list' ? (
                  <Button variant="ghost" size="icon" className="text-white">
                    <Search className="h-5 w-5" />
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="icon" className="text-white">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white">
                      <VideoIcon className="h-5 w-5" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" className="text-white">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {chatView === 'list' ? (
              <div className="h-[600px] overflow-auto bg-white">
                <div className="p-2 bg-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Pesquisar"
                      className="w-full bg-white rounded-full py-2 pl-10 pr-3 text-sm focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="divide-y">
                  {subscribers.map((subscriber) => (
                    <div
                      key={subscriber.id}
                      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleChatSelect(subscriber)}
                    >
                      <Avatar className="h-12 w-12 mr-3">
                        {subscriber.photoUrl ? (
                          <AvatarImage src={subscriber.photoUrl} alt={subscriber.name} />
                        ) : (
                          <AvatarFallback>{subscriber.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{subscriber.name}</h3>
                        <p className="text-sm text-gray-500 truncate">Clique para iniciar uma conversa</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <TelegramChatSimulator
                connected={connected}
                videos={videos}
                subscribers={subscribers.filter(s => selectedUser && s.name === selectedUser.name)}
                onSale={handleTelegramSale}
              />
            )}
            
            {chatView === 'list' && (
              <div className="absolute bottom-6 right-6">
                <Button size="icon" className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600">
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            )}
          </Card>
          
          <div className="mt-4">
            <TelegramInstructions />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelegramPage;
