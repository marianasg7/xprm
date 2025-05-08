
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowDown, Check, Send, User, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSales } from "@/context/SalesContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSubscribers } from "@/context/SubscriberContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const telegramFormSchema = z.object({
  telegramToken: z.string().min(1, "Telegram bot token is required"),
  chatId: z.string().min(1, "Chat ID is required"),
  notificationEnabled: z.boolean().default(true),
});

const TelegramPage: React.FC = () => {
  const { toast } = useToast();
  const { videos, addTelegramSale } = useSales();
  const { subscribers } = useSubscribers();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string, text: string, sender: 'bot' | 'user', timestamp: Date }>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedSubscriberId, setSelectedSubscriberId] = useState("");

  const telegramForm = useForm<z.infer<typeof telegramFormSchema>>({
    resolver: zodResolver(telegramFormSchema),
    defaultValues: {
      telegramToken: "",
      chatId: "",
      notificationEnabled: true,
    },
  });

  const handleConnect = (data: z.infer<typeof telegramFormSchema>) => {
    // Simulate connecting to Telegram
    toast({
      title: "Connected to Telegram",
      description: "Your bot has been successfully connected.",
    });
    setConnected(true);
    
    // Add initial bot message
    addMessage("Hello! I'm your sales bot. How can I help you today?", 'bot');
  };

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMsg = {
      id: crypto.randomUUID(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected) return;
    
    addMessage(newMessage, 'user');
    setNewMessage("");
    
    // Simulate bot response
    setTimeout(() => {
      if (newMessage.toLowerCase().includes('buy') || newMessage.toLowerCase().includes('purchase')) {
        addMessage("Sure! Here are our available videos:", 'bot');
        
        // List available videos
        videos.forEach(video => {
          setTimeout(() => {
            addMessage(`${video.title} - $${video.price} - ${video.duration} min`, 'bot');
          }, 500);
        });
        
        setTimeout(() => {
          addMessage("Please tell me which video you'd like to purchase and your subscriber ID.", 'bot');
        }, 1000);
      } else if (newMessage.toLowerCase().includes('video') || videos.some(v => newMessage.toLowerCase().includes(v.title.toLowerCase()))) {
        // Find mentioned video
        const mentionedVideo = videos.find(v => newMessage.toLowerCase().includes(v.title.toLowerCase()));
        if (mentionedVideo) {
          setSelectedVideoId(mentionedVideo.id);
          addMessage(`Great choice! "${mentionedVideo.title}" costs $${mentionedVideo.price}. Please confirm your purchase by entering your subscriber ID.`, 'bot');
        } else {
          addMessage("I'm not sure which video you're interested in. Could you specify which one?", 'bot');
        }
      } else if (subscribers.some(s => newMessage.toLowerCase().includes(s.id.toLowerCase()) || newMessage.toLowerCase().includes(s.name.toLowerCase()))) {
        // Find mentioned subscriber
        const mentionedSub = subscribers.find(s => 
          newMessage.toLowerCase().includes(s.id.toLowerCase()) || 
          newMessage.toLowerCase().includes(s.name.toLowerCase())
        );
        
        if (mentionedSub && selectedVideoId) {
          const video = videos.find(v => v.id === selectedVideoId);
          if (video) {
            setSelectedSubscriberId(mentionedSub.id);
            
            // Create the sale in "pending" status
            addTelegramSale({
              videoId: selectedVideoId,
              subscriberId: mentionedSub.id,
              saleDate: new Date(),
              price: video.price,
              quantity: 1,
              paymentStatus: "pending",
              deliveryStatus: "pending"
            });
            
            addMessage(`Thank you for your order! I've created a pending sale for "${video.title}" for subscriber ${mentionedSub.name}. Please make your payment and we'll process your order soon.`, 'bot');
            
            // Reset selection
            setSelectedVideoId("");
            setSelectedSubscriberId("");
            
            toast({
              title: "New Telegram Sale",
              description: `A new sale has been created from Telegram for ${video.title}`,
            });
          }
        } else if (mentionedSub && !selectedVideoId) {
          addMessage("Please select a video first before confirming with your subscriber ID.", 'bot');
        }
      } else {
        addMessage("I'm here to help you purchase videos. Type 'buy' to see our available videos.", 'bot');
      }
    }, 1000);
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
          <TabsTrigger value="chat" disabled={!connected}>Chat Simulator</TabsTrigger>
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
              <Form {...telegramForm}>
                <form onSubmit={telegramForm.handleSubmit(handleConnect)} className="space-y-6">
                  <FormField
                    control={telegramForm.control}
                    name="telegramToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token do Bot Telegram</FormLabel>
                        <FormControl>
                          <Input placeholder="Insira o token do seu bot" {...field} />
                        </FormControl>
                        <FormDescription>
                          Crie um bot via @BotFather no Telegram para obter um token
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={telegramForm.control}
                    name="chatId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID do Chat</FormLabel>
                        <FormControl>
                          <Input placeholder="Insira o ID do chat" {...field} />
                        </FormControl>
                        <FormDescription>
                          O chat onde as notificações serão enviadas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={telegramForm.control}
                    name="notificationEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Habilitar Notificações</FormLabel>
                          <FormDescription>
                            Receber notificações quando vendas forem registradas
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={connected}>
                    {connected ? "Conectado" : "Conectar Telegram"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      
        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="bg-blue-500 text-white py-4 px-4 flex flex-row items-center space-y-0">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>TB</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Sales Bot</CardTitle>
                  <CardDescription className="text-blue-100">Online</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
              <ScrollArea className="h-[400px] p-4">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : connected ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Comece uma conversa com o bot de vendas!</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Conecte seu bot para iniciar</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4">
              <form onSubmit={handleSendMessage} className="w-full flex gap-2">
                <Input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  disabled={!connected}
                  className="flex-grow"
                />
                <Button type="submit" disabled={!connected || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Instruções de Simulação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Esta é uma simulação de como os clientes interagem com seu bot do Telegram. As vendas automáticas são processadas e enviadas para a página de Vendas.</p>
                <p className="text-sm font-medium">Comandos que você pode testar:</p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mt-2">
                  <li>"Quero comprar um vídeo"</li>
                  <li>"Mostrar vídeos disponíveis"</li>
                  <li>"Quero comprar [nome do vídeo]"</li>
                  <li>"Meu ID é [id do assinante]"</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelegramPage;
