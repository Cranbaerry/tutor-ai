import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function PetunjukPengunaan(){
    return (
        <main className="flex min-h-screen flex-row items-start justify-center p-20 bg-[rgb(245,245,245)]">
            <div className="h-full w-3/4">
                <div id="surat-persetujuan" className="rounded-md border-0 p-4 bg-[rgb(255,255,255)]">
                    <h1 className="font-bold text-3xl mb-2">Petunjuk Penggunaan</h1>
                    <p>Mohon baca petunjuk berikut sebelum melakukan uji coba chatbot BEEXPERT:</p>
                    <ul className="list-disc pl-5">
                        <li className="hover:text-blue-600">
                            Oleh karena BEEXPERT dapat menerima masukan berupa suara, maka sangat disarankan untuk user menggunakan earphone atau headset selama berinteraksi dengan AI Chatbot.
                        </li>
                        <li className="hover:text-blue-600">Kerjakan soal di <i>canvas</i> yang sudah tersedia.</li>
                        <li className="hover:text-blue-600">Beri tanda atau coretan seperlunya.</li>
                        <li className="hover:text-blue-600">Gunakan fitur pena dan penghapus sesuai dengan kebutuhan.</li>
                        <li className="hover:text-blue-600">
                            Tekan tombol “submit” setelah menuliskan jawaban di canvas supaya AI Chatbot dapat memberikan respons.
                        </li>
                        <li className="hover:text-blue-600">
                            Tekan tombol “Selesai” jika sudah menyelesaikan soal dan ingin mengakhiri sesi uji coba BEEXPERT.
                        </li>
                    </ul>

                    <div className="flex justify-center mt-10" >
                        <iframe
                            width="900"
                            height="438"
                            src="https://www.youtube.com/embed/LEjhY15eCx0"
                            title="Inside Out 2 | Official Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerPolicy="strict-origin-when-cross-origin" 
                            allowFullScreen   
                        ></iframe>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Link 
                        className={`${buttonVariants({ variant: "default" })} cursor-pointer bg-gray-500 mr-4`} 
                        href="/kuisioner">
                        Kembali
                    </Link>

                    <Link 
                        className={`${buttonVariants({ variant: "default" })} cursor-pointer`} 
                        href="/playground">
                        Mulai Coba
                    </Link>
                </div>
            </div>
        </main>
    )
}