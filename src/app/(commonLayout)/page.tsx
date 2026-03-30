import AppDownloadSection from "@/components/modules/Home/AppDownloadSection";
import CtaSection from "@/components/modules/Home/CtaSection";
import CvBannerSection from "@/components/modules/Home/CvBannerSection";
import EmployerCandidateBanner from "@/components/modules/Home/EmployerCandidateBanner";
import HeroSection from "@/components/modules/Home/HeroSection";
import HowItWorksSection from "@/components/modules/Home/HowItWorksSection";
import KeyHighlightsSection from "@/components/modules/Home/KeyHighlightsSection";
import PlatformFeaturesSection from "@/components/modules/Home/PlatformFeaturesSection";
import TestimonialsSection from "@/components/modules/Home/TestimonialsSection";
import TopCategoriesSection from "@/components/modules/Home/TopCategoriesSection";
import WhyChooseSection from "@/components/modules/Home/WhyChooseSection";

export default function Home() {
    return (
        <div className="overflow-x-hidden">
            <HeroSection />
            <HowItWorksSection />
            <WhyChooseSection />
            <PlatformFeaturesSection />
            <KeyHighlightsSection />
            <TestimonialsSection />
            <TopCategoriesSection />
            <CvBannerSection />
            <EmployerCandidateBanner />
            <AppDownloadSection />
            <CtaSection />
        </div>
    );
}
