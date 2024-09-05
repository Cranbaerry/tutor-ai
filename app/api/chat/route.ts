import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const result = await streamText({
        model: openai(process.env.OPENAI_GPT_MODEL ?? 'gpt-4o-mini'),
        system: process.env.OPENAI_GPT_PROMPT,
        messages,
    });

    return result.toDataStreamResponse();
}