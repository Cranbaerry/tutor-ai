'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout(){
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if(error){
        redirect('/?auth-code-error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}