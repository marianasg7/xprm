
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sale } from "@/types/types";
import { formatDateTime } from "@/lib/utils";

interface TelegramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sendingSale: Sale | null;
  telegramWebhookUrl: string;
  setTelegramWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  deliveryError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  getVideoTitle: (id: string) => string;
}

export const TelegramDialog: React.FC<TelegramDialogProps> = ({
  open,
  onOpenChange,
  sendingSale,
  telegramWebhookUrl,
  setTelegramWebhookUrl,
  isLoading,
  deliveryError,
  onSubmit,
  getVideoTitle
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send to Telegram</DialogTitle>
          <DialogDescription>
            Enter your Telegram webhook URL to send this sale information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telegram-webhook" className="col-span-4">Webhook URL</Label>
              <Input
                id="telegram-webhook"
                className="col-span-4"
                value={telegramWebhookUrl}
                onChange={(e) => setTelegramWebhookUrl(e.target.value)}
                placeholder="https://api.telegram.org/bot..."
                required
              />
            </div>
            <div className="col-span-4 text-sm text-muted-foreground">
              Sale information for {getVideoTitle(sendingSale?.videoId || "")} will be sent to Telegram.
            </div>
            
            {deliveryError && (
              <Alert variant="destructive" className="col-span-4">
                <AlertTitle>Delivery Failed</AlertTitle>
                <AlertDescription>{deliveryError}</AlertDescription>
              </Alert>
            )}
            
            {sendingSale?.sentDate && (
              <Alert className="col-span-4">
                <AlertTitle>Already Sent</AlertTitle>
                <AlertDescription>
                  This sale was already sent to Telegram on {formatDateTime(sendingSale.sentDate)}. 
                  Sending again will update the delivery status.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : sendingSale?.sentDate ? "Resend" : "Send"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
