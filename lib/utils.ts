import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "./supabase/client";
import { languages, LanguageDetails } from "./definitions";

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

export function getLanguageDetailsById(id: string): LanguageDetails | undefined {
  return languages.find(lang => lang.id === id);
}