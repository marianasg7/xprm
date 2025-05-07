
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
import { ArrowDown, Save, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSales } from "@/context/SalesContext";

const telegramFormSchema = z.object({
  telegramToken: z.string().min(1, "Telegram bot token is required"),
  chatId: z.string().min(1, "Chat ID is required"),
  notificationEnabled: z.boolean().default(true),
});

const saleFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  productId: z.string().min(1, "Product is required"),
  amount: z.string().min(1, "Amount is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

const TelegramPage: React.FC = () => {
  const { toast } = useToast();
  const { plans } = useSales();
  const [connected, setConnected] = useState(false);
  const [sales, setSales] = useState<any[]>([]);

  const telegramForm = useForm<z.infer<typeof telegramFormSchema>>({
    resolver: zodResolver(telegramFormSchema),
    defaultValues: {
      telegramToken: "",
      chatId: "",
      notificationEnabled: true,
    },
  });

  const saleForm = useForm<z.infer<typeof saleFormSchema>>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      productId: "",
      amount: "",
      paymentMethod: "telegram",
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

  const handleSale = (data: z.infer<typeof saleFormSchema>) => {
    // Create a new sale record
    const newSale = {
      id: `sale-${Date.now()}`,
      customer: data.customerName,
      email: data.customerEmail,
      product: plans.find(p => p.id === data.productId)?.name || data.productId,
      amount: parseFloat(data.amount),
      paymentMethod: data.paymentMethod,
      date: new Date(),
    };

    // Add to sales list
    setSales([newSale, ...sales]);

    // Simulate sending notification
    toast({
      title: "Sale recorded",
      description: `Sale of ${newSale.product} to ${newSale.customer} has been recorded.`,
    });

    // Reset form
    saleForm.reset({
      customerName: "",
      customerEmail: "",
      productId: "",
      amount: "",
      paymentMethod: "telegram",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Telegram Integration</h1>
        <p className="text-muted-foreground mt-1">
          Connect your Telegram bot to record sales and receive notifications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connect Telegram Bot</CardTitle>
            <CardDescription>
              Link your Telegram bot to enable sales recording through Telegram
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
                      <FormLabel>Telegram Bot Token</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your telegram bot token" {...field} />
                      </FormControl>
                      <FormDescription>
                        Create a bot via @BotFather on Telegram to get a token
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
                      <FormLabel>Chat ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your chat ID" {...field} />
                      </FormControl>
                      <FormDescription>
                        The chat where notifications will be sent
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
                        <FormLabel>Enable Notifications</FormLabel>
                        <FormDescription>
                          Receive notifications when sales are recorded
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
                  {connected ? "Connected" : "Connect Telegram"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Record Sale from Telegram</CardTitle>
            <CardDescription>
              Record a new sale that occurred on Telegram
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...saleForm}>
              <form onSubmit={saleForm.handleSubmit(handleSale)} className="space-y-6">
                <FormField
                  control={saleForm.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saleForm.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Email</FormLabel>
                      <FormControl>
                        <Input placeholder="customer@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saleForm.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {plans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - ${plan.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saleForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-7"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saleForm.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="telegram">Telegram Payment</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={!connected}>
                  <Save className="h-4 w-4 mr-2" />
                  Record Sale
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent Telegram Sales</CardTitle>
          <CardDescription>
            Sales recorded through your Telegram integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length > 0 ? (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-5 font-medium text-sm">
                <div>Customer</div>
                <div>Email</div>
                <div>Product</div>
                <div>Amount</div>
                <div>Date</div>
              </div>
              <Separator />
              {sales.map(sale => (
                <div key={sale.id} className="grid grid-cols-5 text-sm">
                  <div>{sale.customer}</div>
                  <div>{sale.email}</div>
                  <div>{sale.product}</div>
                  <div>${sale.amount.toFixed(2)}</div>
                  <div>{new Date(sale.date).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : connected ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground">No sales recorded yet</p>
              <ArrowDown className="mx-auto h-8 w-8 text-muted-foreground animate-bounce" />
              <p className="text-sm">Record your first sale using the form above</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Connect your Telegram bot to start recording sales
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramPage;
