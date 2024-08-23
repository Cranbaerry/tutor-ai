'use client'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
  } from "@/components/ui/navigation-menu"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { agreements, question5, question6, question7, question9 } from "./options"

const formSchema = z.object({
    fullname: z.string().min(2, {
      message: "Nama lengkap harus setidaknya 2 karakter.",
    }),
    email: z.string({
        required_error: "Email harus diisi.",
      }).email(),
    whatsappNumber: z.string(),
    gender: z.enum(["laki-laki", "perempuan"], {
        required_error: "Pilih salah satu opsi jenis kelamin",
      }),
    profession: z.string({
        required_error: "Pilih salah satu opsi profesi.",
      }),
    educationLevel: z.string({
        required_error: "Pilih salah satu opsi jenjang pendidikan.",
      }),
    school: z.string({
        required_error: "Asal sekolah/institusi harus diisi.",
    }),
    agreements: z.array(z.string()).refine((value) => value.length == agreements.length, {
        message: "Anda harus menyetujui semua poin.",
      }),
    question1: z.enum(["pernah", "tidak_pernah"], {
        required_error: "Pilih salah satu opsi.",
      }),
    question2: z.enum(["tidak_paham", "sedikit_paham", "cukup_paham", "sangat_paham"], {
        required_error: "Pilih salah satu opsi.",
      }),
    question3: z.enum(["pernah", "tidak_pernah"], {
        required_error: "Pilih salah satu opsi.",
      }),
    question4: z.enum(["ya", "tidak"], {
        required_error: "Pilih salah satu opsi.",
      }),
    question5: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Pilih setidaknya satu dari opsi-opsi di atas.",
      }),
    question6: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Pilih setidaknya satu dari opsi-opsi di atas.",
      }),
    question7: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Pilih setidaknya satu dari opsi-opsi di atas.",
      }),
    question8: z.enum(["setuju", "mungkin", "tidak_setuju"], {
        required_error: "Pilih salah satu opsi.",
      }),
    question9: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Pilih setidaknya satu dari opsi-opsi di atas.",
      }),
  })

export default function Kuisioner(){
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            agreements: [],
            fullname: "",
            email: "",
            whatsappNumber: "",
            question5: [],
            question6: [],
            question7: [],
            question9: [],
        },
    })
    
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <main className="flex min-h-screen flex-row items-start justify-between p-20 bg-[rgb(245,245,245)]">
            <NavigationMenu className="w-1/3">
                <NavigationMenuList className="flex-col items-start fixed top-25 left-10">
                    <NavigationMenuItem>
                        <Link href="#surat-persetujuan" legacyBehavior passHref>
                            <NavigationMenuLink className={`bg-[rgb(245,245,245)] text-gray-600 hover:text-black focus:text-black leading-loose`}>
                                Surat Persetujuan
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="#data-diri" legacyBehavior passHref>
                            <NavigationMenuLink className={`bg-[rgb(245,245,245)] text-gray-600 hover:text-black focus:text-black leading-loose`}>
                                Data Diri
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="#pertanyaan-umum" legacyBehavior passHref>
                            <NavigationMenuLink className={`bg-[rgb(245,245,245)] text-gray-600 hover:text-black focus:text-black leading-loose`}>
                                Pertanyaan Umum
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/test" legacyBehavior passHref>
                            <NavigationMenuLink className={`bg-[rgb(245,245,245)] text-gray-600 hover:text-black focus:text-black leading-loose`}>
                               Petunjuk Penggunaan
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="h-full w-2/3">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div id="surat-persetujuan" className="rounded-md border-0 p-4 bg-[rgb(255,255,255)]">
                        <h1 className="font-bold text-3xl mb-2">Surat Persetujuan</h1>
                        <FormField
                            control={form.control}
                            name="agreements"
                            render={() => (
                                <FormItem>
                                <div className="mb-4">
                                    <FormLabel>Dengan mengikuti kegiatan uji coba pengembangan aplikasi BEEXPERT, saya setuju untuk:</FormLabel>
                                </div>
                                {agreements.map((item) => (
                                    <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="agreements"
                                    render={({ field }) => {
                                        const value = field.value ?? []; // Ensure field.value is an array
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
                                                        (value) => value !== item.id
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
                    </div>

                    <div id="data-diri" className="rounded-md border-0 p-4 bg-[rgb(255,255,255)] mt-10">
                        <h1 className="font-bold text-3xl mb-2">Data Diri</h1>
                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Lengkap</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <br />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <br />
                        <FormField
                            control={form.control}
                            name="whatsappNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nomor Whatsapp (opsional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="081234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <br />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Jenis Kelamin</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-row space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                <RadioGroupItem value="laki-laki" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Laki-laki
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0 ml-10">
                                                <FormControl>
                                                <RadioGroupItem value="perempuan" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Perempuan
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <br />
                        <FormField
                            control={form.control}
                            name="profession"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profesi</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih salah satu profesi" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="student">Pelajar</SelectItem>
                                            <SelectItem value="teacher">Pendidik (Guru, Dosen, dll)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <br />
                        <FormField
                            control={form.control}
                            name="educationLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jenjang Pendidikan</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih salah satu profesi" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="elementary_school">Sekolah Dasar (SD)</SelectItem>
                                            <SelectItem value="junior_high_school">Sekolah Menengah Pertama (SMP)</SelectItem>
                                            <SelectItem value="high_school">Sekolah Menengah Atas (SMA)</SelectItem>
                                            <SelectItem value="bachelor">Strata 1 (S1) - Sarjana</SelectItem>
                                            <SelectItem value="master">Strata 2 (S2) - Magister</SelectItem>
                                            <SelectItem value="doctoral">Strata 3 (S3) - Doktoral</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <br />
                        <FormField
                            control={form.control}
                            name="school"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Asal Sekolah/Institusi</FormLabel>
                                    <FormControl>
                                        <Input placeholder="SMA xxx" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
                        
                        <div id="pertanyaan-umum" className="rounded-md border-0 p-4 bg-[rgb(255,255,255)] mt-10">
                            <h1 className="font-bold text-3xl mb-2">Pertanyaan Umum</h1>
                            <FormField
                                control={form.control}
                                name="question1"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
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
                            <br />
                            <FormField
                                control={form.control}
                                name="question2"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
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
                            <br />
                            <FormField
                                control={form.control}
                                name="question3"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
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
                            <br />
                            <FormField
                                control={form.control}
                                name="question4"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
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
                            <br />
                            <FormField
                                control={form.control}
                                name="question5"
                                render={() => (
                                    <FormItem>
                                    <div className="mb-4">
                                        <FormLabel>Apa tujuan Anda menggunakan chatbot?</FormLabel>
                                    </div>
                                    {question5.map((item) => (
                                        <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="question5"
                                        render={({ field }) => {
                                            const value = field.value ?? []; // Ensure field.value is an array
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
                                                            (value) => value !== item.id
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
                            <br />
                            <FormField
                                control={form.control}
                                name="question6"
                                render={() => (
                                    <FormItem>
                                    <div className="mb-4">
                                        <FormLabel>Apa fitur AI chatbot yang paling Anda sukai?</FormLabel>
                                    </div>
                                    {question6.map((item) => (
                                        <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="question6"
                                        render={({ field }) => {
                                            const value = field.value ?? []; // Ensure field.value is an array
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
                                                            (value) => value !== item.id
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
                            <br />
                            <FormField
                                control={form.control}
                                name="question7"
                                render={() => (
                                    <FormItem>
                                    <div className="mb-4">
                                        <FormLabel>Hal apa yang Anda kurang sukai dari AI chatbot?</FormLabel>
                                    </div>
                                    {question7.map((item) => (
                                        <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="question7"
                                        render={({ field }) => {
                                            const value = field.value ?? []; // Ensure field.value is an array
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
                                                            (value) => value !== item.id
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
                            <br />
                            <FormField
                                control={form.control}
                                name="question4"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
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
                            <br />
                            <FormField
                                control={form.control}
                                name="question9"
                                render={() => (
                                    <FormItem>
                                    <div className="mb-4">
                                        <FormLabel>Hal apa yang Anda kurang sukai dari AI chatbot?</FormLabel>
                                    </div>
                                    {question9.map((item) => (
                                        <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="question9"
                                        render={({ field }) => {
                                            const value = field.value ?? []; // Ensure field.value is an array
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
                                                            (value) => value !== item.id
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
                        </div>
                        
                        <div className="flex justify-end">
                            <Button type="submit">Berikutnya</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    )
}