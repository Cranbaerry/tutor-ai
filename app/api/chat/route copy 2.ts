import { convertToCoreMessages, streamText, tool, generateObject, UserContent } from 'ai';
import { openai } from '@ai-sdk/openai';
import { findRelevantContent } from '@/lib/embeddings';
import { z } from 'zod';

export async function POST(req: Request) {
    const { messages, data } = await req.json();

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];

    var content: UserContent = [{ type: 'text', text: currentMessage.content }];
    if (data?.imageUrl) {
        content.push({
            type: 'image', image: data.imageUrl, experimental_providerMetadata: {
                openai: { imageDetail: 'low' },
            },
        });
    }

    const result = await streamText({
        model: openai(process.env.OPENAI_GPT_MODEL ?? 'gpt-4o-mini'),
        system: `You are a helpful math tutor.
        
        Users will interact with you by sending images of their handwritten solutions on a digital canvas so you technically see the image. 
        Guide the user through the problem-solving process by offering helpful hints, explanations, and encouragement.
        
        Do NOT provide the final solution, and ensure your responses are simple, clear, and easy to understand. Keep your replies free from special formatting.
        Do not use LaTeX formatting.
        Do not use list format.
        Do not hallucinate.
        
        If a response requires information from an additional tool to generate a response, call the appropriate tools in order before responding to the user.
        ONLY respond to questions using information from tool calls.
        Be sure to adhere to any instructions in tool calls ie. if they say to responsd like "...", do exactly that.
        If the relevant information is not a direct match to the users prompt, you can be creative in deducing the answer.
        Keep responses short and concise. Answer in a single sentence where possible.
        If you are unsure, use the getInformation tool and you can use common sense to reason based on the information you do have.
        Use your abilities as a reasoning machine to answer questions based on the information you do have.`,
        messages: [
            ...convertToCoreMessages(initialMessages),
            {
                role: 'user',
                content: content
            },
        ],
        tools: {
            understandQuery: tool({
                description: `understand the users query. use this tool on every prompt.`,
                parameters: z.object({
                    query: z.string().describe("the users query"),
                    toolsToCallInOrder: z
                        .array(z.string())
                        .describe(
                            "these are the tools you need to call in the order necessary to respond to the users query",
                        ),
                }),
                execute: async ({ query }) => {
                    const { object } = await generateObject({
                        model: openai("gpt-4o"),
                        system:
                            "You are a query understanding assistant. Analyze the user query and generate similar questions.",
                        schema: z.object({
                            questions: z
                                .array(z.string())
                                .max(2)
                                .describe("similar questions to the user's query. be concise."),
                        }),
                        prompt: `Analyze this query: "${query}". Provide the following:
                            2 similar questions that could help answer the user's query`,
                    });
                    return object.questions;
                },
            }),
            getInformation: tool({
                description: `get information from your knowledge base to answer questions.`,
                parameters: z.object({
                    question: z.string().describe("the users question"),
                    similarQuestions: z.array(z.string()).describe("keywords to search"),
                }),
                execute: async ({ similarQuestions }) => {
                    const results = await Promise.all(
                        similarQuestions.map(
                            async (question) => await findRelevantContent(question),
                        ),
                    );
                    // Flatten the array of arrays and remove duplicates based on 'name'
                    const uniqueResults = Array.from(
                        new Map(results.flat().map((item) => [item?.pageContent, item])).values(),
                    );

                    return uniqueResults;
                },
                // execute: async ({ query }) => findRelevantContent(query),
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
        // toolChoice: 'required',
        // maxSteps: 2,
    });

    return result.toDataStreamResponse();
}