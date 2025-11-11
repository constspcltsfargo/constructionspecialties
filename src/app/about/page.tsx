
'use client';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PageHeader = () => (
  <section className="py-12 md:py-24 bg-secondary text-center">
    <div className="container">
      <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
      <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
        Learn more about our company, our mission, and the dedicated team behind our success.
      </p>
    </div>
  </section>
);

const OurStory = () => {
    return(
        <section className="relative py-12 md:py-24 lg:py-32">
             <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1512434227999-0cf72464f7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyb29mJTIwY29uc3RydWN0aW9ufGVufDB8fHx8MTc2MjExNDgwMnww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Roof construction background"
                    fill
                    className="object-cover"
                    data-ai-hint="roof construction"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="container relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div className="lg:col-start-2">
                         <Card className="bg-background/90 backdrop-blur-sm p-6 lg:p-8 shadow-2xl rounded-xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Our Story</h2>
                            <div className="flex justify-center mb-6">
                                <Image
                                    src="https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/mule-hide%20(2).jpg?alt=media&token=a0b27fab-4727-4f25-a073-1e9b7e83c05c"
                                    alt="Mule-Hide certified installer logo"
                                    width={150}
                                    height={150}
                                    className="object-contain rounded-full bg-white p-2 shadow-md"
                                    data-ai-hint="company logo"
                                />
                            </div>
                            <p className="text-muted-foreground text-base md:text-lg space-y-4">
                                Construction Specialties LLC Roofing Professionals is a trusted and experienced roofing contractor with over 20 years of dedicated service in ND, SD, and MN. Our commitment to quality craftsmanship and customer satisfaction sets us apart. We take pride in offering professional roofing services for commercial, residential, agricultural, and industrial properties. Our expertise includes repairs, maintenance, and retrofits. As a certified Mule Hide installer, we ensure high-quality materials backed by full manufacturer warranty. Our specialization in flat and EPDM (rubber) roofing, metal roofing, sheet metal fabrication, storm damage, and seamless gutters makes us a reliable choice for all roofing needs. At Construction Specialties LLC, we are dedicated to providing free estimates and delivering exceptional results.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
};

const OurMission = () => (
  <section className="py-12 md:py-24 bg-secondary">
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg lg:order-last">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBwbGFuc3xlbnwwfHx8fDE3NjE5Mjk0ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Blueprint and construction tools"
            fill
            className="object-cover"
            data-ai-hint="construction plans"
          />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission & Values</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Our mission is to deliver superior roofing and construction solutions through quality materials, expert workmanship, and a customer-first approach. We are guided by our core values:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold">Quality</h4>
                <p className="text-muted-foreground">Using only the best materials and certified installers to ensure your project stands the test of time.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold">Integrity</h4>
                <p className="text-muted-foreground">Operating with honesty and transparency in every interaction, from the initial estimate to the final inspection.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold">Customer Satisfaction</h4>
                <p className="text-muted-foreground">Ensuring you are completely satisfied with our work is our top priority. We're not happy until you are.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Founder & CEO',
    avatarId: 'team-member-1',
  },
  {
    name: 'Jane Smith',
    role: 'Head of Operations',
    avatarId: 'team-member-2',
  },
  {
    name: 'Mike Johnson',
    role: 'Lead Project Manager',
    avatarId: 'team-member-3',
  },
   {
    name: 'Emily Davis',
    role: 'Customer Relations',
    avatarId: 'team-member-4',
  },
];

const MeetTheTeam = () => (
  <section className="py-12 md:py-24">
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Meet the Team</h2>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          The passionate professionals dedicated to bringing your vision to life.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => {
          const avatar = PlaceHolderImages.find((img) => img.id === member.avatarId);
          return (
            <Card key={member.name} className="text-center">
              <CardContent className="p-6">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  {avatar && <AvatarImage src={avatar.imageUrl} alt={member.name} data-ai-hint={avatar.imageHint} />}
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </section>
);


export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PageHeader />
        <OurStory />
        <OurMission />
        <MeetTheTeam />
      </main>
      <Footer />
    </div>
  );
}
