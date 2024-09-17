'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function insert(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        name: formData.get('name') as string,
    }


    const { error } = await supabase.from('test').insert(data)
    if (error) {
        console.log(error.message);
        redirect('/error')
    }

    revalidatePath('/test', 'layout')
    redirect('/test')
}

export async function fetch() {
    const supabase = createClient()

    const data = supabase
        .from('test')
        .select();

    return data;
}