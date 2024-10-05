"use server";

import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { LoginData } from "@/lib/definitions";

export async function signUp({ email, password }: LoginData) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  return { data, error: error ? error.message : null };
}

export async function signInWithPassword({ email, password }: LoginData) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error: error ? error.message : null };
}

export async function signInWithOAuth(provider: Provider = "google") {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: process.env.OAUTH_CALLBACK_URL ?? "",
    },
  });

  return { data, error: error ? error.message : null };
}
