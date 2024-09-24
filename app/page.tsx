'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/ui/use-auth-form";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserData } from "@/lib/utils.server";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthenticationPage() {
  const router = useRouter();
  const [formMode, setFormMode] = useState<'SignUp' | 'SignIn'>('SignUp');
  const toggleFormMode = () => {
    setFormMode((prevMode) => (prevMode === 'SignUp' ? 'SignIn' : 'SignUp'));
  };

  useEffect(() => {
    async function checkUser() {
      const data = await getUserData();
      if (data) {
        console.log(data);
        toast.success("Successfully logged in", { description: `Welcome back, ${data?.email ?? "Guest"}` });
        router.push("/kuisioner");
      }
    }

    checkUser();
  }, []);

  return (
    <>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 h-screen">
        <Link
          href="#"
          onClick={toggleFormMode}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          {formMode === 'SignUp' ? 'Masuk' : 'Daftar'}
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">  
          <div className="absolute inset-0">
              <Image
                src="/students.jpg"
                alt="Picture of students"
                objectFit="cover"
                layout="fill"
              />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
          </div>
          <div className="relative z-20 mt-auto">

            <blockquote className="space-y-2">
              <p className="text-base">
                Platform bimbingan belajar berbasis AI yang dirancang untuk siswa SMA yang memungkinkan siswa untuk memasukkan pertanyaan melalui suara dan gambar secara langsung.
              </p>
              <footer className="text-xs italic">
                Bagian dari penelitian &ldquo;Chatbot System with Retrieval Augmented Generation for Enhanced Self-learning Experience&rdquo; oleh{" "}
                <a href="https://www.linkedin.com/in/angeline-mary-marchella/" target="_blank">
                  Angeline Mary Marchella
                </a>
                ,{" "}
                <a href="https://www.linkedin.com/in/naufal-h/" target="_blank">
                  Naufal Hardiansyah
                </a>
                , dan{" "}
                <a href="https://www.linkedin.com/in/nathaniel-candra-b21288206/" target="_blank">
                  Nathaniel Chandra
                </a>.
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <UserAuthForm formMode={formMode} />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Dengan memakai platform ini, anda setuju{" "}
              <Link href="#" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              dan{" "}
              <Link href="#" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
