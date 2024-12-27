import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import useRecipe from "~/hooks/use-recipe";
import { CreateSchema } from "~/lib/definitions";

export const Route = createFileRoute("/_layout/create")({
  component: RouteComponent,
});

type FormData = z.infer<typeof CreateSchema>;

function RouteComponent() {
  const { mutate } = useRecipe({});
  const form = useForm<FormData>({
    resolver: zodResolver(CreateSchema),
    defaultValues: {
      cuisine: "",
      instructions: [""],
      servings: 1,
      name: "",
      cooking_time: 1,
      dietary_restrictions: [""],
      preparation_time: 1,
      tags: [""],
      description: "",
      difficulty: "",
      image: undefined,
    },
  });

  const {
    append: appendInstructions,
    fields: instructionFields,
    remove: removeInstructions,
  } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  const {
    append: appendTags,
    fields: tagFields,
    remove: removeTags,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const {
    append: appendDietaryRestrictions,
    fields: dietaryFields,
    remove: removeDietaryRestrictions,
  } = useFieldArray({
    control: form.control,
    name: "dietary_restrictions",
  });

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    try {
      console.log("Form submitted with data:", JSON.stringify(data));
      const { image, ...recipeData } = data;
      mutate.mutateAsync({
        body: { image: image, recipe: JSON.stringify(recipeData) },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto space-y-8 p-8"
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-bold dark:text-white">
            Create New Recipe
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Fill in the details to create your recipe
          </p>
        </div>

        {/* Image Upload */}
        <Card className="p-6 dark:bg-gray-700">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => {
              const imageRef = useRef<HTMLImageElement>(null);

              useEffect(() => {
                if (field.value && imageRef.current) {
                  imageRef.current.src = URL.createObjectURL(field.value);
                }
              }, [field.value]);

              return (
                <FormItem>
                  <FormLabel className="dark:text-white">
                    Recipe Image
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center justify-center w-full">
                      {field.value ? (
                        <div className="relative w-full max-w-md aspect-video">
                          <img
                            ref={imageRef}
                            alt="Recipe preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => field.onChange(undefined)}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                field.onChange(e.target.files[0]);
                              }
                            }}
                            className="cursor-pointer dark:text-white dark:bg-gray-600 dark:border-gray-500"
                          />
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Recommended: 16:9 ratio, max 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </Card>

        {/* Basic Information */}
        <Card className="p-6 space-y-6 dark:bg-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">
            Basic Information
          </h2>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white">Recipe Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="E.g., Classic Margherita Pizza"
                    className="dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="cuisine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">Cuisine</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="E.g., Italian"
                      className="dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">
                    Difficulty Level
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="dark:bg-gray-600 dark:text-white dark:border-gray-500">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-gray-700">
                      <SelectItem value="easy" className="dark:text-white">
                        Easy
                      </SelectItem>
                      <SelectItem value="medium" className="dark:text-white">
                        Medium
                      </SelectItem>
                      <SelectItem value="hard" className="dark:text-white">
                        Hard
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white">Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write a brief description of your recipe..."
                    className="h-24 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        {/* Time and Servings */}
        <Card className="p-6 space-y-6 dark:bg-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">
            Time and Servings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="preparation_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">
                    Prep Time (mins)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cooking_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">
                    Cook Time (mins)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">Servings</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 space-y-4 dark:bg-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold dark:text-white">
              Instructions
            </h2>
            <Button
              type="button"
              onClick={() => appendInstructions("")}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="size-4" /> Add Step
            </Button>
          </div>

          <div className="space-y-4">
            {instructionFields.map((field, index) => (
              <div key={field.id} className="flex gap-4">
                <div className="flex-grow">
                  <FormField
                    control={form.control}
                    name={`instructions.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <span className="flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-full w-8 h-8 shrink-0 dark:text-white">
                              {index + 1}
                            </span>
                            <Textarea
                              {...field}
                              placeholder={`Step ${index + 1}`}
                              className="flex-grow dark:bg-gray-600 dark:text-white dark:border-gray-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeInstructions(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Tags and Dietary Restrictions */}
        <Card className="p-6 space-y-6 dark:bg-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">
            Tags and Dietary Info
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex flex-col max-md:gap-5 md:flex-row justify-between items-center mb-4">
                <FormLabel className="dark:text-white">Tags</FormLabel>
                <Button
                  type="button"
                  onClick={() => appendTags("")}
                  size="sm"
                  className="flex max-md:w-full items-center gap-2"
                >
                  <Plus className="size-4" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tagFields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="flex items-center gap-2 dark:bg-gray-600 dark:text-white"
                  >
                    <FormField
                      control={form.control}
                      name={`tags.${index}`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="w-24 border-none p-0 h-auto bg-transparent dark:text-white"
                          placeholder="New tag"
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-4 p-0"
                      onClick={() => removeTags(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-col md:flex-row max-md:gap-5 justify-between items-center mb-4">
                <FormLabel className="dark:text-white">
                  Dietary Restrictions
                </FormLabel>
                <Button
                  type="button"
                  onClick={() => appendDietaryRestrictions("")}
                  size="sm"
                  className="flex max-md:w-full items-center gap-2"
                >
                  <Plus className="size-4" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {dietaryFields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="flex items-center gap-2 dark:bg-gray-600 dark:text-white"
                  >
                    <FormField
                      control={form.control}
                      name={`dietary_restrictions.${index}`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="w-24 border-none p-0 h-auto bg-transparent dark:text-white"
                          placeholder="New restriction"
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-4 p-0"
                      onClick={() => removeDietaryRestrictions(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              "Publish Recipe"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
