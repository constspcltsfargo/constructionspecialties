
"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef } from "react";
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
    <Button type="submit" className="w-full rounded-md bg-red-600 hover:bg-red-700 text-white font-bold" disabled={pending}>
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
      } else {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg text-white textured-background rounded-lg border-0">
      {state.message.startsWith("Success") && state.data ? (
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-green-50/90 border border-green-200 text-green-900">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold">Request Sent & Analyzed!</h3>
            <p className="text-sm mt-2">
              {state.data.summary}
            </p>
            <div className="text-left w-full mt-4 text-sm space-y-2">
                <p><strong>Suggested Team:</strong> <span className="font-mono p-1 bg-green-100 rounded">{state.data.suggestedTeam}</span></p>
                {state.data.nearbyBranches && state.data.nearbyBranches.length > 0 && (
                     <p><strong>Nearby Branches:</strong> {state.data.nearbyBranches.join(', ')}</p>
                )}
            </div>
          </div>
        </CardContent>
      ) : (
        <form ref={formRef} action={formAction}>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">
              Request Your<br />
              <span className="bg-red-600 text-white px-4 rounded-md inline-block mt-1">Free Estimate</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white/80">First Name *</Label>
                  <Input id="firstName" name="firstName" placeholder="" defaultValue={state.fields?.firstName} className="bg-white/90 text-gray-800 placeholder:text-gray-500 rounded-lg"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white/80">Last Name *</Label>
                  <Input id="lastName" name="lastName" placeholder="" defaultValue={state.fields?.lastName} className="bg-white/90 text-gray-800 placeholder:text-gray-500 rounded-lg"/>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email Address *</Label>
              <Input id="email" name="email" type="email" placeholder="" defaultValue={state.fields?.email} className="bg-white/90 text-gray-800 placeholder:text-gray-500 rounded-lg"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80">Phone Number *</Label>
              <Input id="phone" name="phone" placeholder="" defaultValue={state.fields?.phone} className="bg-white/90 text-gray-800 placeholder:text-gray-500 rounded-lg"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip" className="text-white/80">Zip Code *</Label>
              <Input id="zip" name="zip" placeholder="" defaultValue={state.fields?.zip} className="bg-white/90 text-gray-800 placeholder:text-gray-500 rounded-lg"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project" className="text-white/80">Tell us about your project...*</Label>
              <Textarea id="project" name="project" placeholder="" className="min-h-[100px] bg-white/90 text-gray-800 placeholder:text-gray-500 rounded-lg" defaultValue={state.fields?.project} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="howDidYouHear" className="text-white/80">How Did You Hear About Us?*</Label>
                <Select name="howDidYouHear">
                    <SelectTrigger className="w-full bg-white/90 text-gray-800 rounded-lg">
                        <SelectValue placeholder="" />
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
            <p className="text-xs text-white/70">
              By submitting this form, you agree to receive automated texts or calls from Houston Roofing & Construction. Msg & data rates may apply. Reply STOP to cancel. You also agree to the <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>. Consent is not a condition of purchase.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <SubmitButton />
            {state.message.startsWith("Error:") && state.issues && (
              <div className="mt-4 text-red-300 text-sm flex items-center gap-2">
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
