'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function insert(values: any) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const { data: { user } } = await supabase.auth.getUser()

    if (user == null) {
        redirect('/?auth-code-error')
        return false;
    }

    const formData = {
        user_id: user.id,
        option: values.option,
        answer: values.answer,
        is_correct: values.isCorrect,
        image_url: values.imageUrl
    }

    const { data, error } = await supabase.from('post_test').insert(formData).select()
    if (error) {
        return false;
    }

    return true;
}