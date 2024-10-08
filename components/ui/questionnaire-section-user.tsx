"use client";

import { useEffect } from "react";
import { AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserData } from "@/lib/utils";

export default function DataDiriSection() {
  const form = useFormContext();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserData();
      if (user != null) {
        form.setValue("fullName", user.user_metadata.full_name ?? "");
        form.setValue("email", user.email ?? "");
      }
    };
    fetchData();
  }, [form]);

  return (
    <>
      <AlertDialogTitle className="mb-2">Data Diri</AlertDialogTitle>
      <ScrollArea className="!mb-2 h-[calc(100vh-10rem)] sm:h-96 px-1">
        <p className="mb-2">
          Mohon isi data diri Anda dengan lengkap dan benar.
        </p>

        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => {
            return (
              <FormItem className="mb-2">
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      form.trigger("fullName");
                    }}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* WhatsApp Number */}
        <FormField
          control={form.control}
          name="whatsappNumber"
          render={({ field }) => {
            return (
              <FormItem className="mb-2">
                <FormLabel>Nomor WhatsApp (opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="081234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => {
            return (
              <FormItem className="mb-2 space-y-3">
                <FormLabel>Jenis Kelamin</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.trigger("gender");
                    }}
                    defaultValue={field.value}
                    className="flex flex-row space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="laki-laki" />
                      </FormControl>
                      <FormLabel className="font-normal">Laki-laki</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 ml-10">
                      <FormControl>
                        <RadioGroupItem value="perempuan" />
                      </FormControl>
                      <FormLabel className="font-normal">Perempuan</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Profession */}
        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => {
            return (
              <FormItem className="mb-2">
                <FormLabel>Profesi</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.trigger("profession");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih salah satu profesi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Pelajar</SelectItem>
                    <SelectItem value="teacher">
                      Pendidik (Guru, Dosen, dll)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Education Level */}
        <FormField
          control={form.control}
          name="educationLevel"
          render={({ field }) => {
            return (
              <FormItem className="mb-2">
                <FormLabel>Jenjang Pendidikan</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.trigger("educationLevel");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih salah satu jenjang pendidikan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="elementary_school">
                      Sekolah Dasar (SD)
                    </SelectItem>
                    <SelectItem value="junior_high_school">
                      Sekolah Menengah Pertama (SMP)
                    </SelectItem>
                    <SelectItem value="high_school">
                      Sekolah Menengah Atas (SMA)
                    </SelectItem>
                    <SelectItem value="bachelor">
                      Strata 1 (S1) - Sarjana
                    </SelectItem>
                    <SelectItem value="master">
                      Strata 2 (S2) - Magister
                    </SelectItem>
                    <SelectItem value="doctoral">
                      Strata 3 (S3) - Doktoral
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* School */}
        <FormField
          control={form.control}
          name="school"
          render={({ field }) => {
            return (
              <FormItem className="mb-2">
                <FormLabel>Asal Sekolah/Institusi</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SMA xxx"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      form.trigger("school");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </ScrollArea>
    </>
  );
}
