"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/contexts/auth.context";
import type { Message } from "@/lib/types";

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
}

export function ChatBox({ messages, onSendMessage }: ChatBoxProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-black/5 bg-white/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">チャット</h2>
      </div>

      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            まだメッセージがありません
          </p>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? "bg-blue-600 text-white"
                      : "border border-black/5 bg-white/70 text-gray-900"
                  }`}
                >
                  <p className="text-sm font-medium mb-1">
                    {message.sender?.pokePokeId || "不明"}
                  </p>
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleString("ja-JP")}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-black/5 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input flex-1"
            placeholder="メッセージを入力..."
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="btn btn-primary"
          >
            {isSending ? "送信中..." : "送信"}
          </button>
        </div>
      </form>
    </div>
  );
}
