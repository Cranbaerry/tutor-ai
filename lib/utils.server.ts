'use server'
import { createClient } from '@/lib/supabase/server'
import {
    experimental_taintObjectReference,
    experimental_taintUniqueValue,
  } from 'react'

export async function getUserData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // return user ? experimental_taintObjectReference(
    //     `Do not pass the whole user object to the client`,
    //     user
    // ) : null;
    return user;
}