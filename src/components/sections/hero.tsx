"use client";
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ContactForm } from '@/components/contact-form';

export function Hero() {
    const heroImage1 = PlaceHolderImages.find(img => img.id === 'hero-image-1');
    const heroImage2 = PlaceHolderImages.find(img => img.id === 'hero-image-2');
    const clientLogo1 = PlaceHolderImages.find(img => img.id === 'client-logo-1');
    const clientLogo2 = PlaceHolderImages.find(img => img.id === 'client-logo-2');
    const clientLogo3 = PlaceHolderImages.find(img => img.id === 'client-logo-3');
    const clientLogo4 = PlaceHolderImages.find(img => img.id === 'client-logo-4');

    return (
        <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            <div className="relative mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 grid lg:grid-cols-2 lg:items-center gap-10 z-10">
                <div className="flex flex-col space-y-8 sm:space-y-10 text-center lg:text-left">
                    <h1 className="font-semibold leading-tight text-white text-4xl sm:text-5xl lg:text-6xl">
                        Your Trusted Orlando Roofing Company
                    </h1>
                    <p className="text-gray-200 tracking-tight md:font-normal max-w-xl mx-auto lg:max-w-none">
                        Providing quality roof services to Central Florida homeowners and businesses since 2003.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                        <Link href="#contact" className="px-8 py-3 items-center h-12 rounded-md bg-red-600 text-white duration-300 ease-linear flex justify-center w-full sm:w-auto text-lg font-bold">
                            GET A FREE ESTIMATE
                        </Link>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <ContactForm />
                </div>
            </div>
        </section>
    );
}
