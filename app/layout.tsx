import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BEExpert",
  description: "Platform bimbingan belajar berbasis AI yang dirancang untuk siswa SMA yang memungkinkan siswa untuk memasukkan pertanyaan melalui suara dan gambar secara langsung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster richColors />
        </body>
    </html>
  );
}
