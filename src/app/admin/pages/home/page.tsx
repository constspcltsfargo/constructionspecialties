
'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, writeBatch, doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { GripVertical, PlusCircle, Trash2 } from 'lucide-react';

// Defines the schema for a single page element's content
const heroSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
});

const whyUsSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    features: z.array(z.string().min(1, "Feature cannot be empty")).min(1, "At least one feature is required"),
});

// A "discriminated union" to validate content based on the element type
const elementContentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal('hero'), content: heroSchema }),
  z.object({ type: z.literal('why-us'), content: whyUsSchema }),
  z.object({ type: z.literal('services'), content: z.object({}) }),
  z.object({ type: z.literal('gallery'), content: z.object({}) }),
  z.object({ type: z.literal('testimonials'), content: z.object({}) }),
  z.object({ type: z.literal('faq'), content: z.object({}) }),
  z.object({ type: z.literal('cta'), content: z.object({}) }),
  z.object({ type: z.literal('contact'), content: z.object({}) }),
]);

// Main form schema for an array of page elements
const pageElementsSchema = z.object({
  elements: z.array(z.object({
    id: z.string(),
    type: z.string(),
    order: z.number(),
    content: z.any(), // Use 'any' for the array, but validate individuals with the union
  })),
});

type PageElementsFormValues = z.infer<typeof pageElementsSchema>;

// Default content for seeding the database
const defaultElements = [
    { id: 'hero', type: 'hero', order: 1, content: { title: "Your Trusted Orlando <span class=\"text-transparent bg-clip-text bg-gradient-to-tr from-pink-700 to-orange-800\">Roofing Company.</span>", subtitle: "Providing quality roof services to Central Florida homeowners and businesses since 2003. We are a local, family-owned roofing company dedicated to providing our customers with the best roofing services possible." }},
    { id: 'services', type: 'services', order: 2, content: {} },
    { id: 'why-us', type: 'why-us', order: 3, content: { title: "Why Choose Us for Your Next Project?", subtitle: "We are a local, family-owned roofing company that has been serving Central Florida since 2003. We are dedicated to providing our customers with the best roofing services possible.", features: ["20+ Years of Experience", "Licensed & Insured", "Financing Available", "Locally Owned & Operated", "Certified Installers", "Quality Materials"] }},
    { id: 'gallery', type: 'gallery', order: 4, content: {} },
    { id: 'testimonials', type: 'testimonials', order: 5, content: {} },
    { id: 'faq', type: 'faq', order: 6, content: {} },
    { id: 'cta', type: 'cta', order: 7, content: {} },
    { id: 'contact', type: 'contact', order: 8, content: {} },
];


const HeroForm = ({ index, control }: { index: number, control: Control<PageElementsFormValues> }) => (
    <>
        <FormField control={control} name={`elements.${index}.content.title`} render={({ field }) => (
            <FormItem><FormLabel>Title (HTML)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name={`elements.${index}.content.subtitle`} render={({ field }) => (
            <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
    </>
);

const WhyUsForm = ({ index, control }: { index: number, control: Control<PageElementsFormValues> }) => {
    const { fields: featureFields, append, remove } = useFieldArray({
        control: control,
        name: `elements.${index}.content.features`
    });

    return (
        <>
            <FormField control={control} name={`elements.${index}.content.title`} render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name={`elements.${index}.content.subtitle`} render={({ field }) => (
                <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div>
                <FormLabel>Features</FormLabel>
                <div className="space-y-2 mt-2">
                    {featureFields.map((field, featureIndex) => (
                        <div key={field.id} className="flex items-center gap-2">
                             <FormField
                                control={control}
                                name={`elements.${index}.content.features.${featureIndex}`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(featureIndex)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                 <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append("")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Feature
                </Button>
            </div>
        </>
    );
};

export default function EditHomepage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const elementsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'pages', 'home', 'pageElements');
  }, [firestore]);

  const { data: pageElements, isLoading: isElementsLoading } = useCollection<any>(elementsRef);

  const form = useForm<PageElementsFormValues>({
    // No Zod resolver here, we validate on submit
    defaultValues: { elements: [] },
  });

  const { fields, move } = useFieldArray({
    control: form.control,
    name: "elements",
  });

  useEffect(() => {
    const seedDatabase = async () => {
        if (!firestore) return;
        const batch = writeBatch(firestore);
        const pageRef = doc(firestore, 'pages', 'home');
        batch.set(pageRef, { title: "Homepage", lastUpdated: serverTimestamp() }, { merge: true });

        defaultElements.forEach(element => {
            const elementRef = doc(firestore, 'pages', 'home', 'pageElements', element.id);
            batch.set(elementRef, {
                type: element.type,
                order: element.order,
                content: element.content
            });
        });
        await batch.commit();
        toast({ title: "Homepage seeded!", description: "Default content has been created." });
    };

    if (!isElementsLoading && (!pageElements || pageElements.length === 0)) {
        seedDatabase();
    }
    
    if (pageElements) {
      const sortedElements = [...pageElements].sort((a, b) => a.order - b.order);
      form.reset({ elements: sortedElements });
    }
  }, [pageElements, isElementsLoading, firestore, form, toast]);


  const onSubmit = async (values: PageElementsFormValues) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);

    for (let i = 0; i < values.elements.length; i++) {
        const element = values.elements[i];
        
        // Validate each element's content
        const validationInput = { type: element.type, content: element.content };
        const result = elementContentSchema.safeParse(validationInput);

        if (!result.success) {
            const issues = result.error.issues.map(issue => `Section '${element.type}': ${issue.path.slice(1).join('.')} - ${issue.message}`);
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: issues.join('\n'),
            });
            return; // Stop submission
        }

        const elementRef = doc(firestore, 'pages', 'home', 'pageElements', element.id);
        batch.update(elementRef, { 
            content: element.content,
            order: i + 1 // Re-assign order based on current array index
        });
    }

    try {
      await batch.commit();
      // Update the main page's timestamp
      await setDoc(doc(firestore, 'pages', 'home'), { lastUpdated: serverTimestamp() }, { merge: true });
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

  const renderElementForm = (element: Record<"id", string>, index: number) => {
    switch (element.type) {
      case 'hero':
        return <HeroForm index={index} control={form.control} />;
      case 'why-us':
        return <WhyUsForm index={index} control={form.control} />;
      default:
        return <p className="text-sm text-muted-foreground">This section has no editable content fields.</p>;
    }
  };
  
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      move(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };


  if (isElementsLoading || fields.length === 0) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-12 w-32" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Edit Homepage Sections</CardTitle>
                <CardDescription>Edit content for each section of your homepage. Drag to reorder.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            {fields.map((field, index) => (
                <Card 
                  key={field.id} 
                  className="p-4"
                  draggable
                  onDragStart={() => (dragItem.current = index)}
                  onDragEnter={() => (dragOverItem.current = index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                >
                    <div className="flex items-start gap-4">
                        <GripVertical className="h-8 w-8 text-muted-foreground mt-4 cursor-grab" />
                        <div className="flex-1 space-y-4">
                             <h3 className="text-lg font-semibold capitalize">{field.type.replace('-', ' ')}</h3>
                            {renderElementForm(field, index)}
                        </div>
                    </div>
                </Card>
            ))}
            </CardContent>
        </Card>

        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
