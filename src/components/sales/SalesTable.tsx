
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Edit, Send, Trash2, X } from "lucide-react";
import { Sale, Subscriber, DeliveryStatus, PaymentStatus } from "@/types/types";
import { formatDate } from "@/lib/utils";
import { getPaymentStatusBadge, getDeliveryStatusBadge } from "@/utils/projectUtils";

interface SalesTableProps {
  sales: Sale[];
  subscribers: Subscriber[];
  getVideoTitle: (id: string) => string;
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
  onSend: (sale: Sale) => void;
  onUpdatePaymentStatus: (sale: Sale, status: PaymentStatus) => void;
  onUpdateDeliveryStatus: (sale: Sale, status: DeliveryStatus) => void;
  canBeDelivered: (sale: Sale) => boolean;
  activeTab: string;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  subscribers,
  getVideoTitle,
  onEdit,
  onDelete,
  onSend,
  onUpdatePaymentStatus,
  onUpdateDeliveryStatus,
  canBeDelivered,
  activeTab
}) => {
  // Helper function to get subscriber name with status indicator
  const getSubscriberName = (id: string) => {
    const subscriber = subscribers.find(s => s.id === id);
    if (!subscriber) return "Unknown Subscriber";
    
    // If the subscriber is inactive, we'll render their name with a red X
    if (subscriber.status !== 'active') {
      return (
        <div className="flex items-center">
          <span>{subscriber.name}</span>
          <X className="ml-1 h-4 w-4 text-red-500" />
        </div>
      );
    }
    
    return subscriber.name;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Video</TableHead>
          <TableHead>Subscriber</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Delivery</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{getVideoTitle(sale.videoId)}</TableCell>
            <TableCell>{getSubscriberName(sale.subscriberId)}</TableCell>
            <TableCell>{formatDate(sale.saleDate)}</TableCell>
            <TableCell>{sale.quantity || 1}</TableCell>
            <TableCell>${(sale.price * (sale.quantity || 1)).toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Badge variant={getPaymentStatusBadge(sale.paymentStatus)}>
                  {sale.paymentStatus}
                </Badge>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  disabled={sale.paymentStatus === "paid"}
                  onClick={() => onUpdatePaymentStatus(sale, "paid")}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Badge variant={getDeliveryStatusBadge(sale.deliveryStatus)}>
                  {sale.deliveryStatus}
                </Badge>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  disabled={!canBeDelivered(sale)}
                  onClick={() => onUpdateDeliveryStatus(sale, "delivered")}
                  title={!canBeDelivered(sale) ? "Must send to Telegram before marking as delivered" : "Mark as delivered"}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button 
                  size="sm" 
                  variant={sale.sentDate ? "outline" : "ghost"}
                  className={sale.sentDate ? "border-green-500 text-green-500" : ""}
                  onClick={() => onSend(sale)}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onEdit(sale)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(sale.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        
        {sales.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-6">
              No sales recorded yet. {activeTab === 'telegram' ? 'Telegram sales will appear here.' : 'Record a sale to get started.'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
