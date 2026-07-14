"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSort,
  faChevronDown,
  faXmark,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import { Subcategory } from "../types/Subcategory.response.type";
import { CategoryConfig } from "../config/categories.config";
import ProductCard from "@/src/components/shared/product.cart";

interface CategoryScreenLayoutProps {
  config: CategoryConfig;
  products: Product[];
  subcategories: Subcategory[];
}

type SortOption =
  | "default"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest"
  | "name-az"
  | "name-za";

export default function CategoryScreenLayout({
  config,
  products,
  subcategories,
}: CategoryScreenLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Prices
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 100000 };
    const prices = products.map((p) => p.priceAfterDiscount || p.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [products]);

  // Filtering + Sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSubcategory !== "all") {
      result = result.filter((p) =>
        p.subcategory?.some((sub) => sub._id === selectedSubcategory)
      );
    }

    result = result.filter((p) => {
      const price = p.priceAfterDiscount || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            (a.priceAfterDiscount || a.price) -
            (b.priceAfterDiscount || b.price)
        );
        break;
      case "price-high":
        result.sort(
          (a, b) =>
            (b.priceAfterDiscount || b.price) -
            (a.priceAfterDiscount || a.price)
        );
        break;
      case "rating":
        result.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        break;
      case "name-az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-za":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [products, searchQuery, selectedSubcategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSubcategory("all");
    setPriceRange([minPrice, maxPrice]);
    setSortBy("default");
  };

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-low", label: "Price: Low → High" },
    { value: "price-high", label: "Price: High → Low" },
    { value: "rating", label: "Top Rated" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <section className="min-h-screen bg-[#D5D5D6] px-6 py-8">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6 text-[#6B3F16]">
        {config.name}
      </h1>

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="px-4 py-2 rounded-xl bg-white border flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSort} />
            Sort
            <FontAwesomeIcon icon={faChevronDown} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow z-10">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value as SortOption);
                    setIsSortOpen(false);
                  }}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 rounded-xl bg-gray-200 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faXmark} />
          Clear
        </button>
      </div>

      {/* Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} productInfo={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <FontAwesomeIcon
            icon={faBoxOpen}
            className="text-4xl text-gray-400 mb-4"
          />
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </section>
  );
}