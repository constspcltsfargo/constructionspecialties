import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/page-header';
import { Cta } from '@/components/sections/cta';
import { ProjectGallery } from './project-gallery';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Completed commercial, education, public, residential and agricultural roofing projects by Construction Specialties LLC.',
};

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PageHeader
          eyebrow="Gallery"
          title="Our Gallery"
          description="Browse through our collection of completed projects. See the quality and craftsmanship we bring to every job."
        />
        <ProjectGallery />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
