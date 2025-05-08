
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const telegramFormSchema = z.object({
  telegramToken: z.string().min(1, "Telegram bot token is required"),
  chatId: z.string().min(1, "Chat ID is required"),
  notificationEnabled: z.boolean().default(true),
});

export type TelegramFormData = z.infer<typeof telegramFormSchema>;

interface TelegramConnectionFormProps {
  onConnect: (data: TelegramFormData) => void;
  connected: boolean;
}

export const TelegramConnectionForm: React.FC<TelegramConnectionFormProps> = ({
  onConnect,
  connected,
}) => {
  const telegramForm = useForm<TelegramFormData>({
    resolver: zodResolver(telegramFormSchema),
    defaultValues: {
      telegramToken: "",
      chatId: "",
      notificationEnabled: true,
    },
  });

  return (
    <Form {...telegramForm}>
      <form onSubmit={telegramForm.handleSubmit(onConnect)} className="space-y-6">
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
  );
};
