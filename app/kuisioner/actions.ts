'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import formSchema from './page'
import { QueryData } from '@supabase/supabase-js'

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
        fullname: values.fullname as string,
        user_id: user.id,
        whatsapp_number: values.whatsappNumber as string,
        gender : values.gender as string,
        profession : values.profession as string,
        education_level : values.educationLevel as string,
        school : values.school as string,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    console.log(formData)

    const { data, error } = await supabase.from('profiles').insert(formData).select()
    if (error) {
        console.log(error.message);
        return false;
        // redirect('/error')
    }

    // Could be used later
    let profileId = data[0].id

    const questionFormData = {
        profile_id: profileId as number,
        question1: values.question1 as string,
        question2: values.question2 as string,
        question3: values.question3 as string,
        question4: values.question4 as string,
        question5: JSON.stringify(values.question5) as string,
        question6: JSON.stringify(values.question6) as string,
        question7: JSON.stringify(values.question7) as string,
        question8: values.question8 as string,
        question9: JSON.stringify(values.question9) as string,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    const { error: questionError } = await supabase.from('questionnaires').insert(questionFormData)

    if (questionError) {
        console.log(questionError.message);
        return false;
    }

    return true;

}

// Kalau sudah ngisi form questionare awal gk perlu isi lagi
// TODO NEXT: Skip berdasarkan progress penggunaan aplikasi
export async function isQuestionareFinished(){
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user == null) {
        return false;
    }

    const query = supabase
        .from('profiles')
        .select(`id, whatsapp_number, questionnaires(id)`)
        .eq("user_id", user.id ?? '')
        .order('created_at', { ascending: false });

    type Query = QueryData<typeof query>;

    const { data, error } = await query;
    if (error) throw error;
    console.log(data[0]?.questionnaires[0]?.id)

    if (data == null || data.length == 0){
        return false;
    } else {
        if (data[0].id == null || data[0].questionnaires[0].id == null){
            return false;
        } else {
            return true;
        }
    }
}