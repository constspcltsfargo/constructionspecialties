import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const blogPosts = [
  {
    title: "5 Signs Your Roof Needs a Replacement",
    category: "Roofing 101",
    date: "October 26, 2023",
    imageId: "blog-post-1",
    excerpt: "Don't wait for a leak to become a disaster. Learn the top 5 signs that your roof is due for a replacement and how to act fast.",
  },
  {
    title: "The Ultimate Guide to Choosing Siding",
    category: "Home Improvement",
    date: "October 15, 2023",
    imageId: "blog-post-2",
    excerpt: "Vinyl, wood, or fiber cement? This guide breaks down the pros and cons of different siding materials to help you decide.",
  },
  {
    title: "Why Gutter Maintenance is Non-Negotiable",
    category: "Maintenance",
    date: "September 28, 2023",
    imageId: "blog-post-3",
    excerpt: "Discover how regular gutter cleaning can save you thousands in repairs and protect your home's foundation.",
  },
];

export function Blog() {
  return (
    <section id="blog" className="py-12 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">From Our Blog</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Stay informed with our latest articles, tips, and industry news.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => {
            const image = PlaceHolderImages.find((img) => img.id === post.imageId);
            return (
              <Card key={index} className="overflow-hidden flex flex-col">
                <CardHeader className="p-0">
                  {image && (
                    <Link href="#" className="block">
                      <Image
                        src={image.imageUrl}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="object-cover aspect-[3/2] w-full"
                        data-ai-hint={image.imageHint}
                      />
                    </Link>
                  )}
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                    <h3 className="text-xl font-semibold mb-2">
                      <Link href="#" className="hover:text-primary transition-colors">{post.title}</Link>
                    </h3>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  </div>
                  <div className="mt-4">
                     <Button variant="link" className="p-0 h-auto" asChild>
                       <Link href="#">Read More →</Link>
                     </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
