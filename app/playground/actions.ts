'use server'

import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation'

export async function isNewUser(){
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const dateNow = new Date()

    if(user){
        const createdDateUser = new Date(user.created_at)

        if(createdDateUser.getDate() == dateNow.getUTCDate())
            return true
        else
            return false
    }
    return false
}

export async function insert(values: any) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const { data: { user } } = await supabase.auth.getUser()

    if (user == null) {
        return false;
    }

    const formData = {
        user_id: user.id,
        question1: values.question1,
        question2: values.question2,
        question3: values.question3,
        image_url: values.imageUrl
    }

    const { data, error } = await supabase.from('final_answers').insert(formData).select()
    if (error) {
        return false;
    }

    return true;
}