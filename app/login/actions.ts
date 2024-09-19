'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
        console.log(error.message);
        return false;
    }

    revalidatePath('/', 'layout')

    return true;
}

export async function signup(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.log(error.message);
        redirect('/error')
    }

    revalidatePath('/kuisioner', 'layout')
    redirect('/kuisioner')
}

export async function OAuthLogin(){
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.BASE_URL}/auth/callback`,
        },
    })

    if (data == null) {
        return true
    } else {
        // console.log(data)
        redirect(data.url!)
    }
}

export async function handleSignInWithGoogle(code: string) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: code,
    })

    if (error) {
        console.log(error.message);
        return false;
    }

    revalidatePath('/', 'layout')

    return true;
}