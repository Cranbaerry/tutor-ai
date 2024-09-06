import { convertToCoreMessages, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
    const { messages, data } = await req.json();

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];

    console.log(messages);

    const result = await streamText({
        model: openai(process.env.OPENAI_GPT_MODEL ?? 'gpt-4o-mini'),
        system: process.env.OPENAI_GPT_PROMPT,
        messages: [
            ...convertToCoreMessages(initialMessages),
            {
                role: 'user',
                content: [
                    { type: 'text', text: currentMessage.content },
                    {
                        type: 'image', image: data.imageUrl, experimental_providerMetadata: {
                            openai: { imageDetail: 'low' },
                        },
                    },

                ],
            },
        ],
    });

    return result.toDataStreamResponse();
}