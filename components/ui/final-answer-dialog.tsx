"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { insert } from "@/app/playground/actions";
import { useState } from "react";
import { convertCanvasUriToFile, getUserData } from "@/lib/utils";
import { uploadImage } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/client";
import { CanvasRef } from "@/lib/definitions";

export const formSchema = z.object({
  question1: z.string({
    required_error: "Kolom jawaban nomor 1 wajib diisi.",
  }),
  question2: z.string({
    required_error: "Kolom jawaban nomor 2 wajib diisi.",
  }),
  question3: z.string({
    required_error: "Kolom jawaban nomor 3 wajib diisi.",
  }),
});

interface IDialogFinalAnswerProps {
  canvasRef: CanvasRef | null;
}

function DialogFinalAnswer({ canvasRef }: IDialogFinalAnswerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question1: "",
      question2: "",
      question3: "",
    },
  });

  const onError = () => {
    toast.error("Error", {
      description: "Silahkan mengisi semua kolom yang diberikan.",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const user = await getUserData();
    const canvasDataUrl = canvasRef?.handleExport();

    const canvasFile = convertCanvasUriToFile(canvasDataUrl, user?.id);
    const { storage } = createClient();
    const { imageUrl, error } = await uploadImage({
      storage: storage,
      file: canvasFile,
      bucket: "final-answer",
    });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    insert({ ...values, imageUrl: imageUrl });
    toast.success("Success", { description: "Data has been saved successfully." });
    router.push("/evaluation");
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Selesai</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <DialogHeader>
              <DialogTitle>Kumpul Jawaban Akhir</DialogTitle>
              <DialogDescription>
                Masukkan jawaban akhir yang kamu dapatkan setelah mengerjakan
                soal-soal bersama BEEXPERT.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="question1"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Soal 1</FormLabel>
                    <FormControl className="col-span-3">
                      <Input placeholder="Jawaban 1" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question2"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Soal 2</FormLabel>
                    <FormControl className="col-span-3">
                      <Input placeholder="Jawaban 2" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question3"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Soal 3</FormLabel>
                    <FormControl className="col-span-3">
                      <Input placeholder="Jawaban 3" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

DialogFinalAnswer.displayName = "DialogFinalAnswer";
export { DialogFinalAnswer };
