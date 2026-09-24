import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import Categories from "../components/Categories";
import ProductsSection from "../components/ProductsSection";
import Trust from "../components/Trust";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import ProductModal from "../components/ProductModal";
import CatBanner from "../components/CategoryBanner";
import PreorderSection from "../components/PreorderSection";
import NoxCollectionVideo from "../components/NoxCollectionVideo";
import NoxLaunchPopup from "../components/NoxLaunchPopup";
import { getNox2027Campaign, type SiteCampaignConfig } from "../lib/siteCampaignService";
import { Product, Category } from "../data/products";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [noxCampaign, setNoxCampaign] = useState<SiteCampaignConfig | null>(null);

  useEffect(() => {
    let mounted = true;
    getNox2027Campaign()
      .then((config) => mounted && setNoxCampaign(config))
      .catch((error) => console.error("No se pudo cargar la campaña NOX 2027:", error));
    return () => { mounted = false; };
  }, []);

  const navigate = useNavigate();
 const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

const [searchQuery, setSearchQuery] = useState("");

const [selectedBrand, setSelectedBrand] = useState<string>("");
  const scrollToProducts = (brand?: string) => {
  if (brand) {
    navigate(`/palas?brand=${encodeURIComponent(brand)}`);
    return;
  }

  document
    .getElementById("productos")
    ?.scrollIntoView({ behavior: "smooth" });
};
  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === "ofertas") {
      setSelectedCategory(null);
      setTimeout(scrollToProducts, 80);
      return;
    }
    setSelectedCategory(categoryId as Category);
    setTimeout(scrollToProducts, 80);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      {noxCampaign?.is_active && noxCampaign.show_popup && <NoxLaunchPopup />}
      <Header onSearch={setSearchQuery} />
      <Hero onShopNow={scrollToProducts} />
      <Benefits />
      <Categories onSelect={handleCategorySelect} />
      {noxCampaign?.is_active && noxCampaign.show_home_video && <NoxCollectionVideo />}
      <PreorderSection onViewDetail={setSelectedProduct} />
      <ProductsSection
        onViewDetail={setSelectedProduct}
        initialCategory={selectedCategory}
        searchQuery={searchQuery}
        selectedBrand={selectedBrand}
      />
      <CatBanner onViewDetail={setSelectedProduct} />
      <Trust />
      <Contact />
      <Footer />
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
