import React from 'react';
import { CATEGORIES } from '../data/products';
import { CategoryId } from '../types';

interface CategoriesGridProps {
  categoryCounts: Record<CategoryId, number>;
  onSelectCategory: (categoryId: CategoryId) => void;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categoryCounts,
  onSelectCategory,
}) => {
  // Exclude 'todos' from the grid so it only shows specific categories matching screenshot 3
  const displayCategories = CATEGORIES.filter((c) => c.id !== 'todos');

  return (
    <section className="py-4 sm:py-6 px-4 sm:px-6">
      {/* Section Title (Screenshot 3: "Categorías") */}
      <div className="mb-3 sm:mb-4">
        <h2 className="font-gotham text-xl sm:text-2xl font-extrabold text-[#2C2D2F] tracking-tight">
          Categorías
        </h2>
      </div>

      {/* 2-Column Grid (Screenshot 3) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {displayCategories.map((cat) => {
          const count = categoryCounts[cat.id as CategoryId] || 0;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as CategoryId)}
              className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:-translate-y-0.5 active:scale-95"
            >
              {/* Category Background Photo */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />

              {/* Dark Gradient Overlay for Maximum Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent group-hover:from-black/90 transition-colors" />

              {/* Text Inside Photo (Screenshot 3) */}
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <h3 className="font-gotham font-extrabold text-sm sm:text-base md:text-lg text-white leading-tight drop-shadow-xs">
                  {cat.name}
                </h3>
                <span className="text-[11px] sm:text-xs text-white/80 font-medium">
                  {count} {count === 1 ? 'opción' : 'opciones'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
