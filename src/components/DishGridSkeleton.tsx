import React from 'react';

interface DishGridSkeletonProps {
  count?: number;
  categoryName?: string;
}

export const DishGridSkeleton: React.FC<DishGridSkeletonProps> = ({
  count = 6,
  categoryName,
}) => {
  const items = Array.from({ length: count });

  return (
    <div className="space-y-4 w-full animate-fadeIn">
      {/* Sutil micro-banner indicador de filtrado con los colores de marca */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#FFF3C1]/50 border border-[#00167A]/15 rounded-2xl">
        <div className="flex items-center gap-2.5">
          {/* Spinner circular con colores de marca */}
          <div className="relative w-4 h-4">
            <div className="w-4 h-4 rounded-full border-2 border-[#00167A]/20" />
            <div className="absolute inset-0 w-4 h-4 rounded-full border-2 border-t-[#00167A] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
          <span className="text-xs font-bold text-[#00167A] tracking-wide">
            {categoryName ? `Seleccionando ${categoryName}...` : 'Actualizando la carta...'}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#00167A]/60">
          La Facinerosa
        </span>
      </div>

      {/* Grid de Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
        {items.map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-[#00167A]/10 overflow-hidden shadow-xs animate-shimmer flex flex-col justify-between"
          >
            {/* MOBILE LAYOUT SKELETON */}
            <div className="flex sm:hidden p-3.5 gap-3 justify-between items-center">
              <div className="flex-1 space-y-2">
                {/* Badge pill skeleton */}
                <div className="w-16 h-3.5 bg-[#FFF3C1] rounded-md" />
                {/* Title skeleton */}
                <div className="w-3/4 h-4 bg-gray-200 rounded-md" />
                {/* Description lines skeleton */}
                <div className="w-full h-3 bg-gray-100 rounded-md" />
                <div className="w-2/3 h-3 bg-gray-100 rounded-md" />
                {/* Price and prep time */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-16 h-5 bg-[#00167A]/10 rounded-md" />
                  <div className="w-12 h-3 bg-gray-100 rounded-md" />
                </div>
              </div>

              {/* Thumbnail image skeleton */}
              <div className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-[#FFF3C1]/80 via-gray-100 to-[#00167A]/5 relative overflow-hidden" />
            </div>

            {/* DESKTOP LAYOUT SKELETON */}
            <div className="hidden sm:flex sm:flex-col justify-between h-full">
              <div>
                {/* Image placeholder */}
                <div className="relative aspect-4/3 w-full bg-gradient-to-br from-[#FFF3C1]/70 via-gray-100 to-[#00167A]/10">
                  {/* Floating tag placeholder */}
                  <div className="absolute top-3 left-3 w-20 h-5 bg-[#00167A]/15 rounded-md" />
                </div>

                {/* Content info */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  {/* Dish name skeleton */}
                  <div className="w-3/5 h-6 bg-[#00167A]/15 rounded-md" />
                  {/* Description lines */}
                  <div className="w-full h-3 bg-gray-100 rounded-md" />
                  <div className="w-4/5 h-3 bg-gray-100 rounded-md" />
                  <div className="w-1/2 h-3 bg-gray-100 rounded-md" />
                </div>
              </div>

              {/* Bottom bar */}
              <div className="p-4 sm:p-5 pt-0 border-t border-[#00167A]/8 mt-auto flex items-center justify-between">
                <div>
                  <div className="w-10 h-2.5 bg-gray-200 rounded-xs mb-1" />
                  <div className="w-20 h-7 bg-[#00167A]/10 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-8 bg-[#FFF3C1] rounded-xl" />
                  <div className="w-8 h-8 bg-[#00167A]/15 rounded-xl" />
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
