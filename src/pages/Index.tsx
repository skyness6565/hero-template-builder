import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import AchievementsSection from "@/components/AchievementsSection";
import InvestmentSection from "@/components/InvestmentSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <VideoSection />
    <AchievementsSection />
    <InvestmentSection />
    <FeaturesSection />
    <TestimonialsSection />
    <FAQSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
