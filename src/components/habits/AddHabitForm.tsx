"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/utils/misc";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { days } from "@/utils/constants/date";
import { useMemo } from "react";

const colors = [
  // "#81968d",
  // "#a2b099",
  // "#debd8f",
  "#81968d",
  "#7859a6",
  "#a6595b",
  "#59a68f",
  "#a67859",
  "#a65971",
  "#a6596a",
  "#71a659",
  "#f9ac78",
  // "#bc8294",
  // "#9AC885",
] as const;

const getFrequencyArray = (array: string[]) =>
  Array(7)
    .fill(false)
    .map((_, index) => array.includes(String(index)));

const turnFrequencyArrayInto = (array: boolean[]) =>
  array.reduce((prev, curr, index) => {
    if (curr) prev.push(String(index));

    return prev;
  }, [] as string[]);
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please provide a valid name.",
  }),
  color: z.string(),
  frequency: z.string().array(), //.length(7),
});

export function ProfileForm({
  onSubmit,
  args,
}: {
  args?: { name: string; color: string; frequency: boolean[] };
  onSubmit: ({
    name,
    color,
    frequency,
  }: {
    name: string;
    color: string;
    frequency: boolean[];
  }) => void;
}) {
  const isEditing = useMemo(() => args?.name != undefined, [args]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: args?.name ?? "",
      color: args?.color ?? "#81968d",
      frequency: args?.frequency
        ? turnFrequencyArrayInto(args?.frequency)
        : [0, 1, 2, 3, 4, 5, 6].map(String),
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const { name, color, frequency } = values;
    onSubmit({ name, color, frequency: getFrequencyArray(frequency) });
    form.setValue("name", "");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="my-4">
              <FormLabel>Color</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center justify-between space-y-1 "
                >
                  {colors.map((color) => (
                    <FormItem
                      key={color}
                      className="flex items-center justify-center"
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={color}
                          className="h-8 w-8 rounded-full"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem className="my-4">
              <FormLabel>Frequency</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="multiple"
                  onValueChange={field.onChange}
                  className="gap-0"
                  defaultValue={field.value}
                >
                  {days.map((day, index) => (
                    <ToggleGroupItem
                      key={day}
                      value={index.toString()}
                      aria-label={`Toggle ${day}`}
                      className="hover:bg-purple-30 h-6 w-6 flex-1 rounded-none border-x border-y-0 border-solid  border-x-purple-200 bg-purple-50 p-1 text-center text-purple-300 first:border-0 last:border-0 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-400"
                    >
                      {day.substring(0, 3)}
                      {/* {JSON.stringify(index.toString())} */}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="jounral"
          className={cn(
            {
              "bg-green-200 text-green-700 hover:bg-green-200/50": true,
            },
            "w-fit",
          )}
        >
          {isEditing ? "Update" : "Add"}
        </Button>
      </form>
    </Form>
  );
}
