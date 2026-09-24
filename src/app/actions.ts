'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import {
  estimateRequestHtml,
  estimateRequestSubject,
  estimateRequestText,
} from '@/lib/email/estimate-request-email';

const contactFormSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'First name is required.' }).max(100),
  lastName: z.string().trim().min(1, { message: 'Last name is required.' }).max(100),
  email: z.string().trim().email({ message: 'Please enter a valid email.' }),
  phone: z.string().trim().min(7, { message: 'Please enter a valid phone number.' }).max(30),
  zip: z.string().trim().min(5, { message: 'Please enter a valid zip code.' }).max(10),
  project: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters.' })
    .max(5000, { message: 'Message is too long.' }),
  howDidYouHear: z.string().optional(),
});

type ContactFields = z.infer<typeof contactFormSchema>;

export type FormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  fields?: Partial<Record<keyof ContactFields, string>>;
  errors?: Partial<Record<keyof ContactFields, string>>;
};

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'constspcltsfargo@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Construction Specialties Website <onboarding@resend.dev>';

export async function handleContactFormSubmission(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;

  // Honeypot: real visitors never see or fill this field.
  if (raw.company) {
    return { status: 'success', message: 'Your request has been sent.' };
  }

  const parsed = contactFormSchema.safeParse(raw);
  const fields = {
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phone: raw.phone,
    zip: raw.zip,
    project: raw.project,
    howDidYouHear: raw.howDidYouHear,
  };

  if (!parsed.success) {
    const errors: FormState['errors'] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactFields;
      errors[key] ??= issue.message;
    }
    return { status: 'error', message: 'Please check the highlighted fields.', fields, errors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set — cannot send estimate request email.');
    return {
      status: 'error',
      message: 'We couldn’t send your request right now. Please call or email us directly.',
      fields,
    };
  }

  const data = parsed.data;
  const submittedAt = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Chicago',
  }).format(new Date());

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: data.email,
      subject: estimateRequestSubject(data),
      html: estimateRequestHtml(data, submittedAt),
      text: estimateRequestText(data, submittedAt),
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        status: 'error',
        message: 'We couldn’t send your request right now. Please try again or call us directly.',
        fields,
      };
    }

    return { status: 'success', message: 'Your request has been sent.' };
  } catch (err) {
    console.error('Estimate request email failed:', err);
    return {
      status: 'error',
      message: 'We couldn’t send your request right now. Please try again or call us directly.',
      fields,
    };
  }
}
