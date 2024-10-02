import { getUserData } from "@/lib/utils";
import AuthPageContent from "@/components/ui/auth-page-content";
import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation'
import Image from "next/legacy/image";

async function AuthenticationPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const supabase = createClient();
  const userData = await getUserData(supabase);
  const isAuthCodeError = 'auth-code-error' in searchParams;
  if (userData) redirect('/kuisioner');

  return (
    <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 h-screen">
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
      <AuthPageContent isAuthCodeError={isAuthCodeError} />
    </div>
  );
}

export default AuthenticationPage;
