import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Products from "../components/Products";
import { useGetCategoriesQuery } from "../../services/userProductsApi";
import { SearchContext } from "../store/context";

function AllProducts() {
  const [filters, setFilters] = useState({
    categories: "All",
    priceRange: "All",
  });
  const [categories, setCategories] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Touch handling for mobile swipe-to-close
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Minimum distance to trigger swipe close
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isDownSwipe = distance < -minSwipeDistance;
    
    if (isDownSwipe) {
      setShowFilters(false);
    }
  };
  
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFilters]);

  const {query,setQuery} = useContext(SearchContext);
  const { data: categoriesData } = useGetCategoriesQuery();


  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories === category ? "All" : category,
    }));
  };

  const handlePriceChange = (price) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange === price ? "All" : price,
    }));
  };

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData);
  }, [categoriesData]);

  return (
    <div>
        <Header />
        <main className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row px-4 md:px-8 pt-24 lg:pt-32 gap-8 min-h-screen relative">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden w-full flex justify-end">
            <button 
              onClick={() => setShowFilters(true)} 
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full shadow-lg active:scale-95 transition-all text-sm font-semibold"
            >
              <i className="fas fa-filter"></i> Filters
            </button>
          </div>

          {/* Mobile Overlay Backdrop */}
          <div 
            onClick={() => setShowFilters(false)}
            className={`fixed inset-0 bg-black/50 z-[90] lg:hidden backdrop-blur-sm transition-opacity duration-300 ${
              showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Filter Sidebar / Mobile Bottom Sheet */}
          {/* Filter Sidebar / Mobile Bottom Sheet */}
          <aside className={`
            fixed inset-x-0 bottom-0 z-[100] bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] 
            transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col max-h-[85vh]
            lg:sticky lg:top-32 lg:z-auto lg:h-[calc(100vh-8rem)] lg:w-64 lg:xl:w-72 lg:bg-transparent lg:shadow-none lg:p-0 lg:rounded-none lg:translate-y-0 lg:block
            ${showFilters ? "translate-y-0" : "translate-y-full lg:translate-y-0"}
          `}>
             
             {/* Mobile Header with Swipe Handler */}
             <div 
                className="lg:hidden flex flex-col items-center mb-2 sticky top-0 bg-white z-50 pt-6 px-6 pb-4"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
             >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-6 cursor-grab active:cursor-grabbing"></div>
                <div className="w-full flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Filters</h2>
                    <button 
                        onClick={() => setShowFilters(false)} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        <i className="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-0 lg:p-0 lg:overflow-visible">
            
            <div className="flex flex-col gap-8 pb-32 lg:pb-0">
                
                {/* Categories */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Categories</h3>
                    <div className="flex flex-col gap-3">
                         <label className="flex items-center gap-3 group cursor-pointer selection:bg-none">
                            <input 
                                onChange={() => handleCategoryChange("All")}
                                checked={filters.categories.includes("All")}
                                type="checkbox" 
                                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black transition-all cursor-pointer accent-black"
                            />
                            <span className={`text-[15px] transition-colors ${filters.categories.includes("All") ? "font-bold text-black" : "text-gray-600 group-hover:text-black"}`}>All Categories</span>
                         </label>
                         {categories && categories.map((category) => (
                             <label key={category._id} className="flex items-center gap-3 group cursor-pointer selection:bg-none">
                                <input
                                  onChange={() => handleCategoryChange(`${category.categoryName}`)}
                                  checked={filters.categories.includes(`${category.categoryName}`)}
                                  type="checkbox"
                                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black transition-all cursor-pointer accent-black"
                                />
                                <span className={`text-[15px] transition-colors ${filters.categories.includes(`${category.categoryName}`) ? "font-bold text-black" : "text-gray-600 group-hover:text-black"}`}>{category.categoryName}</span>
                              </label>
                         ))}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Price */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Price Range</h3>
                    <div className="flex flex-col gap-3">
                         {[
                            { label: "All Prices", value: "All" },
                            { label: "Under ₹ 200", value: "< 200" },
                            { label: "₹ 200 - ₹ 500", value: "200 to 500" },
                            { label: "Above ₹ 500", value: "> 500" }
                         ].map((price) => (
                            <label key={price.value} className="flex items-center gap-3 group cursor-pointer selection:bg-none">
                                <input
                                    onChange={() => handlePriceChange(price.value)}
                                    checked={filters.priceRange === price.value}
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black transition-all cursor-pointer accent-black"
                                />
                                <span className={`text-[15px] transition-colors ${filters.priceRange === price.value ? "font-bold text-black" : "text-gray-600 group-hover:text-black"}`}>{price.label}</span>
                            </label>
                         ))}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Sorting */}
                <div className="flex flex-col gap-4">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Sort By</h3>
                   <div className="flex flex-col gap-3">
                      {[
                          { label: "Alphabetical (A-Z)", value: "aA - zZ" },
                          { label: "Alphabetical (Z-A)", value: "zZ - aA" },
                          { label: "Price: Low to High", value: "price low to high" },
                          { label: "Price: High to Low", value: "price high to low" }
                      ].map((sort) => (
                        <label key={sort.value} className="flex items-center gap-3 group cursor-pointer selection:bg-none">
                            <input
                                onChange={() => setSortOption(sort.value)}
                                checked={sortOption === sort.value}
                                type="checkbox"
                                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black transition-all cursor-pointer accent-black"
                            />
                            <span className={`text-[15px] transition-colors ${sortOption === sort.value ? "font-bold text-black" : "text-gray-600 group-hover:text-black"}`}>{sort.label}</span>
                        </label>
                      ))}
                   </div>
                </div>

            </div>
            </div>

            {/* Mobile Apply Button (Sticky Bottom) */}
            <div className="lg:hidden absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 z-50">
                <button 
                    onClick={() => setShowFilters(false)}
                    className="w-full py-4 bg-black text-white rounded-full font-bold text-lg active:scale-95 transition-transform shadow-xl flex items-center justify-center gap-2"
                >
                    Show Results
                </button>
            </div>
          </aside>
          <div className="flex-1 w-full">
            <Products filters={filters} sortOption={sortOption} query={query} load={true} />
          </div>
        </main>
    </div>
  );
}

export default AllProducts;
