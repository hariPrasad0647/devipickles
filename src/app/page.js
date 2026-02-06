import HeroSection from "./components/Herosection";
import Navbar from "./components/Navbar";
import TodaySpecialOffers from "./components/Offers";
import IngredientsSection from "./components/Ingredients";
import AboutSection from "./components/AboutUs";
import FAQSection from "./components/FAQSection";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar/>
      <HeroSection />
      <TodaySpecialOffers/>
      <IngredientsSection/>
      <AboutSection/>
      <WhyChooseUs/>
      <FAQSection/>
      <Footer/>
    </main>
  );
}