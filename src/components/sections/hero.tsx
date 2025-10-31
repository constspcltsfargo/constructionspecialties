"use client";
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
    const heroImage1 = PlaceHolderImages.find(img => img.id === 'hero-image-1');
    const heroImage2 = PlaceHolderImages.find(img => img.id === 'hero-image-2');
    const clientLogo1 = PlaceHolderImages.find(img => img.id === 'client-logo-1');
    const clientLogo2 = PlaceHolderImages.find(img => img.id === 'client-logo-2');
    const clientLogo3 = PlaceHolderImages.find(img => img.id === 'client-logo-3');
    const clientLogo4 = PlaceHolderImages.find(img => img.id === 'client-logo-4');

    return (
        <section className="py-4 mt-14 sm:mt-16 lg:mt-0">
            <div className="mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 grid lg:grid-cols-2 lg:items-center gap-10">
                <div className="flex flex-col space-y-8 sm:space-y-10 lg:items-center text-center lg:text-left max-w-2xl md:max-w-3xl mx-auto">
                    <h1 className=" font-semibold leading-tight text-teal-950 dark:text-white text-4xl sm:text-5xl lg:text-6xl">
                        We'll be happy to take care of <span className="text-transparent bg-clip-text bg-gradient-to-tr from-pink-700 to-orange-800">your work.</span>
                    </h1>
                    <p className=" flex text-gray-700 dark:text-gray-300 tracking-tight md:font-normal max-w-xl mx-auto lg:max-w-none">
                        Quality you can trust, service you can count on. We are dedicated to providing the highest quality of workmanship and customer service.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                        <Link href="#contact" className="px-6 items-center h-12 rounded-3xl bg-pink-600 text-white duration-300 ease-linear flex justify-center w-full sm:w-auto">
                            Get started
                        </Link>
                        <Link href="#contact" className="px-6 items-center h-12 rounded-3xl text-pink-700 border border-gray-100 dark:border-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900 duration-300 ease-linear flex justify-center w-full sm:w-auto">
                            Get a Free Estimate
                        </Link>
                    </div>
                    <div className="mt-5 flex items-center justify-center flex-wrap gap-4 lg:justify-start w-full">
                        {clientLogo1 && <Image width={100} height={40} src={clientLogo1.imageUrl} alt="client logo 1" className="h-10 w-auto dark:grayscale" data-ai-hint={clientLogo1.imageHint} />}
                        {clientLogo2 && <Image width={100} height={40} src={clientLogo2.imageUrl} alt="client logo 2" className="h-10 w-auto dark:grayscale" data-ai-hint={clientLogo2.imageHint} />}
                        {clientLogo3 && <Image width={100} height={40} src={clientLogo3.imageUrl} alt="client logo 3" className="h-10 w-auto dark:grayscale" data-ai-hint={clientLogo3.imageHint} />}
                        {clientLogo4 && <Image width={100} height={40} src={clientLogo4.imageUrl} alt="client logo 4" className="h-10 w-auto dark:grayscale" dataai-hint={clientLogo4.imageHint} />}
                    </div>
                </div>
                <div className="flex aspect-square lg:aspect-auto lg:h-[35rem] relative">
                    <div className="w-3/5 h-[80%] rounded-3xl overflow-clip border-8 border-gray-200 dark:border-gray-950 z-30">
                        {heroImage1 && <Image src={heroImage1.imageUrl} alt={heroImage1.description} width={1300} height={1300} className="w-full h-full object-cover z-30" data-ai-hint={heroImage1.imageHint} />}
                    </div>
                    <div className="absolute right-0 bottom-0 h-[calc(100%-50px)] w-4/5 rounded-3xl overflow-clip border-4 border-gray-200 dark:border-gray-800 z-10">
                        {heroImage2 && <Image src={heroImage2.imageUrl} alt={heroImage2.description} height={1300} width={1300} className="z-10 w-full h-full object-cover" data-ai-hint={heroImage2.imageHint} />}
                    </div>
                </div>
            </div>
        </section>
    );
}
