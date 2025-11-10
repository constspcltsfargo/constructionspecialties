
"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { handleContactFormSubmission, type FormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const initialState: FormState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Submitting..." : "REQUEST NOW"}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(handleContactFormSubmission, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.message.startsWith("Error:")) {
        toast({
          title: "Error",
          description: state.issues ? state.issues.join(", ") : "An unexpected error occurred.",
          variant: "destructive",
        });
      } else if (state.message.startsWith("Success")) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  if (state.message.startsWith("Success")) {
    return (
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-green-50 border border-green-200 text-green-900">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold">Thank You!</h3>
            <p className="text-sm mt-2">
              Your request has been sent successfully. We will contact you soon.
            </p>
          </div>
        </CardContent>
    )
  }
  
  return (
        <form ref={formRef} action={formAction}>
          <CardHeader className="text-center p-0 mb-6">
            <CardTitle className="text-2xl font-bold">
              Request Your Free Estimate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-0">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" defaultValue={state.fields?.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" defaultValue={state.fields?.lastName} />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" name="email" type="email" defaultValue={state.fields?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" defaultValue={state.fields?.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">Zip Code *</Label>
              <Input id="zip" name="zip" defaultValue={state.fields?.zip} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Tell us about your project...*</Label>
              <Textarea id="project" name="project" className="min-h-[100px]" defaultValue={state.fields?.project} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="howDidYouHear">How Did You Hear About Us?</Label>
                <Select name="howDidYouHear" defaultValue={state.fields?.howDidYouHear}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="yard-sign">Yard Sign</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              By submitting this form, you agree to our <Link href="#" className="underline hover:text-primary">Terms of Service</Link> and <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-start p-0 mt-6">
            <SubmitButton />
            {state.message.startsWith("Error:") && state.issues && (
              <div className="mt-4 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p>{state.issues.join(", ")}</p>
              </div>
            )}
          </CardFooter>
        </form>
  );
}
