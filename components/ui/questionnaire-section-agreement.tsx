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
      "Honestly provide personal information, educational background, and any other information required by the researcher. BEEXPERT is committed to maintaining the confidentiality of user identities.",
  },
  {
    id: "agreement-2",
    label:
      "Addressing the questions posed seriously and in accordance with user experience.",
  },
  {
    id: "agreement-3",
    label:
      "Thoroughly work on the practice questions and utilize the BEEXPERT chatbot wisely.",
  },
];

export default function PersetujuanSection() {
  const form = useFormContext();
  return (
    <div>
      <AlertDialogTitle className="mb-2">Agreements</AlertDialogTitle>
      <p className="mb-2">
        By participating in the BEEXPERT application development testing, I agree to:
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
