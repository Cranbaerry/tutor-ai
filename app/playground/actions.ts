'use server'

import { createClient } from "@/lib/supabase/server";

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