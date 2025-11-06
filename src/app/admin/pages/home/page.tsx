
'use client';

import { useEffect, useRef } from 'react';
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

const imageSchema = z.object({
    id: z.string(),
    url: z.string().url('Must be a valid URL'),
    alt: z.string().min(1, 'Alt text is required'),
});

// Defines the schema for a single page element's content
const heroSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    images: z.array(imageSchema),
});

// A "discriminated union" to validate content based on the element type
const elementContentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal('hero'), content: heroSchema }),
  z.object({ type: z.literal('services'), content: z.object({}) }),
  z.object({ type: z.literal('gallery'), content: z.object({}) }),
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
    { id: 'hero', type: 'hero', order: 1, content: {
        title: "Your Trusted Orlando <span class=\"text-transparent bg-clip-text bg-gradient-to-tr from-pink-700 to-orange-800\">Roofing Company.</span>",
        subtitle: "Providing quality roof services to Central Florida homeowners and businesses since 2003. We are a local, family-owned roofing company dedicated to providing our customers with the best roofing services possible.",
        images: [
            { id: 'hero-1', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FAnnex%20IMG_20250630_122752.jpg?alt=media&token=8b921d83-feb4-484f-bf8e-deb54d83444e', alt: 'Commercial building roofing project' },
            { id: 'hero-2', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FBig%20O%202%2020250629_173800_edited.jpg?alt=media&token=79cd26e1-ac45-4d11-9ed8-a296f0605ab4', alt: 'Big O Tires commercial roofing' },
            { id: 'hero-3', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FBismarck%20School%2020250629_144239.jpg?alt=media&token=5f563a8e-87be-4e19-96de-ff77617b4fac', alt: 'Bismarck School roofing project' },
            { id: 'hero-4', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FMSU%20Summer%2020250629_182401.jpg?alt=media&token=230268e8-27f7-4dd7-b15b-f54c13d7ba35', alt: 'MSU building roofing in summer' },
            { id: 'hero-5', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FMinot%20DOT%202%2020250629_174127.jpg?alt=media&token=226d6f49-7a9f-47f3-aa3a-6a545fe3f330', alt: 'Minot DOT building roofing project' },
            { id: 'hero-6', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FRPZ%20Tiger%2020250630_124936.jpg?alt=media&token=6ba8f8e2-2fbc-4eb1-a302-7ff7d365fe94', alt: 'RPZ Tiger commercial roofing' },
            { id: 'hero-7', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2FStarbucks%202%2020250629_184237.jpg?alt=media&token=2a8e0bf2-a1b0-41b3-96a8-ac2ddc2790f9', alt: 'Starbucks commercial roofing' },
            { id: 'hero-8', url: 'https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/Slider%20Images%2Fbottineau-county-sheriffs-office.jpg?alt=media&token=af5da1dc-8a4b-4134-a5b6-0bf733399cfc', alt: 'Bottineau County Sheriffs Office roofing' },
        ]
    }},
    { id: 'services', type: 'services', order: 2, content: {} },
    { id: 'gallery', type: 'gallery', order: 3, content: {} },
    { id: 'cta', type: 'cta', order: 4, content: {} },
    { id: 'contact', type: 'contact', order: 5, content: {} },
];


const HeroForm = ({ index, control }: { index: number, control: Control<PageElementsFormValues> }) => {
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: `elements.${index}.content.images`,
    });
    
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDragEnd = () => {
        if (dragItem.current !== null && dragOverItem.current !== null) {
            move(dragItem.current, dragOverItem.current);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };


    return (
    <>
        <FormField control={control} name={`elements.${index}.content.title`} render={({ field }) => (
            <FormItem><FormLabel>Title (HTML)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name={`elements.${index}.content.subtitle`} render={({ field }) => (
            <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="space-y-4 pt-4">
            <FormLabel>Hero Images</FormLabel>
            {fields.map((imageField, imageIndex) => (
                <Card
                    key={imageField.id}
                    className="p-4 space-y-2 relative"
                    draggable
                    onDragStart={() => (dragItem.current = imageIndex)}
                    onDragEnter={() => (dragOverItem.current = imageIndex)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <GripVertical className="h-5 w-5 text-muted-foreground absolute top-2 left-2 cursor-grab" />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => remove(imageIndex)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <FormField control={control} name={`elements.${index}.content.images.${imageIndex}.url`} render={({ field }) => (
                        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name={`elements.${index}.content.images.${imageIndex}.alt`} render={({ field }) => (
                        <FormItem><FormLabel>Alt Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </Card>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ id: `hero-${Date.now()}`, url: '', alt: '' })}
            >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Image
            </Button>
        </div>
    </>
)};

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
        batch.set(pageRef, { title: "Homepage" }, { merge: true });

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
      await setDoc(doc(firestore, 'pages', 'home'), { }, { merge: true });
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

    