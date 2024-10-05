import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronsUpDown, UploadCloud } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

export const Route = createFileRoute("/_layout/create")({
  component: RecipeCreationPage,
});

// Validation Schema using Yup
const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required."),
  description: z.string().min(1, "Description is required."),
  ingredients: z.string().min(1, "Ingredients are required."),
  instructions: z.string().min(1, "Instructions are required."),
  cookingTime: z
    .number({ invalid_type_error: "Cooking time must be a number." })
    .positive("Cooking time must be a positive number.")
    .min(1, "Cooking time must be at least 1 minute."),
  preparationTime: z
    .number({ invalid_type_error: "Preparation time must be a number." })
    .positive("Preparation time must be a positive number.")
    .min(1, "Preparation time must be at least 1 minute."),
  servings: z
    .number({ invalid_type_error: "Servings must be a number." })
    .positive("Servings must be a positive number.")
    .min(1, "At least 1 serving is required."),
  cuisine: z.string().min(1, "Cuisine is required."),
  dietaryRestrictions: z.string().optional(),
  image: z.instanceof(File).nullable(),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type Recipe = z.infer<typeof recipeSchema>;

function RecipeCreationPage() {
  const form = useForm<Recipe>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      description: "",
      ingredients: "",
      instructions: "",
      cookingTime: 0,
      preparationTime: 0,
      servings: 0,
      cuisine: "",
      dietaryRestrictions: "",
      image: null,
      tags: "",
      notes: "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<Recipe> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });

    setSubmitSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting recipe:", error);
    }
  };

  return (
    <ScrollArea>
      <div className="p-6 space-y-8">
        {submitSuccess && (
          <p className="mb-4 text-green-500 text-center">
            Recipe created successfully!
          </p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Recipe Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter recipe name"
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Cuisine */}
                <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Italian">Italian</SelectItem>
                            <SelectItem value="Mexican">Mexican</SelectItem>
                            <SelectItem value="Indian">Indian</SelectItem>
                            <SelectItem value="Chinese">Chinese</SelectItem>
                            <SelectItem value="American">American</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-6" />
            </section>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Enter a short description of your recipe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Image</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed rounded-md p-6 relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute top-0 left-0 w-full h-full opacity-0"
                        aria-label="Recipe image upload"
                      />
                      <div className="flex flex-col items-center">
                        <UploadCloud className="h-8 w-8 text-gray-500" />
                        <p className="mt-2 text-sm text-gray-500">
                          Drag and drop or click to upload
                        </p>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}

            <Separator className="my-6" />

            <section>
              <h2 className="text-lg font-semibold mb-4">Cooking Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Ingredients */}
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredients</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? languages.find(
                                    (language) => language.value === field.value
                                  )?.label
                                : "Select language"}
                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search language..." />
                            <CommandList>
                              <CommandEmpty>No language found.</CommandEmpty>
                              <CommandGroup>
                                {languages.map((language) => (
                                  <CommandItem
                                    value={language.label}
                                    key={language.value}
                                    onSelect={() => {
                                      form.setValue(
                                        "ingredients",
                                        language.value
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        language.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {language.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Instructions */}
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Step-by-step instructions"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <Separator className="my-6" />

            {/* Cooking and Preparation Time */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="cookingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cooking Time (in minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Cooking time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preparationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparation Time (in minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Preparation time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? "Creating..." : "Create Recipe"}
            </Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}
