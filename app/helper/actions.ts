'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

// TODO cari cara buat helper lebih mudah
export async function fetchUserEmail() {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    // const userId = user.id
    if (user == null) {
        console.log("User is not logged in")
        return "";
    } else {
        console.log(user.id)
    }

    return user?.email;
}

export async function fetchUserFullname(){
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    // const userId = user.id
    if (user == null) {
        console.log("User is not logged in")
        return undefined;
    }

    let userData = user.user_metadata

    // console.log(userData?.full_name)

    return userData?.full_name;
}