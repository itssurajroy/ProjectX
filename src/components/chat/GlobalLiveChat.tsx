
'use client';
import { useState, useEffect, useRef } from "react";
import { Send, Smile, Users, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

export default function GlobalLiveChat() {
  const [messages, setMessages] = useState([
    { id: 1, user: "GojoFan69", text: "just finished jjk s2... im broken", time: "2min ago", rank: "S-Rank" },
    { id: 2, user: "NezukoBestGirl", text: "anyone watching demon slayer rn?", time: "1min ago", rank: "A-Rank" },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      user: "You",
      text: input,
      time: "now",
      rank: "Jounin"
    }]);
    setInput("");
  };

  const ChatContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{msg.user}</span>
                  <span className="text-xs text-gray-500">{msg.rank}</span>
                </div>
                <p className="text-gray-300 leading-snug">{msg.text}</p>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-primary/20">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Send a message..."
            className="flex-1 bg-background rounded-lg px-4 h-11 focus:ring-2 focus:ring-primary"
          />
          <Button onClick={sendMessage} size="icon" className="h-11 w-11 flex-shrink-0">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block fixed right-0 top-16 bottom-0 w-96 bg-card/50 border-l border-border/50 backdrop-blur-xl transition-transform z-30 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b border-border/50 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-green-400" />
            <span className="font-bold">Live Chat (1,247)</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4"/>
          </Button>
        </div>
        <ChatContent />
      </div>

      {/* Mobile Bottom Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <div className="lg:hidden fixed bottom-[70px] left-4 right-4 z-30">
            <Button
              className="w-full h-14 bg-gradient-to-r from-primary to-pink-600 rounded-xl font-bold shadow-2xl text-base"
            >
              💬 Live Chat • 1,247 Online
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] p-0 border-t-primary/50 flex flex-col">
            <SheetHeader className="p-4 border-b border-border/50 text-left">
                <SheetTitle className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-400" />
                    <span>Live Chat (1,247)</span>
                </SheetTitle>
            </SheetHeader>
            <ChatContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
