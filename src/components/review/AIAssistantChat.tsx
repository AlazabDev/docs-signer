import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantChatProps {
  documentId: string;
  documentContext: string;
  onClose: () => void;
}

export function AIAssistantChat({ documentId, documentContext, onClose }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'مرحباً! كيف يمكنني مساعدتك في مراجعة هذا المستند؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('deepseek-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          documentContext,
          action: 'chat'
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'عذراً، حدث خطأ.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، لم أتمكن من الرد. حاول مرة أخرى.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="w-5 h-5" />
          مساعد المراجعة
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80 px-4">
          <div className="space-y-4 py-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="اكتب سؤالك..."
            disabled={loading}
          />
          <Button size="icon" onClick={sendMessage} disabled={loading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
