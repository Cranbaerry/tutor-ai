import { NextRequest } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';
import { BytesOutputParser } from "@langchain/core/output_parsers";

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { vectorStore } from '@/lib/embeddings';

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.

Relevant context:
{context}

Current conversation:
{chat_history}

User: {input}
AI:`;

/**
 * Sub-template for reformulating the question based on history.
 */
const QUESTION_REFORMULATION_TEMPLATE = `Here is the conversation so far:
{chat_history}

User's latest question: "{input}"

If the user's latest question references any previous part of the conversation, please rewrite the question to include the missing context. Otherwise, return the question as is.`;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const chatHistory = formattedPreviousMessages.join('\n');

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
        temperature: 0.8,
    });

    const questionReformulationPrompt = PromptTemplate.fromTemplate(QUESTION_REFORMULATION_TEMPLATE);

    const reformulatedQuestionChain = questionReformulationPrompt.pipe(model);

    // Step 1: Reformulate the question based on chat history
    const reformulatedQuestion = await reformulatedQuestionChain.invoke({
        chat_history: chatHistory,
        input: currentMessageContent,
    });

    /**
     * Step 2: Retrieve relevant documents from the vector store based on the reformulated question.
     */
    const retriever = vectorStore.asRetriever();
    const relevantDocuments = await retriever.getRelevantDocuments(reformulatedQuestion.content as string);
    console.log(reformulatedQuestion)

    // Combine the relevant documents into a string to be passed as context.
    const context = relevantDocuments.map(doc => doc.pageContent).join('\n\n');

    // Step 3: Use the reformulated question and relevant context in the main template
    const outputParser = new BytesOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
        chat_history: chatHistory,
        input: reformulatedQuestion.content as string,  // Always use the reformulated question
        context: context,  // Adding relevant document context
    });

    return new StreamingTextResponse(stream);
    // High latency,try barebone response tmr
}
