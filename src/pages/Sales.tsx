
import React, { useState, useRef, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSales } from "@/context/SalesContext";
import { Video, Sale, PaymentStatus, DeliveryStatus } from "@/types/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useSubscribers } from "@/context/SubscriberContext";
import { PlusCircle, Edit, Trash2, Check, Video as VideoIcon, Tags, Send, X, Upload, Eye, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Sales: React.FC = () => {
  const { toast } = useToast();
  const { videos, sales, addVideo, updateVideo, deleteVideo, addSale, updateSale, deleteSale } = useSales();
  const { subscribers } = useSubscribers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [telegramWebhookUrl, setTelegramWebhookUrl] = useState<string>("");
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);
  const [sendingSale, setSendingSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [telegramSales, setTelegramSales] = useState<Sale[]>([]);
  const [manualSales, setManualSales] = useState<Sale[]>([]);

  // Calculate some statistics
  const totalSales = sales.reduce((sum, sale) => sum + (sale.price * (sale.quantity || 1)), 0);
  const paidSales = sales.filter(s => s.paymentStatus === "paid").reduce((sum, sale) => sum + (sale.price * (sale.quantity || 1)), 0);
  const pendingSales = sales.filter(s => s.paymentStatus === "pending").reduce((sum, sale) => sum + (sale.price * (sale.quantity || 1)), 0);
  const totalQuantity = sales.reduce((sum, sale) => sum + (sale.quantity || 1), 0);
  
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
    setVideoPreview(null);
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

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setVideoPreview(null);
    setVideoDialogOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setSaleDialogOpen(true);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a URL for the video preview
    const objectUrl = URL.createObjectURL(file);
    setVideoPreview(objectUrl);
    
    // Update video details based on file
    const videoData = editingVideo ? {...editingVideo} : {...newVideo};
    videoData.title = videoData.title || file.name.split('.')[0];
    videoData.url = objectUrl;
    
    if (editingVideo) {
      setEditingVideo(videoData as Video);
    } else {
      setNewVideo(videoData);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

  // Helper function to get video title
  const getVideoTitle = (id: string) => {
    const video = videos.find(v => v.id === id);
    return video ? video.title : "Unknown Video";
  };

  // Helper to check if a sale can be delivered
  const canBeDelivered = (sale: Sale) => {
    return sale.paymentStatus === "paid" && sale.sentDate && sale.deliveryStatus !== "delivered";
  };

  // Render sales table based on filtered data
  const renderSalesTable = (salesToShow: Sale[]) => (
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
        {salesToShow.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{getVideoTitle(sale.videoId)}</TableCell>
            <TableCell>{getSubscriberName(sale.subscriberId)}</TableCell>
            <TableCell>{formatDate(sale.saleDate)}</TableCell>
            <TableCell>{sale.quantity || 1}</TableCell>
            <TableCell>${(sale.price * (sale.quantity || 1)).toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Badge 
                  className={
                    sale.paymentStatus === "paid" ? "bg-green-500 hover:bg-green-600" :
                    sale.paymentStatus === "pending" ? "bg-yellow-500 hover:bg-yellow-600" :
                    "bg-red-500 hover:bg-red-600"
                  }
                >
                  {sale.paymentStatus}
                </Badge>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  disabled={sale.paymentStatus === "paid"}
                  onClick={() => handleUpdatePaymentStatus(sale, "paid")}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Badge 
                  className={
                    sale.deliveryStatus === "delivered" ? "bg-green-500 hover:bg-green-600" :
                    sale.deliveryStatus === "pending" ? "bg-yellow-500 hover:bg-yellow-600" :
                    "bg-red-500 hover:bg-red-600"
                  }
                >
                  {sale.deliveryStatus}
                </Badge>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  disabled={!canBeDelivered(sale)}
                  onClick={() => handleUpdateDeliveryStatus(sale, "delivered")}
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
                  onClick={() => openTelegramDialog(sale)}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleEditSale(sale)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteSale(sale.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        
        {salesToShow.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-6">
              No sales recorded yet. {activeTab === 'telegram' ? 'Telegram sales will appear here.' : 'Record a sale to get started.'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage video content and track sales
        </p>
      </div>

      {/* Sales Statistics */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paidSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Videos Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Videos</h2>
        <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingVideo(null);
              setVideoPreview(null);
              setNewVideo({
                title: "",
                description: "",
                price: 0,
                duration: 0,
                url: "",
                participants: []
              });
            }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
              <DialogDescription>
                Create a new video product for sale
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="video-title" className="col-span-1">Title</Label>
                <Input
                  id="video-title"
                  className="col-span-3"
                  value={editingVideo ? editingVideo.title : newVideo.title}
                  onChange={(e) => editingVideo 
                    ? setEditingVideo({...editingVideo, title: e.target.value})
                    : setNewVideo({...newVideo, title: e.target.value})
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="video-description" className="col-span-1">Description</Label>
                <Textarea
                  id="video-description"
                  className="col-span-3"
                  value={editingVideo ? editingVideo.description : newVideo.description}
                  onChange={(e) => editingVideo
                    ? setEditingVideo({...editingVideo, description: e.target.value})
                    : setNewVideo({...newVideo, description: e.target.value})
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="video-price" className="col-span-1">Price ($)</Label>
                <Input
                  id="video-price"
                  className="col-span-3"
                  type="number"
                  value={editingVideo ? editingVideo.price : newVideo.price}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    editingVideo
                      ? setEditingVideo({...editingVideo, price: value})
                      : setNewVideo({...newVideo, price: value});
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="video-duration" className="col-span-1">Duration (min)</Label>
                <Input
                  id="video-duration"
                  className="col-span-3"
                  type="number"
                  value={editingVideo ? editingVideo.duration : newVideo.duration}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    editingVideo
                      ? setEditingVideo({...editingVideo, duration: value})
                      : setNewVideo({...newVideo, duration: value});
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="col-span-1">Video File</Label>
                <div className="col-span-3">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="video/*"
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col gap-3">
                    <Button type="button" onClick={triggerFileInput} variant="outline">
                      <Upload className="mr-2 h-4 w-4" /> Upload Video
                    </Button>
                    {videoPreview && (
                      <div className="mt-2">
                        <Label htmlFor="video-preview" className="mb-1">Preview</Label>
                        <div className="relative aspect-video w-full bg-slate-100 rounded-md overflow-hidden">
                          <video 
                            src={videoPreview} 
                            controls 
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                    {!videoPreview && (editingVideo?.url || newVideo.url) && (
                      <div className="flex items-center">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex items-center"
                          onClick={() => window.open(editingVideo?.url || newVideo.url, '_blank')}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Current Video
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddVideo}>
                {editingVideo ? "Update" : "Create"} Video
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="flex items-center gap-2">
                  <VideoIcon className="h-4 w-4" /> {video.title}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditVideo(video)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteVideo(video.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>${video.price} • {video.duration} min</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{video.description}</p>
              
              {video.url && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="mt-2 flex items-center"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  <Eye className="mr-2 h-4 w-4" /> Preview Video
                </Button>
              )}
            </CardContent>
          </Card>
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
        <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
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
              <PlusCircle className="mr-2 h-4 w-4" /> Record Sale
            </Button>
          </DialogTrigger>
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
              <Button type="submit" onClick={handleAddSale}>
                {editingSale ? "Update" : "Record"} Sale
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              {renderSalesTable(sales)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="telegram">
          <Card>
            <CardContent className="p-0 overflow-auto">
              {renderSalesTable(telegramSales)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manual">
          <Card>
            <CardContent className="p-0 overflow-auto">
              {renderSalesTable(manualSales)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={telegramDialogOpen} onOpenChange={setTelegramDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send to Telegram</DialogTitle>
            <DialogDescription>
              Enter your Telegram webhook URL to send this sale information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={sendToTelegram}>
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
    </div>
  );
};

export default Sales;
