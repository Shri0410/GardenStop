import React, { useState, useMemo } from 'react';
import { CategoryId } from './types';
import { FOOD_ITEMS, CATEGORIES } from './data/menuData';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { PromoHero } from './components/PromoHero';
import { SearchBar } from './components/SearchBar';
import { CategoryNav } from './components/CategoryNav';
import { FoodCard } from './components/FoodCard';
import { FloatingCartPill } from './components/FloatingCartPill';
import { CartDrawer } from './components/CartDrawer';
import { FoodDetailModal } from './components/FoodDetailModal';
import { CafeInfoModal } from './components/CafeInfoModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { CinematicLoadingScreen } from './components/CinematicLoadingScreen';
import { Sparkles, UtensilsCrossed } from 'lucide-react';

const MainMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: 0,
      burgers: 0,
      pizzas: 0,
      coffee: 0,
      starters: 0,
      desserts: 0,
    };

    FOOD_ITEMS.forEach(item => {
      if (vegOnly && !item.isVeg) return;
      counts.all++;
      if (item.category in counts) {
        counts[item.category as Exclude<CategoryId, 'all'>]++;
      }
    });

    return counts;
  }, [vegOnly]);

  // Filter food items
  const filteredItems = useMemo(() => {
    return FOOD_ITEMS.filter(item => {
      // Category check
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Veg check
      if (vegOnly && !item.isVeg) {
        return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(query));
        const matchesCat = item.category.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesTags || matchesCat;
      }

      return true;
    });
  }, [activeCategory, vegOnly, searchQuery]);

  return (
    <>
      {/* Cinematic Website Intro Loading Screen with Signature Logo Flight Transition */}
      <CinematicLoadingScreen websiteContentId="main-website-content" />

      {/* Main Website Container - Revealed smoothly by GSAP as the logo lands in the navbar */}
      <div
        id="main-website-content"
        className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col font-sans selection:bg-sage/20 selection:text-forest"
        style={{ opacity: 0 }}
      >
        {/* 1. Header with Live Status & Info Modal Trigger */}
        <Header />

      {/* Main Container: Mobile-first with graceful desktop scaling */}
      <main className="flex-1 w-full pb-20">
        
        {/* 2. Promotional Hero Banner (Clean auto-sliding Pizza, Burger & Fries banner) */}
        <PromoHero onSelectCategory={setActiveCategory} />

        {/* 3. Real-time Search & Dietary Filter */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          vegOnly={vegOnly}
          setVegOnly={setVegOnly}
          totalResults={filteredItems.length}
        />

        {/* 4. Horizontal Scrolling Category Pills */}
        <CategoryNav
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categoryCounts={categoryCounts}
        />

        {/* 5. Food Menu Grid */}
        <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6">
          
          {/* Section Title Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-forest font-serif font-bold text-lg sm:text-xl">
                {CATEGORIES.find(c => c.id === activeCategory)?.name || 'Menu'}
              </span>
              {vegOnly && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Veg Only
                </span>
              )}
            </div>

            <span className="text-xs text-stone-400 font-medium">
              Showing {filteredItems.length} delicacies
            </span>
          </div>

          {/* 2-Column Responsive Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4.5">
              {filteredItems.map(item => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            /* Empty Search or Filter State */
            <div className="py-16 px-4 text-center rounded-3xl bg-white border border-stone-100 shadow-sm my-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <UtensilsCrossed className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-800">
                No botanical dishes found
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
                We couldn't find any dishes matching "{searchQuery}". Try searching for burgers, sourdough pizzas, cold brew, or clear your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setVegOnly(false);
                  setActiveCategory('all');
                }}
                className="mt-4 px-5 py-2.5 rounded-2xl bg-forest hover:bg-forest-light text-white text-xs font-bold transition shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>

      </main>

      {/* 6. Footer */}
      <Footer />

    </div>

    {/* Top-level Overlays, Drawers & Modals (Outside transformed container for flawless viewport alignment) */}
    {/* 7. Floating Bottom Cart Pill */}
    <FloatingCartPill />

    {/* 8. Slide-up Interactive Bottom Sheet Cart Drawer */}
    <CartDrawer />

    {/* 9. Rich Food Item Detail Modal */}
    <FoodDetailModal />

    {/* 10. Cafe Info & Location Modal */}
    <CafeInfoModal />

    {/* 11. Order Success & WhatsApp Dispatch Modal */}
    <OrderSuccessModal />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <MainMenu />
    </CartProvider>
  );
};

export default App;
