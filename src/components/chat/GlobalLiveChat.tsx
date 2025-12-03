
'use client';
import { useState, useEffect, useRef } from "react";
import { Send, Smile, Users } from "lucide-react";

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

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block fixed right-0 top-20 bottom-0 w-96 bg-gray-950 border-l border-purple-500/30 transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-green-400" />
            <span className="font-bold">Live Chat (1,247)</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">×</button>
        </div>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-400">{msg.user}</span>
                      <span className="text-xs text-gray-500">{msg.rank}</span>
                    </div>
                    <p className="text-gray-300">{msg.text}</p>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-purple-500/30">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Send a message..."
                className="flex-1 bg-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button onClick={sendMessage} className="p-3 bg-purple-600 rounded-lg hover:bg-purple-700">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold shadow-2xl"
        >
          💬 Live Chat • 1,247 Online
        </button>
      </div>
    </>
  );
}
