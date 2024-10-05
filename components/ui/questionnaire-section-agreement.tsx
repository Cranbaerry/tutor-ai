import { AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export const agreements = [
  {
    id: "agreement-1",
    label:
      "Memberikan informasi data diri, jenjang pendidikan, dan informasi lainnya yang diperlukan peneliti secara jujur. Pihak BEEXPERT berjanji untuk menjaga kerahasiaan identitas pengguna.",
  },
  {
    id: "agreement-2",
    label:
      "Menjawab pertanyaan-pertanyaan yang diajukan dengan serius dan sesuai dengan pengalaman pengguna.",
  },
  {
    id: "agreement-3",
    label:
      "Mengerjakan soal yang dijadikan sebagai bahan uji coba dengan sungguh-sungguh dan memanfaatkan bantuan chatbot BEEXPERT dengan bijak.",
  },
];

export default function PersetujuanSection() {
  const form = useFormContext();
  return (
    <div>
      <AlertDialogTitle className="mb-2">Persetujuan</AlertDialogTitle>
      <p className="mb-2">
        Dengan mengikuti kegiatan uji coba pengembangan aplikasi BEEXPERT, saya
        setuju untuk:
      </p>

      <FormField
        control={form.control}
        name="agreements"
        render={() => (
          <FormItem className="mb-4">
            {agreements.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name="agreements"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...field.value, item.id]
                            : field.value.filter(
                                (value: string) => value !== item.id,
                              );
                          field.onChange(updatedValue);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal leading-normal">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
