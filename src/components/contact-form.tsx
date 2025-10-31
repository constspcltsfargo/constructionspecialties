"use client";

import { useFormState, useFormStatus } from "react-dom";
import { handleContactFormSubmission, type FormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const initialState: FormState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Analyzing..." : "Send Message"}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(handleContactFormSubmission, initialState);
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
      } else {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <Card>
      {state.message.startsWith("Success") && state.data ? (
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-green-50 border border-green-200">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-800">Message Sent & Analyzed!</h3>
            <p className="text-sm text-green-700 mt-2">
              {state.data.summary}
            </p>
            <div className="text-left w-full mt-4 text-sm space-y-2">
                <p><strong>Suggested Team:</strong> <span className="font-mono p-1 bg-green-100 rounded text-green-900">{state.data.suggestedTeam}</span></p>
                {state.data.nearbyBranches && state.data.nearbyBranches.length > 0 && (
                     <p><strong>Nearby Branches:</strong> {state.data.nearbyBranches.join(', ')}</p>
                )}
            </div>
          </div>
        </CardContent>
      ) : (
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>We'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your Name" defaultValue={state.fields?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" defaultValue={state.fields?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" name="location" placeholder="Your City, State" defaultValue={state.fields?.location} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="How can we help you today?" className="min-h-[120px]" defaultValue={state.fields?.message} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <SubmitButton />
            {state.message.startsWith("Error:") && state.issues && (
              <div className="mt-4 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p>{state.issues.join(", ")}</p>
              </div>
            )}
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
