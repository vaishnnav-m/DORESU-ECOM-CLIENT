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
        <main className="w-full flex px-5 pt-36 justify-center">
          <div className="w-[15%] lg:block hidden">
            {/* filter by categories */}
            <h2 className="text-[20px] font-bold">Filter by categories</h2>
            <form
              className="pl-3 flex flex-col gap-2 font-semibold text-[#484848]"
              action=""
            >
              <div>
                <input
                  onChange={() => handleCategoryChange("All")}
                  checked={filters.categories.includes("All")}
                  className="mr-3"
                  type="checkbox"
                />
                <label>All Categories</label>
              </div>
              {categories &&
                categories.map((category) => (
                  <div key={category._id}>
                    <input
                      onChange={() =>
                        handleCategoryChange(`${category.categoryName}`)
                      }
                      checked={filters.categories.includes(
                        `${category.categoryName}`
                      )}
                      className="mr-3"
                      type="checkbox"
                    />
                    <label>{category.categoryName}</label>
                  </div>
                ))}
            </form>
            {/* filter by price */}
            <h2 className="text-[20px] font-bold mt-5">Filter by price</h2>
            <form
              className="pl-3 flex flex-col gap-2 font-semibold text-[#484848]"
              action=""
            >
              <div>
                <input
                  onChange={() => handlePriceChange("All")}
                  checked={filters.priceRange === "All"}
                  className="mr-3"
                  type="checkbox"
                />
                <label>All Prices</label>
              </div>
              <div>
                <input
                  onChange={() => handlePriceChange("< 200")}
                  checked={filters.priceRange === "< 200"}
                  className="mr-3"
                  type="checkbox"
                />
                <label>Under ₹ 200</label>
              </div>
              <div>
                <input
                  onChange={() => handlePriceChange("200 to 500")}
                  checked={filters.priceRange === "200 to 500"}
                  className="mr-3"
                  type="checkbox"
                />
                <label>₹ 200 to ₹ 500</label>
              </div>
              <div>
                <input
                  onChange={() => handlePriceChange("> 500")}
                  checked={filters.priceRange === "> 500"}
                  className="mr-3"
                  type="checkbox"
                />
                <label>Above ₹ 500</label>
              </div>
            </form>
            {/* sorting area */}
            <h2 className="text-[20px] font-bold mt-5">Sorting</h2>
            <form
              className="pl-3 flex flex-col gap-2 font-semibold text-[#484848]"
              action=""
            >
              <div>
                <input
                  onChange={() => setSortOption("aA - zZ")}
                  checked={sortOption === "aA - zZ"}
                  className="mr-3"
                  type="checkbox"
                />
                <label>aA - zZ</label>
              </div>
              <div>
                <input
                  onChange={() => setSortOption("zZ - aA")}
                  checked={sortOption === "zZ - aA"}
                  className="mr-3"
                  type="checkbox"
                />
                <label>zZ - aA</label>
              </div>
              <div>
                <input
                  onChange={() => setSortOption("price low to high")}
                  checked={sortOption === "price low to high"}
                  className="mr-3"
                  type="checkbox"
                />
                <label>Price low to high</label>
              </div>
              <div>
                <input
                  onChange={() => setSortOption("price high to low")}
                  checked={sortOption === "price high to low"}
                  className="mr-3"
                  type="checkbox"
                />
                <label>Price high to low</label>
              </div>
            </form>
            {/* --------------------- for futrure use --------------------- */}
            {/* star filter */}
            {/* <h2 className="text-[20px] font-bold mt-5">Filter by Ratings</h2>
          <form
            className="pl-3 flex flex-col gap-2 font-semibold text-[#484848]"
            action=""
          >
            <div>
              <input className="mr-3" type="checkbox" />
              <label>All Ratings</label>
            </div>
            <div>
              <input className="mr-3" type="checkbox" />
              <label className="inline-flex text-[#fca120]">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </label>
            </div>
            <div>
              <input className="mr-3" type="checkbox" />
              <label className="inline-flex text-[#fca120]">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
              </label>
            </div>
            <div>
              <input className="mr-3" type="checkbox" />
              <label className="inline-flex text-[#fca120]">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>
              </label>
            </div>
            <div>
              <input className="mr-3" type="checkbox" />
              <label className="inline-flex text-[#fca120]">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>
              </label>
            </div>
            <div>
              <input className="mr-3" type="checkbox" />
              <label className="inline-flex text-[#fca120]">
                <i className="fas fa-star"></i>
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>
                <i className="far fa-star"></i>
              </label>
            </div>
          </form> */}
          </div>
          <div className="w-[70%]">
            <Products filters={filters} sortOption={sortOption} query={query} load={true} />
          </div>
        </main>
    </div>
  );
}

export default AllProducts;
