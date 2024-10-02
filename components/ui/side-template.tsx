import Image from "next/legacy/image";

export const SideTemplate = () => (
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
)