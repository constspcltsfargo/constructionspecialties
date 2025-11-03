"use client";
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
    const heroImage1 = PlaceHolderImages.find(img => img.id === 'hero-image-1');
    const heroImage2 = PlaceHolderImages.find(img => img.id === 'hero-image-2');

    return (
        <section className="py-4 mt-14 sm:mt16 lg:mt-0">
            <div className="mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 grid lg:grid-cols-2 lg:items-center gap-10">
                <div className="flex flex-col space-y-8 sm:space-y-10 text-center lg:text-left">
                    <h1 className="font-semibold leading-tight text-teal-950 dark:text-white text-4xl sm:text-5xl lg:text-6xl">
                        Your Trusted Orlando <span className="text-transparent bg-clip-text bg-gradient-to-tr from-pink-700 to-orange-800">Roofing Company.</span>
                    </h1>
                    <p className="flex text-gray-700 dark:text-gray-300 tracking-tight md:font-normal max-w-xl mx-auto lg:max-w-none">
                        Providing quality roof services to Central Florida homeowners and businesses since 2003. We are a local, family-owned roofing company dedicated to providing our customers with the best roofing services possible.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                        <Link href="#contact" className="px-6 items-center h-12 rounded-3xl bg-pink-600 text-white duration-300 ease-linear flex justify-center w-full sm:w-auto">
                            Get a Free Estimate
                        </Link>
                        <Link href="#contact" className="px-6 items-center h-12 rounded-3xl text-pink-700 border border-gray-100 dark:border-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900 duration-300 ease-linear flex justify-center w-full sm:w-auto">
                            Schedule Inspection
                        </Link>
                    </div>
                </div>
                <div className="flex aspect-square lg:aspect-auto lg:h-[35rem] relative">
                    <div className="w-3/5 h-[80%] rounded-3xl overflow-clip border-8 border-gray-200 dark:border-gray-950 z-30">
                        {heroImage1 && <Image src={heroImage1.imageUrl} alt={heroImage1.description} data-ai-hint={heroImage1.imageHint} width={1300} height={1300} className="w-full h-full object-cover z-30" />}
                    </div>
                    <div className="absolute right-0 bottom-0 h-[calc(100%-50px)] w-4/5 rounded-3xl overflow-clip border-4 border-gray-200 dark:border-gray-800 z-10">
                        {heroImage2 && <Image src={heroImage2.imageUrl} alt={heroImage2.description} data-ai-hint={heroImage2.imageHint} height={1300} width={1300} className="z-10 w-full h-full object-cover" />}
                    </div>
                </div>
            </div>
        </section>
    );
}
