import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "./supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getUserData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // return user ? experimental_taintObjectReference(
  //     `Do not pass the whole user object to the client`,
  //     user
  // ) : null;
  return user;
}