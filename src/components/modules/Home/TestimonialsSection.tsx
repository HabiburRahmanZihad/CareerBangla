import SectionHeader from "@/components/modules/Home/SectionHeader";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        name: "Rahim Uddin",
        role: "Software Engineer",
        company: "BRAC IT Services",
        text: "CareerBangla helped me land my first tech job in just 2 weeks. The ATS resume builder was a complete game-changer for breaking into the industry.",
        portrait: "men/32",
        rating: 5,
    },
    {
        name: "Fariha Islam",
        role: "Marketing Manager",
        company: "Shohoz",
        text: "The smart matching system showed me jobs I would never have found on my own. Got 3 interview calls in a single week, absolutely brilliant.",
        portrait: "women/44",
        rating: 5,
    },
    {
        name: "Tanvir Ahmed",
        role: "Product Designer",
        company: "Pathao",
        text: "Switched careers entirely through CareerBangla. The verified recruiter network means zero spam, only quality opportunities from day one.",
        portrait: "men/68",
        rating: 5,
    },
];

export default function TestimonialsSection() {
    return (
        <section className="bg-background py-16 md:py-24">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    tag="Success Stories"
                    title="Real People. Real Results."
                    description="Thousands of professionals across Bangladesh found their dream jobs through CareerBangla."
                    center
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.name}
                            className="flex flex-col rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-lg"
                        >
                            <div className="mb-4 flex items-center gap-0.5">
                                {Array.from({ length: testimonial.rating }).map((_, index) => (
                                    <Star
                                        key={index}
                                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                                <Image
                                    src={`https://randomuser.me/api/portraits/${testimonial.portrait}.jpg`}
                                    alt={testimonial.name}
                                    width={40}
                                    height={40}
                                    className="shrink-0 rounded-full border-2 border-border/50 object-cover"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {testimonial.role} · {testimonial.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
