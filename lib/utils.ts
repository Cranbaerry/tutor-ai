import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "./supabase/client";
import { languages, LanguageDetails } from "./definitions";
import { File } from '@web-std/file';
import { SupabaseClient } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Note: Specify client if you want to use this function in the server
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

export function convertCanvasUriToFile(uri = "", fileName = "default"){
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