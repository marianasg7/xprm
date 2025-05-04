
import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useSales } from "@/context/SalesContext";
import { Video, Sale, PaymentStatus, DeliveryStatus } from "@/types/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useSubscribers } from "@/context/SubscriberContext";
import { PlusCircle, Edit, Trash2, DollarSign, Check, Video as VideoIcon, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Sales: React.FC = () => {
  const { videos, sales, addVideo, updateVideo, deleteVideo, addSale, updateSale, deleteSale } = useSales();
  const { subscribers } = useSubscribers();
  
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
    paymentStatus: "pending" as PaymentStatus,
    deliveryStatus: "pending" as DeliveryStatus
  });

  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  // Calculate some statistics
  const totalSales = sales.reduce((sum, sale) => sum + sale.price, 0);
  const paidSales = sales.filter(s => s.paymentStatus === "paid").reduce((sum, sale) => sum + sale.price, 0);
  const pendingSales = sales.filter(s => s.paymentStatus === "pending").reduce((sum, sale) => sum + sale.price, 0);
  
  const handleAddVideo = () => {
    if (editingVideo) {
      updateVideo({
        ...editingVideo,
        participants: selectedParticipants
      });
      setEditingVideo(null);
    } else {
      addVideo({
        ...newVideo,
        participants: selectedParticipants
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
    setSelectedParticipants([]);
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
        paymentStatus: "pending",
        deliveryStatus: "pending"
      });
    }
    setSaleDialogOpen(false);
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setSelectedParticipants(video.participants);
    setVideoDialogOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setSaleDialogOpen(true);
  };

  const handleToggleParticipant = (subscriberId: string) => {
    setSelectedParticipants(prev => {
      if (prev.includes(subscriberId)) {
        return prev.filter(id => id !== subscriberId);
      } else {
        return [...prev, subscriberId];
      }
    });
  };

  const handleUpdatePaymentStatus = (sale: Sale, status: PaymentStatus) => {
    updateSale({
      ...sale,
      paymentStatus: status,
      // If payment is marked as paid, set sent date to now
      ...(status === "paid" && sale.deliveryStatus !== "delivered" 
          ? { deliveryStatus: "delivered", sentDate: new Date() } 
          : {})
    });
  };

  const handleUpdateDeliveryStatus = (sale: Sale, status: DeliveryStatus) => {
    updateSale({
      ...sale,
      deliveryStatus: status,
      ...(status === "delivered" ? { sentDate: new Date() } : {})
    });
  };

  // Helper function to get subscriber name
  const getSubscriberName = (id: string) => {
    const subscriber = subscribers.find(s => s.id === id);
    return subscriber ? subscriber.name : "Unknown Subscriber";
  };

  // Helper function to get video title
  const getVideoTitle = (id: string) => {
    const video = videos.find(v => v.id === id);
    return video ? video.title : "Unknown Video";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage video content and track sales
        </p>
      </div>

      {/* Sales Statistics */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
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
      </div>

      {/* Videos Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Videos</h2>
        <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingVideo(null);
              setSelectedParticipants([]);
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="video-url" className="col-span-1">Video URL</Label>
                <Input
                  id="video-url"
                  className="col-span-3"
                  type="url"
                  value={editingVideo ? editingVideo.url : newVideo.url}
                  onChange={(e) => editingVideo
                    ? setEditingVideo({...editingVideo, url: e.target.value})
                    : setNewVideo({...newVideo, url: e.target.value})
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="col-span-1 pt-2">Participants</Label>
                <div className="col-span-3 border rounded-md p-2 max-h-40 overflow-y-auto">
                  {subscribers.filter(s => s.status === 'active').map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`participant-${subscriber.id}`}
                        checked={selectedParticipants.includes(subscriber.id)}
                        onCheckedChange={() => handleToggleParticipant(subscriber.id)}
                      />
                      <Label htmlFor={`participant-${subscriber.id}`}>
                        {subscriber.name} {subscriber.nickname ? `(${subscriber.nickname})` : ''}
                      </Label>
                    </div>
                  ))}
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
              
              {video.participants.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Participants:</p>
                  <div className="flex flex-wrap gap-1">
                    {video.participants.map(participantId => (
                      <Badge key={participantId} variant="outline">
                        {getSubscriberName(participantId)}
                      </Badge>
                    ))}
                  </div>
                </div>
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

      <Card>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Subscriber</TableHead>
                <TableHead>Date</TableHead>
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
                  <TableCell>${sale.price}</TableCell>
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
                        disabled={sale.deliveryStatus === "delivered" || sale.paymentStatus !== "paid"}
                        onClick={() => handleUpdateDeliveryStatus(sale, "delivered")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => handleEditSale(sale)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteSale(sale.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No sales recorded yet. Record a sale to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
