"use server";

import { z } from "zod";
import { analyzeContactForm } from "@/ai/flows/contact-form-analyzer";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  location: z.string().optional(),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: {
    suggestedTeam: string;
    nearbyBranches: string[];
    summary: string;
  };
};

export async function handleContactFormSubmission(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = Object.fromEntries(formData);
  const validatedFields = contactFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const_errors = validatedFields.error.flatten().fieldErrors;
    return {
      message: "Error: Please check the fields.",
      fields: {
        name: rawData.name as string,
        email: rawData.email as string,
        message: rawData.message as string,
        location: rawData.location as string,
      },
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const result = await analyzeContactForm(validatedFields.data);
    return {
      message: "Success! Your message has been analyzed.",
      data: result,
    };
  } catch (error) {
    return {
      message: "Error: AI analysis failed. Please try again later.",
      fields: validatedFields.data,
    };
  }
}
