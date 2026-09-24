'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { handleContactFormSubmission, type FormState } from '@/app/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowSwap, arrowButtonClass } from '@/components/arrow-button';
import { ease } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';

const initialState: FormState = { status: 'idle', message: '' };

const controlClass =
  'block w-full rounded-sm border border-input bg-background px-4 text-[0.95rem] text-foreground transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/40 focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-0 aria-[invalid=true]:border-primary';

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="flex items-center gap-1.5 text-sm text-primary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <AlertCircle className="size-3.5 shrink-0" aria-hidden />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={arrowButtonClass('primary', 'w-full sm:w-auto sm:min-w-[220px]')}>
      <span>{pending ? 'Sending…' : 'REQUEST NOW'}</span>
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ArrowSwap />}
    </button>
  );
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      className="flex min-h-[420px] flex-col items-start justify-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      role="status"
    >
      <svg viewBox="0 0 52 52" className="size-14" aria-hidden>
        <motion.circle
          cx="26" cy="26" r="24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease }}
        />
        <motion.path
          d="M15 27l7 7 15-16" fill="none" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="square"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease, delay: 0.55 }}
        />
      </svg>
      <h3 className="mt-8 text-3xl font-semibold">Thank You!</h3>
      <p className="mt-3 max-w-sm text-muted-foreground">
        Your request has been sent successfully. We will contact you soon.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 text-sm font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-primary"
      >
        Send another request
      </button>
    </motion.div>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(handleContactFormSubmission, initialState);
  const [dismissedSuccess, setDismissedSuccess] = useState<FormState | null>(null);
  const f = state.fields ?? {};
  const err = state.errors ?? {};

  const aria = (name: keyof NonNullable<FormState['errors']>) => ({
    'aria-invalid': err[name] ? true : undefined,
    'aria-describedby': err[name] ? `${name}-error` : undefined,
  });

  if (state.status === 'success' && dismissedSuccess !== state) {
    return <SuccessMessage onReset={() => setDismissedSuccess(state)} />;
  }

  return (
    <form key={JSON.stringify(state)} action={formAction} noValidate>
      <p className="eyebrow">Free estimate</p>
      <h3 className="mt-3 text-3xl font-semibold">Request Your Free Estimate</h3>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label="First Name *" error={err.firstName}>
          <input id="firstName" name="firstName" autoComplete="given-name" defaultValue={f.firstName} className={cn(controlClass, 'h-12')} {...aria('firstName')} />
        </Field>
        <Field id="lastName" label="Last Name *" error={err.lastName}>
          <input id="lastName" name="lastName" autoComplete="family-name" defaultValue={f.lastName} className={cn(controlClass, 'h-12')} {...aria('lastName')} />
        </Field>
        <Field id="email" label="Email Address *" error={err.email}>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={f.email} className={cn(controlClass, 'h-12')} {...aria('email')} />
        </Field>
        <Field id="phone" label="Phone Number *" error={err.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={f.phone} className={cn(controlClass, 'h-12')} {...aria('phone')} />
        </Field>
        <Field id="zip" label="Zip Code *" error={err.zip}>
          <input id="zip" name="zip" inputMode="numeric" autoComplete="postal-code" defaultValue={f.zip} className={cn(controlClass, 'h-12')} {...aria('zip')} />
        </Field>
        <Field id="howDidYouHear" label="How Did You Hear About Us?">
          <Select name="howDidYouHear" defaultValue={f.howDidYouHear || undefined}>
            <SelectTrigger id="howDidYouHear" className={cn(controlClass, 'flex h-12 items-center justify-between text-left ring-offset-0 focus:ring-0 focus:ring-offset-0 data-[placeholder]:text-muted-foreground/70')}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="yard-sign">Yard Sign</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field id="project" label="Tell us about your project... *" error={err.project} className="sm:col-span-2">
          <textarea id="project" name="project" rows={5} defaultValue={f.project} className={cn(controlClass, 'min-h-[140px] resize-y py-3')} {...aria('project')} />
        </Field>
      </div>

      {/* Honeypot for bots — hidden from people and assistive tech. */}
      <div aria-hidden className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 flex flex-col gap-5 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs text-muted-foreground">
          By submitting this form, you agree to our{' '}
          <Link href="#" className="underline underline-offset-2 hover:text-foreground">Terms of Service</Link> and{' '}
          <Link href="#" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</Link>.
        </p>
        <SubmitButton />
      </div>

      {state.status === 'error' && (
        <p role="alert" className="mt-5 flex items-center gap-2 text-sm text-primary">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {state.message}
        </p>
      )}
    </form>
  );
}
