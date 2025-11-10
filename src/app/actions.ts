
"use server";

import { z } from "zod";
import { analyzeContactForm } from "@/ai/flows/contact-form-analyzer";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase/server-init";

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
    
    // Save to Firestore
    try {
        const { firestore } = initializeFirebase();
        const estimateRequestsCollection = collection(firestore, 'estimateRequests');
        await addDoc(estimateRequestsCollection, {
            name: `${validatedFields.data.firstName} ${validatedFields.data.lastName}`,
            email: validatedFields.data.email,
            phone: validatedFields.data.phone,
            zip: validatedFields.data.zip,
            project: validatedFields.data.project,
            howDidYouHear: validatedFields.data.howDidYouHear || '',
            submittedAt: serverTimestamp(),
            suggestedTeam: result.suggestedTeam,
            summary: result.summary,
            nearbyBranches: result.nearbyBranches,
            status: 'new'
        });
    } catch (dbError: any) {
        console.error("Firestore write error:", dbError);
        // Don't block the user, just log the error for now. The user still gets the success message.
    }


    return {
      message: "Success! Your request has been sent.",
    };
  } catch (error) {
    console.error("AI analysis error:", error);
    return {
      message: "Error: AI analysis failed. Please try again later.",
      fields: validatedFields.data,
    };
  }
}
