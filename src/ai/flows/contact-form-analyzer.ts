'use server';

/**
 * @fileOverview Analyzes contact form submissions to route requests to the appropriate team
 *               and suggest nearby branches based on location data (if available).
 *
 * - analyzeContactForm - A function that analyzes the contact form and suggests routing.
 * - ContactFormInput - The input type for the analyzeContactForm function.
 * - ContactFormOutput - The return type for the analyzeContactForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContactFormInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the form.'),
  email: z.string().email().describe('The email address of the person submitting the form.'),
  phone: z.string().optional().describe('The phone number of the person submitting the form (optional).'),
  message: z.string().describe('The message from the contact form.'),
  location: z.string().optional().describe('The zip code of the person submitting the form (optional).'),
  howDidYouHear: z.string().optional().describe('How the person heard about the company (optional).'),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

const ContactFormOutputSchema = z.object({
  suggestedTeam: z.string().describe('The team to which the request should be routed.'),
  nearbyBranches: z.array(z.string()).describe('A list of nearby branches based on the provided location.'),
  summary: z.string().describe('A summary of the contact form submission.'),
});
export type ContactFormOutput = z.infer<typeof ContactFormOutputSchema>;

export async function analyzeContactForm(input: ContactFormInput): Promise<ContactFormOutput> {
  return analyzeContactFormFlow(input);
}

const analyzeContactFormPrompt = ai.definePrompt({
  name: 'analyzeContactFormPrompt',
  input: {schema: ContactFormInputSchema},
  output: {schema: ContactFormOutputSchema},
  prompt: `You are an expert in analyzing contact form submissions and routing them to the appropriate team.
  You will also suggest nearby branches based on the provided location, if available.

  Analyze the following contact form submission:

  Name: {{{name}}}
  Email: {{{email}}}
  Phone: {{{phone}}}
  Message: {{{message}}}
  Zip Code: {{{location}}}
  How They Heard: {{{howDidYouHear}}}

  Based on the message, determine the appropriate team to route the request to (e.g., Sales, Support, etc.).
  If a location (zip code) is provided, suggest nearby branches (e.g., ["Branch A", "Branch B"]).  If no location is provided, return an empty array for nearbyBranches.
  Provide a brief summary of the contact form submission.

  Ensure the output is in JSON format.
  `,
});

const analyzeContactFormFlow = ai.defineFlow(
  {
    name: 'analyzeContactFormFlow',
    inputSchema: ContactFormInputSchema,
    outputSchema: ContactFormOutputSchema,
  },
  async input => {
    const {output} = await analyzeContactFormPrompt(input);
    return output!;
  }
);
