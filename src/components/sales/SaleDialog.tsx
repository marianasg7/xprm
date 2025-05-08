
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
import { DeliveryStatus, PaymentStatus, Sale, Subscriber, Video } from "@/types/types";

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSale: Sale | null;
  onSave: () => void;
  newSale: Omit<Sale, "id" | "createdAt">;
  setNewSale: React.Dispatch<React.SetStateAction<Omit<Sale, "id" | "createdAt">>>;
  setEditingSale: React.Dispatch<React.SetStateAction<Sale | null>>;
  videos: Video[];
  subscribers: Subscriber[];
}

export const SaleDialog: React.FC<SaleDialogProps> = ({
  open,
  onOpenChange,
  editingSale,
  onSave,
  newSale,
  setNewSale,
  setEditingSale,
  videos,
  subscribers
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editingSale ? "Edit Sale" : "Record New Sale"}</DialogTitle>
          <DialogDescription>
            Record a new video sale to a subscriber
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sale-video" className="col-span-1">Video</Label>
            <select
              id="sale-video"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={editingSale ? editingSale.videoId : newSale.videoId}
              onChange={(e) => {
                const selectedVideoId = e.target.value;
                const selectedVideo = videos.find(v => v.id === selectedVideoId);
                const salePrice = selectedVideo?.price || 0;
                
                editingSale
                  ? setEditingSale({...editingSale, videoId: selectedVideoId, price: salePrice})
                  : setNewSale({...newSale, videoId: selectedVideoId, price: salePrice});
              }}
            >
              {videos.map(video => (
                <option key={video.id} value={video.id}>{video.title} - ${video.price}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sale-subscriber" className="col-span-1">Subscriber</Label>
            <select
              id="sale-subscriber"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={editingSale ? editingSale.subscriberId : newSale.subscriberId}
              onChange={(e) => editingSale
                ? setEditingSale({...editingSale, subscriberId: e.target.value})
                : setNewSale({...newSale, subscriberId: e.target.value})
              }
            >
              {subscribers.map(subscriber => (
                <option key={subscriber.id} value={subscriber.id}>{subscriber.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sale-quantity" className="col-span-1">Quantity</Label>
            <Input
              id="sale-quantity"
              className="col-span-3"
              type="number"
              min="1"
              value={editingSale ? (editingSale.quantity || 1) : (newSale.quantity || 1)}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                editingSale
                  ? setEditingSale({...editingSale, quantity: value})
                  : setNewSale({...newSale, quantity: value});
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sale-date" className="col-span-1">Sale Date</Label>
            <Input
              id="sale-date"
              className="col-span-3"
              type="date"
              value={editingSale 
                ? new Date(editingSale.saleDate).toISOString().split('T')[0] 
                : new Date(newSale.saleDate).toISOString().split('T')[0]
              }
              onChange={(e) => {
                const date = new Date(e.target.value);
                editingSale
                  ? setEditingSale({...editingSale, saleDate: date})
                  : setNewSale({...newSale, saleDate: date});
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment-status" className="col-span-1">Payment</Label>
            <select
              id="payment-status"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={editingSale ? editingSale.paymentStatus : newSale.paymentStatus}
              onChange={(e) => {
                const status = e.target.value as PaymentStatus;
                editingSale
                  ? setEditingSale({...editingSale, paymentStatus: status})
                  : setNewSale({...newSale, paymentStatus: status});
              }}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="delivery-status" className="col-span-1">Delivery</Label>
            <select
              id="delivery-status"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={editingSale ? editingSale.deliveryStatus : newSale.deliveryStatus}
              onChange={(e) => {
                const status = e.target.value as DeliveryStatus;
                editingSale
                  ? setEditingSale({...editingSale, deliveryStatus: status})
                  : setNewSale({...newSale, deliveryStatus: status});
              }}
            >
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSave}>
            {editingSale ? "Update" : "Record"} Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
