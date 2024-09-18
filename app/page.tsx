'use client'

import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { login, signup } from './login/actions'
import Swal from 'sweetalert2'
import { redirect } from 'next/navigation'

async function trylogin(formData: FormData){
  let loginResult = await Swal.fire({
    title: "Loading",
    icon: "info",
    didOpen: async () => {
      Swal.showLoading();

      let loginResult = await login(formData)

      console.log(loginResult)
      if (loginResult){
        Swal.fire({
          title: "Login Success!",
          icon: "success"
        })

        return true

      } else {
        Swal.fire({
          title: "Login Failed!",
          text: "Email or Password is incorrect!",
          icon: "error"
        })

        return false
      }
    }
  });

  if (loginResult) {
    redirect('/kuisioner')
  }
}


export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen bg-white text-black">
      <div className="flex-1 flex flex-col justify-between">
        <div className="p-8">
          <div className="flex items-center space-x-2">
            <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert items-center justify-center"
              src="/beexpert-logo.svg"
              alt="BEEXPERT Logo"
              width={120}
              height={37}
              priority
            />
            <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert items-center justify-center animate-wipe-in-out"
              src="/beexpert-name.svg"
              alt="BEEXPERT"
              width={251}
              height={37}
              priority
            />
          </div>
        </div>
        <div className="p-8">
          <p className="text-left text-zinc-400">
            BEEXPERT merupakan platform bimbingan belajar bersama AI. Aplikasi ini ditujukan untuk para siswa SMA yang membutuhkan bantuan dalam mencari solusi suatu permasalahan Matematika, khususnya Trigonometri. Model AI yang diimplementasikan sudah dimodifikasi sedemikian rupa sehingga mampu memberikan respons yang akurat dan berinteraksi secara instan. Dengan mengintegrasikan model GPT-4o, BEEXPERT mampu menerima masukan berupa suara dan gambar secara langsung (live-sketch).
          </p>
        </div>
      </div>
      <div className="w-1/2 bg-[rgb(245,245,245)] flex items-center justify-center">
        <div className="w-96 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Masuk</h1>
            <p className="text-zinc-400">Belum mempunyai akun?{' '}<Link href="/kuisioner" className="underline underline-offset-4 hover:text-black">
              Daftar sekarang
            </Link></p>
          </div>
          <form action="">
            <div className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="name@example.com"
                className="bg-[rgb(245,245,245)] border-zinc-700 text-black placeholder-zinc-400"
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Kata sandi"
                  className="bg-[rgb(245,245,245)] border-zinc-700 text-black placeholder-zinc-400 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-zinc-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-zinc-500" />
                  )}
                </Button>
              </div>
              <Button className="w-full bg-black text-white hover:bg-zinc-200 hover:text-black" formAction={trylogin}>
                Masuk dengan Email
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[rgb(245,245,245)] px-2 text-zinc-400">Atau masuk dengan</span>
            </div>
          </div>
          <Button className="w-full bg-zinc-500 text-white hover:bg-zinc-200 hover:text-black space-x-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Gmail</span>
          </Button>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <Button variant="ghost" className="text-black hover:bg-white">
          Daftar
        </Button>
      </div>
    </main>
  );
}