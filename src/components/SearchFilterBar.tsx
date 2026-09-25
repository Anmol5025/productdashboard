import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchCategories } from '@/api/products';

interface SearchFilterBarProps {
  initialSearch: string;
  initialCategory: string;
  initialSort: string;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

export function SearchFilterBar({
  initialSearch,
  initialCategory,
  initialSort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: SearchFilterBarProps) {
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [categories, setCategories] = useState<{ slug: string, name: string }[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  // Sync state if props change (e.g. back button)
  useEffect(() => {
    setSearchValue(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Rule: API cannot search and filter by category at the same time.
      // We prioritize search here, handled in parent, but good to ensure both don't conflict.
      if (searchValue !== initialSearch) {
        onSearchChange(searchValue);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchValue, initialSearch, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </div>

      <div className="flex gap-4">
        <select
          value={initialCategory}
          onChange={(e) => {
            onCategoryChange(e.target.value);
          }}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => {
            // Handle both object and string formats defensively
            const isString = typeof cat === 'string';
            const catAny = cat as any;
            const value = isString ? catAny : catAny.slug;
            const label = isString 
              ? String(catAny).replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) 
              : catAny.name;
              
            return (
              <option key={value || idx} value={value}>
                {label}
              </option>
            );
          })}
        </select>

        <select
          value={initialSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Sort By (Default)</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Rating: High to Low</option>
          <option value="title_asc">Title: A to Z</option>
          <option value="title_desc">Title: Z to A</option>
        </select>
      </div>
    </div>
  );
}
