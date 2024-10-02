import { convertToCoreMessages, streamText, tool, generateObject, UserContent } from 'ai';
import { openai } from '@ai-sdk/openai';
import { findRelevantContent } from '@/lib/embeddings';
import { z } from 'zod';
import { getLanguageDetailsById } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server'
import { Message } from 'ai';
import { convertCanvasUriToFile, getUserData } from "@/lib/utils"
import { uploadImage } from "@/lib/supabase/storage"

async function saveChat(currentMessage: Message, responseText: string, imageUri: string) {
    const supabase = createClient();
    const user = await getUserData(supabase);

    if (!user) {
        console.error('User is not logged in');
        return;
    }

    const canvasFile = convertCanvasUriToFile(imageUri, user.id);
    const { imageUrl, error } = await uploadImage({
        storage: supabase.storage,
        file: canvasFile,
        bucket: "chat",
        folder: user.id,
    });

    if (error) {
        console.error('Error uploading image:', error);
        return;
    }

    const { error: userChatError } = await supabase
        .from('chat')
        .insert([{
            role: currentMessage.role,
            content: currentMessage.content,
            image_url: imageUrl
        }]);

    if (userChatError) {
        console.error('Error saving user message:', userChatError);
        return;
    }

    const { error: responseChatError } = await supabase
        .from('chat')
        .insert([{
            role: 'assistant',
            content: responseText,
            image_url: imageUrl
        }]);

    console.error('Error saving assistant message:', responseChatError);
}

export async function POST(req: Request) {
    const { messages, data } = await req.json();
    const initialMessages: Message[] = messages.slice(0, -1);
    const currentMessage: Message = messages[messages.length - 1];
    const langDetails = getLanguageDetailsById(data.language);
    const language = langDetails?.name ?? 'Indonesian';
    const model = process.env.OPENAI_GPT_MODEL ?? 'gpt-4o-mini';

    const result = await streamText({
        model: openai(model),
        system: `
            You are a helpful and encouraging math tutor.

            Users will interact with you by sending images of their handwritten solutions on a digital canvas so you technically see the image. Guide the user through the problem-solving process by offering helpful hints, explanations, motivation, and encouragement.

            Do NOT provide the final solution, and ensure your responses are simple, clear, and easy to understand. Keep your replies free from special formatting. Offer words of motivation such as "You are on the right track!" and "Great effort, keep going!" Encourage persistence with phrases like "Your hard work is paying off!" or "You’re almost there, keep it up!" Provide appreciation such as "Thank you for trying, your determination is impressive" or "Your solution is correct because you never gave up!"

            Use words instead of symbols. For example:

            "+" should be "plus"
            "-" should be "minus"
            "∑" should be "sum"
            "√" should be "square root"
            "α" should be "alpha"
            "β" should be "beta" For powers and exponents, use phrases like "squared" or "cubed." For example, "x²" should be "x squared."

            For fractions, use phrases like "over." For example, "1/2" should be "one over two." For integrals, use "the integral of" followed by the expression. 
            Avoid any complex formatting that cannot be spoken directly. If an equation is long, break it down into smaller parts. 
            Use commas or pauses in long expressions to make them more natural for speech.
            
            Always balance feedback with motivation and appreciation to ensure the user feels supported and encouraged.`,
        messages: [
            ...convertToCoreMessages(initialMessages),
            {
                role: 'user',
                content: [
                    { type: 'text', text: currentMessage.content },
                    { type: 'image', image: new URL(data.imageUrl) },
                ],
            },
        ],
        maxToolRoundtrips: 3,
        tools: {
            understandQuery: tool({
                description: `Understand the users query. Use this tool on every prompt.`,
                parameters: z.object({
                    query: z.string().describe("the users query"),
                    toolsToCallInOrder: z
                        .array(z.string())
                        .describe(
                            "These are the tools you need to call in the order necessary to respond to the users query",
                        ),
                }),
                execute: async ({ query }) => {
                    const { object } = await generateObject({
                        model: openai(model),
                        system:
                            "You are a query understanding assistant. Analyze the user query and generate rewritten question.",
                        schema: z.object({
                            rewrittenQuestion: z
                                .string()
                                .describe("Rewritten question to the user's query. Be concise."),
                        }),
                        prompt: `Analyze this query: "${query}". If the user's latest query references any previous part of the conversation, please rewrite the query to include the missing context. Otherwise, return the question as is.`
                    });
                    return object.rewrittenQuestion;
                },
            }),
            getInformation: tool({
                description: `Get information from your knowledge base to answer questions.`,
                parameters: z.object({
                    rewrittenQuestion: z.string().describe("Rewritten question to the user's query. Be concise."),
                }),
                execute: async ({ rewrittenQuestion }) => {
                    const results = await findRelevantContent(rewrittenQuestion);

                    const uniqueResults = Array.from(
                        new Map(results.flat().map((item) => [item?.pageContent, item])).values(),
                    );

                    return uniqueResults;
                },
            }),
            // TODO: Remove this tool (testing purpose)
            weather: tool({
                description: 'Get the weather in a location',
                parameters: z.object({
                    location: z.string().describe('The location to get the weather for'),
                }),
                execute: async ({ location }) => ({
                    location,
                    temperature: 72 + Math.floor(Math.random() * 21) - 10,
                }),
            }),
        },
        onFinish({ text }) {
            saveChat(currentMessage, text, data.imageUrl);
        },
    });

    return result.toDataStreamResponse();
}