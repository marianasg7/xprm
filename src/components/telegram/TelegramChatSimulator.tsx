
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip } from "lucide-react";
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
    <div className="h-[600px] flex flex-col bg-gray-100">
      <ScrollArea className="flex-grow px-4 py-3">
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
      <div className="bg-white p-3 border-t flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5 text-gray-500" />
        </Button>
        <form onSubmit={handleSendMessage} className="flex-grow flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={!connected}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!connected || !newMessage.trim()}
            className="rounded-full h-10 w-10 bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
