
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { TelegramChatMessage } from "./TelegramChatMessage";
import { Video, Subscriber } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

interface TelegramChatSimulatorProps {
  connected: boolean;
  videos: Video[];
  subscribers: Subscriber[];
  onSale: (videoId: string, subscriberId: string) => void;
}

export const TelegramChatSimulator: React.FC<TelegramChatSimulatorProps> = ({
  connected,
  videos,
  subscribers,
  onSale,
}) => {
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: "bot" | "user"; timestamp: Date }>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedSubscriberId, setSelectedSubscriberId] = useState("");
  const { toast } = useToast();

  const addMessage = (text: string, sender: "bot" | "user") => {
    const newMsg = {
      id: crypto.randomUUID(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected) return;

    addMessage(newMessage, "user");
    setNewMessage("");

    // Simulate bot response
    setTimeout(() => {
      if (newMessage.toLowerCase().includes("buy") || newMessage.toLowerCase().includes("purchase")) {
        addMessage("Sure! Here are our available videos:", "bot");

        // List available videos
        videos.forEach((video) => {
          setTimeout(() => {
            addMessage(`${video.title} - $${video.price} - ${video.duration} min`, "bot");
          }, 500);
        });

        setTimeout(() => {
          addMessage("Please tell me which video you'd like to purchase and your subscriber ID.", "bot");
        }, 1000);
      } else if (newMessage.toLowerCase().includes("video") || videos.some((v) => newMessage.toLowerCase().includes(v.title.toLowerCase()))) {
        // Find mentioned video
        const mentionedVideo = videos.find((v) => newMessage.toLowerCase().includes(v.title.toLowerCase()));
        if (mentionedVideo) {
          setSelectedVideoId(mentionedVideo.id);
          addMessage(
            `Great choice! "${mentionedVideo.title}" costs $${mentionedVideo.price}. Please confirm your purchase by entering your subscriber ID.`,
            "bot"
          );
        } else {
          addMessage("I'm not sure which video you're interested in. Could you specify which one?", "bot");
        }
      } else if (
        subscribers.some(
          (s) => newMessage.toLowerCase().includes(s.id.toLowerCase()) || newMessage.toLowerCase().includes(s.name.toLowerCase())
        )
      ) {
        // Find mentioned subscriber
        const mentionedSub = subscribers.find(
          (s) =>
            newMessage.toLowerCase().includes(s.id.toLowerCase()) || newMessage.toLowerCase().includes(s.name.toLowerCase())
        );

        if (mentionedSub && selectedVideoId) {
          const video = videos.find((v) => v.id === selectedVideoId);
          if (video) {
            setSelectedSubscriberId(mentionedSub.id);

            // Create the sale in "pending" status
            onSale(selectedVideoId, mentionedSub.id);

            addMessage(
              `Thank you for your order! I've created a pending sale for "${video.title}" for subscriber ${mentionedSub.name}. Please make your payment and we'll process your order soon.`,
              "bot"
            );

            // Reset selection
            setSelectedVideoId("");
            setSelectedSubscriberId("");

            toast({
              title: "New Telegram Sale",
              description: `A new sale has been created from Telegram for ${video.title}`,
            });
          }
        } else if (mentionedSub && !selectedVideoId) {
          addMessage("Please select a video first before confirming with your subscriber ID.", "bot");
        }
      } else {
        addMessage("I'm here to help you purchase videos. Type 'buy' to see our available videos.", "bot");
      }
    }, 1000);
  };

  return (
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
                <TelegramChatMessage
                  key={msg.id}
                  id={msg.id}
                  text={msg.text}
                  sender={msg.sender}
                  timestamp={msg.timestamp}
                />
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
  );
};
