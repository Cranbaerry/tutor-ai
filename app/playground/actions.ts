"use server";

import { createClient } from "@/lib/supabase/server";
import { formSchema } from "@/components/ui/final-answer-dialog";
import { z } from "zod";

export async function insert(
  values: z.infer<typeof formSchema> & { imageUrl: string | null },
) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user == null) {
    return false;
  }

  const formData = {
    user_id: user.id,
    question1: values.question1,
    question2: values.question2,
    question3: values.question3,
    image_url: values.imageUrl,
  };

  const { error } = await supabase
    .from("final_answers")
    .insert(formData)
    .select();
  if (error) return false;

  return true;
}
