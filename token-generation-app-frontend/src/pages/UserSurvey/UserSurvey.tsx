import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const phoneRegex = /^(?:\+959|09)\d{9}$/;

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      phoneRegex,
      "Phone number must start with +959 or 09 and have 11 digits"
    ),
  companyName: z.string().min(1, "Company name is required"),
  designation: z.string().min(1, "Designation is required"),
});

type FormSchema = z.infer<typeof formSchema>;

export default function UserSurvey() {
  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      companyName: "",
      designation: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    const res = await fetch(
      'http://localhost:3000/api/users/create',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();
    if (res.ok) {
      navigate(`/token/${result.id}`);
    } else {
      alert(result.message || "Submission failed");
    }
  };

  return (
    <>
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <div className="mb-6 text-center ml-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Please fill out the participant survey below
          </p>
        </div>
        <h2 className="text-2xl font-semibold text-center">
          Participant Survey
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {["name", "phoneNumber", "companyName", "designation"].map(
              (field) => (
                <FormField
                  key={field}
                  name={field as keyof FormSchema}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{field.name}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter your ${field.name}`}
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
