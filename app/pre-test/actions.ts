'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function insert(values: any) {
    const supabase = createClient()

    console.log('insert')

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const { data: { user } } = await supabase.auth.getUser()

    if (user == null) {
        console.log("User is not logged in")
        redirect('/error')
        return false;
    } else {
        console.log(user.id)
    }

    const formData = {
        user_id: user.id,
        option: values.option,
        answer: values.answer,
        is_correct: values.isCorrect,
        image_url: values.imageUrl
    }

    const { data, error } = await supabase.from('pre_test').insert(formData).select()
    if (error) {
        console.log(error.message);
        return false;
        // redirect('/error')
    }

    return true;
}