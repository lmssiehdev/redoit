import { VerticalView } from "@/components/calendar/weekly/view";
import { ColorPicker } from "@/components/colorPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_HABIT_COLOR } from "@/constants";
import { useHabitsStore } from "@/state";
import { createFileRoute } from "@tanstack/react-router";
import "../index.css";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

export function HomeComponent() {
  return (
    <div className="max-w-screen-sm mx-auto">
      {/* <AddHabit /> */}
      <VerticalView />
    </div>
  );
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please provide a valid name.",
  }),
  color: z.string(),
});

function AddHabit() {
  const addHabit = useHabitsStore((state) => state.addHabit);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: DEFAULT_HABIT_COLOR,
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const { name, color } = values;
    addHabit({ name, color });
    form.setValue("name", "");
    form.setValue("color", DEFAULT_HABIT_COLOR);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex gap-2"
        >
          <div className="flex gap-2 justify-end flex-1">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex-end">
                  <FormControl>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="self-start">Add</Button>
        </form>
      </Form>
    </>
  );
}
