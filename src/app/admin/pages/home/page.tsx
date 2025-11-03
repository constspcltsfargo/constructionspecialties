
'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Trash2 } from 'lucide-react';

const homepageContentSchema = z.object({
    hero: z.object({
        title: z.string().min(1, 'Title is required'),
        subtitle: z.string().min(1, 'Subtitle is required'),
    }),
    whyUs: z.object({
        title: z.string().min(1, 'Title is required'),
        subtitle: z.string().min(1, 'Subtitle is required'),
        features: z.array(z.string().min(1, "Feature cannot be empty")).min(1, "At least one feature is required"),
    }),
});

type HomepageContentFormValues = z.infer<typeof homepageContentSchema>;

const defaultValues: HomepageContentFormValues = {
    hero: {
      title: "Your Trusted Orlando <span class=\"text-transparent bg-clip-text bg-gradient-to-tr from-pink-700 to-orange-800\">Roofing Company.</span>",
      subtitle: "Providing quality roof services to Central Florida homeowners and businesses since 2003. We are a local, family-owned roofing company dedicated to providing our customers with the best roofing services possible."
    },
    whyUs: {
        title: "Why Choose Us for Your Next Project?",
        subtitle: "We are a local, family-owned roofing company that has been serving Central Florida since 2003. We are dedicated to providing our customers with the best roofing services possible.",
        features: [
            "20+ Years of Experience",
            "Licensed & Insured",
            "Financing Available",
            "Locally Owned & Operated",
            "Certified Installers",
            "Quality Materials",
        ]
    }
};

export default function EditHomepage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const homepageRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'pages', 'home');
  }, [firestore]);

  const { data: pageData, isLoading: isPageLoading } = useDoc<HomepageContentFormValues>(homepageRef);

  const form = useForm<HomepageContentFormValues>({
    resolver: zodResolver(homepageContentSchema),
    defaultValues: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "whyUs.features",
  });


  useEffect(() => {
    if (pageData) {
      form.reset(pageData);
    } else if (!isPageLoading && homepageRef) {
      // Seed the database with default content if it doesn't exist
      setDoc(homepageRef, { ...defaultValues, lastUpdated: serverTimestamp() });
    }
  }, [pageData, isPageLoading, form, homepageRef]);

  const onSubmit = async (values: HomepageContentFormValues) => {
    if (!homepageRef) return;
    try {
      await setDoc(homepageRef, {
        ...values,
        lastUpdated: serverTimestamp(),
      }, { merge: true });
      toast({
        title: 'Success!',
        description: 'Homepage content updated successfully.',
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating homepage",
        description: error.message,
      });
    }
  };

  if (isPageLoading || !form.formState.isDirty && !pageData) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
                <div className="space-y-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
                 <div className="space-y-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-12 w-32" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Homepage Content</CardTitle>
        <CardDescription>Make changes to your homepage sections here. Click save when you're done.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Hero Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Hero Section</h3>
                <FormField
                control={form.control}
                name="hero.title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title (HTML enabled)</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter hero title" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="hero.subtitle"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Enter hero subtitle" {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            {/* Why Us Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Why Us Section</h3>
                <FormField
                control={form.control}
                name="whyUs.title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Why Us title" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="whyUs.subtitle"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Enter Why Us subtitle" {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="space-y-2">
                    <FormLabel>Features</FormLabel>
                    {fields.map((field, index) => (
                        <FormField
                        key={field.id}
                        control={form.control}
                        name={`whyUs.features.${index}`}
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                     <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    ))}
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append("")}
                        className="mt-2"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Feature
                    </Button>
                </div>
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
