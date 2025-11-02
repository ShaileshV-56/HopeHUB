import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { chatApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const initialMessage: ConversationMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Hi there! I'm the HopeHUB assistant. Ask me about our mission, how to request resources, donate, or anything else about the platform.",
};

const quickPrompts = [
  "What is HopeHUB's mission?",
  "How do I request resources?",
  "What resources can I find here?",
  "How can I donate to someone?",
];

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const historyForApi = useMemo(
    () => messages.slice(-9).map((msg) => ({ role: msg.role, content: msg.content })),
    [messages]
  );

  const sendMessage = async (content?: string) => {
    const text = (content ?? input).trim();
    if (!text || loading) return;

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const payload = [...historyForApi, { role: userMessage.role, content: userMessage.content }];
      const result = await chatApi.send(payload);

      if (!result.success || !result.data?.message) {
        throw new Error(result.error || result.message || "Unable to fetch assistant response");
      }

      const assistantMessage: ConversationMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const description = error instanceof Error ? error.message : "We couldn't get a response right now. Please try again shortly.";
      toast({
        title: "Chat unavailable",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-gradient-primary text-white">
            <div>
              <h3 className="text-sm font-semibold">HopeHUB Assistant</h3>
              <p className="text-xs text-white/80">Ask about resources, donations, and more.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-white/10 transition"
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex h-96 flex-col">
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/20 px-4 py-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-white text-foreground border border-border rounded-bl-sm"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Typing?
                  </div>
                </div>
              )}
            </div>

            {!loading && messages.length <= 2 && (
              <div className="border-t border-border bg-background px-4 py-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      type="button"
                      key={prompt}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted/40 transition"
                      onClick={() => void sendMessage(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              className="border-t border-border bg-white px-4 py-3"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
            >
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about resources, donations, or support..."
                  rows={2}
                  className="resize-none"
                  disabled={loading}
                />
                <Button type="submit" size="icon" className="h-10 w-10" disabled={loading || !input.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Button
        size="lg"
        className="flex items-center gap-2 rounded-full shadow-lg"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="hopehub-chatbot"
      >
        <MessageCircle className="h-5 w-5" />
        {isOpen ? "Close Chat" : "Need Help?"}
      </Button>
    </div>
  );
};

export default Chatbot;
