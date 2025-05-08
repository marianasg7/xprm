
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowDown, Check, Save, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSales } from "@/context/SalesContext";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus, DeliveryStatus, Sale, Video } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const telegramFormSchema = z.object({
  telegramToken: z.string().min(1, "Telegram bot token is required"),
  chatId: z.string().min(1, "Chat ID is required"),
  notificationEnabled: z.boolean().default(true),
});

const TelegramPage: React.FC = () => {
  const { toast } = useToast();
  const { plans, videos, sales, addSale, updateSale } = useSales();
  const [connected, setConnected] = useState(false);
  const [autoSales, setAutoSales] = useState<Sale[]>([]);

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
  };

  const handleMarkAsPaid = (saleId: string) => {
    // Atualiza o status da venda para pago
    updateSale({
      ...sales.find(sale => sale.id === saleId)!,
      paymentStatus: "paid"
    });
    
    // Atualiza a lista local
    setAutoSales(autoSales.map(sale => 
      sale.id === saleId ? { ...sale, paymentStatus: "paid" } : sale
    ));
    
    toast({
      title: "Payment verified",
      description: "The payment has been marked as verified.",
    });
  };

  const handleSendVideo = (saleId: string) => {
    // Atualiza o status da entrega para entregue
    const sale = sales.find(sale => sale.id === saleId)!;
    updateSale({
      ...sale,
      deliveryStatus: "delivered",
      sentDate: new Date()
    });
    
    // Atualiza a lista local
    setAutoSales(autoSales.map(s => 
      s.id === saleId ? { ...s, deliveryStatus: "delivered", sentDate: new Date() } : s
    ));
    
    toast({
      title: "Video sent",
      description: "The video has been sent to the customer.",
    });
  };

  // Simulação de recebimento de vendas automáticas via API do Telegram
  const simulateNewTelegramSale = () => {
    if (!connected) {
      toast({
        title: "Not connected",
        description: "Please connect your Telegram bot first.",
        variant: "destructive",
      });
      return;
    }

    // Simulando dados que viriam da API do Telegram
    const randomVideo = videos[Math.floor(Math.random() * videos.length)] || {
      id: "video-1",
      title: "Sample Video",
      price: 19.99
    };
    
    const randomSubscriberId = `sub-${Math.floor(Math.random() * 1000)}`;
    
    const newSale: Omit<Sale, "id" | "createdAt"> = {
      videoId: randomVideo.id,
      subscriberId: randomSubscriberId,
      saleDate: new Date(),
      price: randomVideo.price,
      paymentStatus: "pending",
      deliveryStatus: "pending"
    };

    // Adiciona a venda ao sistema
    addSale(newSale);
    
    const saleWithId = {
      ...newSale,
      id: `sale-${Date.now()}`,
      createdAt: new Date()
    };
    
    // Adiciona à lista local
    setAutoSales([saleWithId, ...autoSales]);

    toast({
      title: "New sale received",
      description: "A new sale has been automatically recorded from Telegram.",
    });
  };

  // Status styling helpers
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case "failed":
        return <Badge className="bg-red-600">Falhou</Badge>;
      case "refunded":
        return <Badge className="bg-purple-600">Reembolsado</Badge>;
    }
  };
  
  const getDeliveryStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-600">Entregue</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case "failed":
        return <Badge className="bg-red-600">Falhou</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integração Telegram</h1>
        <p className="text-muted-foreground mt-1">
          Conecte seu bot do Telegram para receber vendas automaticamente
        </p>
      </div>

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="connection">Conexão</TabsTrigger>
          <TabsTrigger value="sales">Vendas Automáticas</TabsTrigger>
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
      
        <TabsContent value="sales">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Vendas via Telegram</CardTitle>
                  <CardDescription>
                    Vendas recebidas automaticamente da API do Telegram
                  </CardDescription>
                </div>
                <Button onClick={simulateNewTelegramSale} disabled={!connected}>
                  Simular Nova Venda
                </Button>
              </CardHeader>
              <CardContent>
                {autoSales.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-6 text-sm font-medium text-muted-foreground">
                      <div>Data</div>
                      <div>ID do Assinante</div>
                      <div>ID do Vídeo</div>
                      <div>Valor</div>
                      <div>Status</div>
                      <div>Ações</div>
                    </div>
                    <Separator />
                    {autoSales.map(sale => (
                      <div key={sale.id} className="grid grid-cols-6 items-center text-sm">
                        <div>{new Date(sale.saleDate).toLocaleDateString()}</div>
                        <div>{sale.subscriberId}</div>
                        <div>{sale.videoId}</div>
                        <div>R$ {sale.price.toFixed(2)}</div>
                        <div className="flex flex-col gap-2">
                          <div>
                            Pagamento: {getPaymentStatusBadge(sale.paymentStatus)}
                          </div>
                          <div>
                            Entrega: {getDeliveryStatusBadge(sale.deliveryStatus)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {sale.paymentStatus === "pending" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkAsPaid(sale.id)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Marcar como Pago
                            </Button>
                          )}
                          {sale.paymentStatus === "paid" && sale.deliveryStatus === "pending" && (
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendVideo(sale.id)}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Enviar Vídeo
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : connected ? (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-muted-foreground">Nenhuma venda automática registrada</p>
                    <ArrowDown className="mx-auto h-8 w-8 text-muted-foreground animate-bounce" />
                    <p className="text-sm">Use o botão acima para simular uma venda automática</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Conecte seu bot do Telegram para começar a receber vendas automáticas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelegramPage;
