'use client'

import { useFormContext } from "react-hook-form"
import { AlertDialogTitle } from "@/components/ui/alert-dialog"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"

export const question5 = [
    {
        id: "question5-1",
        label: "Membantu memberikan solusi terhadap suatu pertanyaan."
    },
    {
        id: "question5-2",
        label: "Menjelaskan konsep-konsep yang kurang dipahami."
    },
    {
        id: "question5-3",
        label: "Memberikan ide dan masukan."
    },
    {
        id: "question5-4",
        label: "Membantu mengerjakan tugas."
    },
    {
        id: "question5-5",
        label: "Menyusun materi presentasi atau pengajaran."
    },
    {
        id: "question5-6",
        label: "Membuat materi dan latihan soal."
    },
    {
        id: "question5-7",
        label: "Lainnya."
    }
]

export const question6 = [
    {
        id: "question6-1",
        label: "Pemberian jawaban yang cukup akurat."
    },
    {
        id: "question6-2",
        label: "Pemberian jawaban yang instan."
    },
    {
        id: "question6-3",
        label: "Dapat memahami input gambar dan teks dengan baik."
    },
    {
        id: "question6-4",
        label: "Lainnya."
    }
]

export const question7 = [
    {
        id: "question7-1",
        label: "Jawaban yang kadang ambigu."
    },
    {
        id: "question7-2",
        label: "Jawaban yang kurang detail."
    },
    {
        id: "question7-3",
        label: "Jawaban yang keliru."
    },
    {
        id: "question7-4",
        label: "Keterbatasan dalam berinteraksi."
    },
    {
        id: "question7-5",
        label: "Lainnya."
    }
]

export const question9 = [
    {
        id: "question9-1",
        label: "Chatbot yang didesain untuk lebih berfokus pada pemberian stimulus dibandingkan jawaban secara eksplisit."
    },
    {
        id: "question9-2",
        label: "Chatbot yang dapat memahami dan menyesuakan responsnya sesuai dengan tujuan pembelajaran yang ditetapkan."
    },
    {
        id: "question9-3",
        label: "Chatbot yang dapat berinteraksi secara aktif, seperti melalui suara dan coretan."
    },
    {
        id: "question9-4",
        label: "Chatbot yang dapat secara otomatis menguji pemahaman siswa, seperti dengan memberikan pop quiz."
    },
    {
        id: "question9-5",
        label: "Lainnya."
    }
]

export default function PertanyaanUmumSection() {
    const form = useFormContext();
    return (
        <>
            <AlertDialogTitle className="mb-2">Pertanyaan Umum</AlertDialogTitle>
            <ScrollArea className="!mb-2 h-[calc(100vh-10rem)] sm:h-96 px-1">
                <p className="mb-2">Jawab pertanyaan-pertanyaan berikut dengan benar.</p>

                <FormField
                    control={form.control}
                    name="question1"
                    render={({ field }) => (
                        <FormItem className="mb-2">
                            <FormLabel>Apakah Anda pernah mempelajari Trigonometri Matematika SMA?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-row space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="pernah" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Pernah
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 ml-10">
                                        <FormControl>
                                            <RadioGroupItem value="tidak_pernah" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Tidak pernah
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="question2"
                    render={({ field }) => (
                        <FormItem className="mb-2">
                            <FormLabel>Seberapa paham Anda dengan materi Trigonometri?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-row space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="tidak_paham" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Tidak paham
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 ml-10">
                                        <FormControl>
                                            <RadioGroupItem value="sedikit_paham" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Sedikit paham
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 ml-10">
                                        <FormControl>
                                            <RadioGroupItem value="cukup_paham" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Cukup paham
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 ml-10">
                                        <FormControl>
                                            <RadioGroupItem value="sangat_paham" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Sangat paham
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="question3"
                    render={({ field }) => (
                        <FormItem className="mb-2">
                            <FormLabel>Apakah Anda pernah menggunakan chatbot (ChatGPT, Gemini, dll.) untuk keperluan akademik?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-row space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="pernah" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Pernah
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 ml-10">
                                        <FormControl>
                                            <RadioGroupItem value="tidak_pernah" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Tidak pernah
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="question4"
                    render={({ field }) => (
                        <FormItem className="mb-2">
                            <FormLabel>Apakah kehadiran AI chatbot mempercepat proses pemahaman Anda terhadap suatu konsep?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-row space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="ya" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Ya
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 ml-10">
                                        <FormControl>
                                            <RadioGroupItem value="tidak" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Tidak
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="question5"
                    render={() => (
                        <FormItem className="mb-2">
                            <FormLabel>Apa tujuan Anda menggunakan chatbot?</FormLabel>
                            {question5.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="question5"
                                    render={({ field }) => {
                                        const value = field.value ?? [];
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value: string) => value !== item.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal leading-normal">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="question6"
                    render={() => (
                        <FormItem className="mb-2">
                            <FormLabel>Apa fitur AI chatbot yang paling Anda sukai?</FormLabel>
                            {question6.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="question6"
                                    render={({ field }) => {
                                        const value = field.value ?? [];
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value: string) => value !== item.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal leading-normal">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="question7"
                    render={() => (
                        <FormItem className="mb-2">
                            <FormLabel>Hal apa yang Anda kurang sukai dari AI chatbot?</FormLabel>
                            {question7.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="question7"
                                    render={({ field }) => {
                                        const value = field.value ?? [];
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value: string) => value !== item.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal leading-normal">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="question8"
                    render={({ field }) => (
                        <FormItem className="mb-2">
                            <FormLabel>Apakah Anda setuju bila ChatGPT digunakan sebagai asisten belajar siswa?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-row space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="setuju" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Setuju
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 ml-10">
                                        <FormControl>
                                            <RadioGroupItem value="mungkin" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Mungkin
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 ml-10">
                                        <FormControl>
                                            <RadioGroupItem value="tidak_setuju" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Tidak setuju
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="question9"
                    render={() => (
                        <FormItem className="mb-2">
                            <FormLabel>Hal apa yang Anda harapkan dari sebuah AI chatbot untuk asisten belajar?</FormLabel>

                            {question9.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="question9"
                                    render={({ field }) => {
                                        const value = field.value ?? [];
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value: string) => value !== item.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal leading-normal">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </ScrollArea>
        </>
    )
}
