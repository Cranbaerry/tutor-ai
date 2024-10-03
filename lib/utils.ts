import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "./supabase/client";
import { languages, LanguageDetails } from "./definitions";
import { File } from '@web-std/file';
import { SupabaseClient, QueryData } from "@supabase/supabase-js";
import { formSchema } from '@/components/ui/questionnaire-form'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Note: Specify client if you want to use this function in the server
// The first time you call the `createBrowserClient` from the `@supabase/ssr` package it creates a Supabase client. 
// Subsequent times you call the `createBrowserClient` function from anywhere in your app, it will return you the instance that was already created 
export async function getUserData(supabase: SupabaseClient = createClient()) {
  // const { data: { user } } = await supabase.auth.getuser();
  const { data: { session } } = await supabase.auth.getSession();

  // return user ? experimental_taintObjectReference(
  //     `Do not pass the whole user object to the client`,
  //     user
  // ) : null;
  return session?.user;
}

export function getLanguageDetailsById(id: string): LanguageDetails | undefined {
  return languages.find(lang => lang.id === id);
}

export function convertCanvasUriToFile(uri = "", fileName = "default") {
  const blob = base64ToBlob(uri, "image/png")
  const mimeType = blob.type || "application/octet-stream";
  const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`, {
    type: mimeType,
  });
  return file;
}

function base64ToBlob(base64: string, contentType = "",
  sliceSize = 512) {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length;
    offset += sliceSize) {
    const slice = byteCharacters.slice(
      offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export async function isQuestionnaireFinished() {
  const supabase = createClient()
  const user = await getUserData(supabase)

  if (user == null) return false;

  const query = supabase
    .from('profiles')
    .select(`id, whatsapp_number, questionnaires(id)`)
    .eq("user_id", user.id ?? '')
    .order('created_at', { ascending: false });

  type Query = QueryData<typeof query>;

  const { data, error } = await query;
  if (error) throw error;
  console.log(data[0]?.questionnaires[0]?.id)

  if (data == null || data.length == 0)
    return false;

  return data[0].id != null && data[0].questionnaires[0].id != null;
}

type FormData = z.infer<typeof formSchema>;
export async function insertQuestionnaireData(values: FormData) {
  const supabase = createClient()
  const user = await getUserData(supabase)
  if (user == null)
    return { error: 'User is not logged in' }

  const formData = {
    full_name: values.fullName as string,
    user_id: user.id,
    whatsapp_number: values.whatsappNumber as string,
    gender: values.gender as string,
    profession: values.profession as string,
    education_level: values.educationLevel as string,
    school: values.school as string,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase.from('profiles').insert(formData).select()
  if (error)
    return { error: error.message }

  const profileId = data[0].id
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

  if (questionError)
    return { error: questionError.message }

  return { data: { profileId } };
}