import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { env } from '../config/env';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1, 'Message content is required'),
      })
    )
    .min(1, 'At least one message is required'),
});

const defaultSystemMessage: ChatMessage = {
  role: 'system',
  content:
    "You are HopeHUB's virtual assistant. Provide concise, friendly answers about the HopeHUB platform, its mission, available resources, requesting support, donating, and contacting the team. If you're unsure, suggest reaching out through the contact page. Keep responses under 120 words and use bullet points only when they improve clarity.",
};

export const chatRouter = Router();

chatRouter.post('/', validateBody(chatSchema), async (req, res, next) => {
  try {
    if (!env.openRouterApiKey) {
      return res.status(503).json({ success: false, message: 'Chat service is currently unavailable.' });
    }

    const { messages } = (req as any).validatedBody as z.infer<typeof chatSchema>;
    const trimmedMessages: ChatMessage[] = messages
      .slice(-10)
      .map((msg) => ({ role: msg.role, content: msg.content }));

    const payloadMessages =
      trimmedMessages[0]?.role === 'system'
        ? trimmedMessages
        : [defaultSystemMessage, ...trimmedMessages];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': env.openRouterReferer,
        'X-Title': 'HopeHUB Assistant',
      },
      body: JSON.stringify({
        model: env.openRouterModel,
        messages: payloadMessages,
        max_tokens: 600,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[chat] OpenRouter API error:', response.status, errorText);
      return res.status(502).json({ success: false, message: 'Failed to retrieve chatbot response.' });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ success: false, message: 'Assistant returned an empty response.' });
    }

    return res.json({ success: true, data: { message: reply } });
  } catch (error) {
    next(error);
  }
});
