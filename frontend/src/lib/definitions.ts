import { z } from "zod";

const FileSchema = z.custom<File>(
  (value) => {
    // Check if value is File or Blob
    const isValidType = value instanceof File;
    if (!isValidType) return false;

    const type = value.type;

    const ALLOWED_MIME_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    return ALLOWED_MIME_TYPES.includes(type);
  },
  {
    message: "Please provide a valid image file (JPEG, PNG, GIF, or WebP)",
  },
);

export const CreateSchema = z.object({
  cuisine: z
    .string({ required_error: "Cuisine is required" })
    .min(1, { message: "Cuisine cannot be empty" }),

  instructions: z.array(
    z.string().min(1, { message: "Instruction step cannot be empty" }),
    {
      required_error: "Instructions are required",
    },
  ),
  servings: z
    .number({ required_error: "Servings are required" })
    .int({ message: "Servings must be an integer" })
    .positive({ message: "Servings must be a positive number" }),

  name: z
    .string({ required_error: "Recipe name is required" })
    .min(1, { message: "Recipe name cannot be empty" }),

  cooking_time: z
    .number({ required_error: "Cooking time is required" })
    .positive({ message: "Cooking time must be a positive number" }),

  dietary_restrictions: z.array(
    z.string().min(1, { message: "dietary_restrictions cannot be empty" }),
    {
      required_error: "dietary_restrictions are required",
    },
  ),
  preparation_time: z
    .number({ required_error: "Preparation time is required" })
    .positive({ message: "Preparation time must be a positive number" }),

  tags: z.array(z.string().min(1, { message: "Tag cannot be empty" }), {
    required_error: "Tags are required",
  }),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, { message: "Description cannot be empty" }),

  difficulty: z
    .string({ required_error: "Difficulty is required" })
    .min(1, { message: "Difficulty cannot be empty" }),

  image: FileSchema.refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB in bytes
    {
      message: "Image must be less than 5MB",
    },
  ),
});
