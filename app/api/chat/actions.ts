'use server'

import { createClient } from '@/lib/supabase/server'

export async function insertChatLog(
    messages: any,
    imageUrl: String,
    responseText: String,
    finishReason: String,
    usage: any
){
    const supabase = createClient()

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];

    const { data: { user } } = await supabase.auth.getUser()

    const formData = {
        user_id: user?.id as string,
        current_message: currentMessage.content as string,
        initial_message : JSON.stringify(initialMessages) as string,
        request_message : JSON.stringify(messages) as string,
        image_url : imageUrl as string,
        response_text : responseText as string,
        finish_reason : finishReason as string,
        prompt_tokens : usage.promptTokens as BigInteger,
        completion_tokens : usage.completionTokens as BigInteger,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase.from('chat_logs').insert(formData).select()
    if (error) {
        console.log(error.message);
        return false;
    }

    // console.log(data)

    return true;
}