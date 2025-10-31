"use server";

import { z } from "zod";
import { analyzeContactForm } from "@/ai/flows/contact-form-analyzer";

const contactFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(1, { message: "Phone number is required." }),
  zip: z.string().min(5, { message: "Please enter a valid zip code." }),
  project: z.string().min(10, { message: "Message must be at least 10 characters." }),
  howDidYouHear: z.string().optional(),
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
    return {
      message: "Error: Please check the fields.",
      fields: {
        firstName: rawData.firstName as string,
        lastName: rawData.lastName as string,
        email: rawData.email as string,
        phone: rawData.phone as string,
        zip: rawData.zip as string,
        project: rawData.project as string,
        howDidYouHear: rawData.howDidYouHear as string,
      },
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const result = await analyzeContactForm({
      name: `${validatedFields.data.firstName} ${validatedFields.data.lastName}`,
      email: validatedFields.data.email,
      message: validatedFields.data.project,
      location: validatedFields.data.zip,
      phone: validatedFields.data.phone,
      howDidYouHear: validatedFields.data.howDidYouHear,
    });
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
