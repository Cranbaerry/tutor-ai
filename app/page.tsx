import Image from "next/image";
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-[rgb(245,245,245)]">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <p className="text-center text-3xl">SELAMAT DATANG DI</p>
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert items-center justify-center"
          src="/beexpert-logo.svg"
          alt="BEEXPERT Logo"
          width={180}
          height={37}
          priority
        />
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert items-center justify-center"
          src="/beexpert-name.svg"
          alt="BEEXPERT"
          width={251}
          height={37}
          priority
        />
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <div className="w-1/2 border-r-2 border-black pr-4 flex justify-end items-center">
          <div className="w-2/3">
            <p className="text-right">
              BEEXPERT merupakan platform bimbingan belajar bersama AI. Aplikasi ini ditujukan untuk para siswa SMA yang membutuhkan bantuan dalam mencari solusi suatu permasalahan Matematika, khususnya Trigonometri. Model AI yang diimplementasikan sudah dimodifikasi sedemikian rupa sehingga mampu memberikan respons yang akurat dan berinteraksi secara instan. Dengan mengintegrasikan model GPT-4o, BEEXPERT mampu menerima masukan berupa suara dan gambar secara langsung (live-sketch).
            </p>
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <p className="text-left mb-2">
            Tekan tombol berikut untuk mulai uji coba!
          </p>
          
          <Link 
            className={`${buttonVariants({ variant: "default" })} cursor-pointer`} 
            href="/kuisioner">
            Mulai Uji Coba
          </Link>
        </div>
      </div>
    </main>
  );
}
