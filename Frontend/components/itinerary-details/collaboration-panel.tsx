'use client';
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, X, Send, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import emailjs from "@emailjs/browser";

type Collaborator = {
  email: string;
  avatar?: string;
};

type ChatMessage = {
  id: number;
  sender: string;
  message: string;
  timestamp: Date;
};

export default function CollaborationPanel() {
  const [email, setEmail] = useState<string>("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null); // Use a ref for the form

  const handleInvite = () => {
    if (email && !collaborators.some((c) => c.email === email)) {
      setCollaborators([...collaborators, { email }]);
      setEmail("");
      if (formRef.current) {
        emailjs
          .sendForm(
            "service_2djszya",
            "template_60arnoi",
            formRef.current, // Pass the form reference
            "qFk4gQ3s89hu3nU3V"
          )
          .then(
            (result) => {
              alert("Message sent!");
              if (formRef.current) {
                formRef.current.reset(); // Reset the form
              }
            },
            (error) => {
              alert("Failed to send message. Try again.");
              console.log(error.text);
              if (formRef.current) {
                console.log(formRef.current.user_email.value);
              }
            }
          );
      }
    }
  };

  const removeCollaborator = (emailToRemove: string) => {
    setCollaborators(collaborators.filter((c) => c.email !== emailToRemove));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now(),
        sender: "You",
        message: newMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (showChat) {
    return (
      <Card className="border-blue-200 transition-opacity duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
              Trip Chat ({collaborators.length + 1} people)
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-64 border rounded-md p-2 mb-4">
            {messages.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-10">
                No messages yet. Start the conversation!
              </p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "You" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        msg.sender === "You" ? "bg-blue-100" : "bg-gray-100"
                      } p-2 rounded-lg`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-xs">{msg.sender}</span>
                        <span className="text-xs text-gray-500">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              className="flex-1 border-blue-200"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              
            />
            <Button
              className="bg-blue-600"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 transition-opacity duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Users className="h-8 w-8 mx-auto text-blue-600" />
            <h3 className="font-medium">Invite Collaborators</h3>
            <p className="text-sm text-muted-foreground">
              Share this trip with friends and family to plan together
            </p>
          </div>
          <form ref={formRef} className="flex gap-2">
            <Input
              placeholder="Enter email address"
              className="flex-1 border-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              name="user_email"
            />
            <label htmlFor="hiddenMessage"  className="hidden sr-only">Message</label>
            <textarea
              id="hiddenMessage"
              className="hidden"
              name="message"
              title="Hidden message field"
              placeholder="Hidden message"
            > Pleas Join me at my trip</textarea>
            <Button
              className="bg-blue-600"
              onClick={handleInvite}
              disabled={!email || collaborators.some((c) => c.email === email)}
            >
              Invite
            </Button>
          </form>
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Current Collaborators</h4>
            {collaborators.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No collaborators yet
              </p>
            ) : (
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.email}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-200 text-blue-700 text-xs">
                          {getInitials(collaborator.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{collaborator.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeCollaborator(collaborator.email)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {collaborators.length > 0 && (
            <div className="text-center pt-2">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 w-full"
                onClick={() => setShowChat(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Chat
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}