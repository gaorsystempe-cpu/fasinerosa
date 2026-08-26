import React from 'react';

export const FloatingDishArt: React.FC = () => {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] mx-auto my-3 sm:my-6 select-none flex flex-col items-center">
      
      {/* 1. FLYING PARTICLES & INGREDIENTS LAYER (Exploding around the floating dish) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        
        {/* Flying Chifle 1 (Top-Left) */}
        <div className="absolute top-2 left-4 sm:left-6 animate-float-p1 transform -rotate-12 hover:scale-110 transition-transform">
          <svg className="w-12 h-8 sm:w-16 sm:h-10 drop-shadow-md" viewBox="0 0 100 60" fill="none">
            <path
              d="M10 25C25 5 70 8 90 28C75 48 30 52 10 25Z"
              fill="url(#chifle-grad-1)"
              stroke="#D4A017"
              strokeWidth="1.5"
            />
            <path d="M25 22C45 15 70 20 80 30" stroke="#B8860B" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            <defs>
              <linearGradient id="chifle-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="50%" stopColor="#F5BE2E" />
                <stop offset="100%" stopColor="#D99B16" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Flying Chifle 2 (Top-Right) */}
        <div className="absolute top-4 right-3 sm:right-6 animate-float-p2 transform rotate-25">
          <svg className="w-14 h-9 sm:w-18 sm:h-11 drop-shadow-lg" viewBox="0 0 100 60" fill="none">
            <path
              d="M15 35C30 10 75 12 92 32C72 52 28 50 15 35Z"
              fill="url(#chifle-grad-2)"
              stroke="#D4A017"
              strokeWidth="1.5"
            />
            <path d="M28 30C48 20 75 25 85 35" stroke="#B8860B" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            <defs>
              <linearGradient id="chifle-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFEA85" />
                <stop offset="60%" stopColor="#F5BE2E" />
                <stop offset="100%" stopColor="#C98B10" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Flying Chifle 3 (Bottom-Right floating) */}
        <div className="absolute bottom-10 right-2 sm:right-4 animate-float-p3 transform -rotate-45">
          <svg className="w-11 h-7 sm:w-14 sm:h-9 drop-shadow-md" viewBox="0 0 100 60" fill="none">
            <path
              d="M12 28C28 8 72 10 88 30C70 48 26 48 12 28Z"
              fill="url(#chifle-grad-1)"
              stroke="#D4A017"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* Flying Ají Limo Slice 1 (Red Chili ring with seeds) */}
        <div className="absolute top-12 left-1 sm:left-2 animate-float-p2 transform rotate-45">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-3 border-red-600 bg-red-500/20 shadow-md flex items-center justify-center relative">
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <div className="w-1 h-1 rounded-full bg-amber-200 absolute top-1 right-1" />
            <div className="w-1 h-1 rounded-full bg-amber-200 absolute bottom-1 left-1" />
          </div>
        </div>

        {/* Flying Ají Limo Slice 2 (Yellow/Orange North pepper ring) */}
        <div className="absolute bottom-14 left-4 sm:left-8 animate-float-p1 transform -rotate-20">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-3 border-amber-500 bg-amber-400/25 shadow-md flex items-center justify-center relative">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <div className="w-1 h-1 rounded-full bg-yellow-100 absolute top-0.5 right-1" />
          </div>
        </div>

        {/* Flying Cilantro / Hierbabuena Leaves */}
        <div className="absolute top-8 right-16 sm:right-24 animate-float-p1 transform rotate-12">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-xs text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8 6 6 11 7 15C8 19 12 22 12 22C12 22 16 19 17 15C18 11 16 6 12 2Z" fill="#15803D" />
            <path d="M12 2V22" stroke="#166534" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>

        <div className="absolute bottom-16 right-16 animate-float-p3 transform -rotate-30">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-xs" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8 6 6 11 7 15C8 19 12 22 12 22C12 22 16 19 17 15C18 11 16 6 12 2Z" fill="#22C55E" />
          </svg>
        </div>

        {/* Flying Golden Cancha Chulpi (Toasted Corn Kernels) */}
        <div className="absolute top-20 right-8 animate-float-p2 w-3.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-700 shadow-xs border border-amber-300 transform rotate-45" />
        <div className="absolute top-6 left-28 animate-float-p1 w-3 h-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-800 shadow-xs border border-amber-300 transform -rotate-30" />
        <div className="absolute bottom-8 left-20 animate-float-p3 w-3 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-700 shadow-xs border border-amber-300 transform rotate-60" />
        <div className="absolute bottom-20 right-8 animate-float-p1 w-2.5 h-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-800 shadow-xs transform -rotate-15" />

        {/* Red Onion Sarza Crescent */}
        <div className="absolute top-16 left-14 animate-float-p2">
          <svg className="w-8 h-4 drop-shadow-xs" viewBox="0 0 40 20" fill="none">
            <path d="M5 15C15 5 25 5 35 15" stroke="#9333EA" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M8 17C16 8 24 8 32 17" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Seasoning explosion dots */}
        <div className="absolute top-1/4 left-10 w-1.5 h-1.5 rounded-full bg-[#00167A]/40" />
        <div className="absolute top-1/3 right-12 w-1.5 h-1.5 rounded-full bg-red-500/60" />
        <div className="absolute bottom-1/3 left-6 w-2 h-2 rounded-full bg-amber-400/70" />
      </div>

      {/* 2. FLOATING DISH CUTOUT (Central Masterpiece - Levitating without square box!) */}
      <div className="relative z-10 animate-levitate transition-all duration-300">
        
        {/* Soft radial glow behind the floating food */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF3C1]/80 to-transparent rounded-full blur-xl scale-110 -z-10" />

        {/* Floating Dish Silhouette (Pure circular/curved gourmet serving, no rectangular card) */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-92 md:h-92 rounded-full p-2.5 sm:p-3.5 bg-gradient-to-b from-[#FFF3C1] via-[#F9F9F9] to-[#00167A]/20 shadow-[0_20px_45px_-10px_rgba(0,22,122,0.35)] flex items-center justify-center">
          
          {/* Gourmet Cazuela Rim / Border */}
          <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner border-4 sm:border-6 border-[#FFF3C1]">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85"
              alt="Seco de Chabelo Tradicional al Batán - La Facinerosa"
              className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-700"
            />

            {/* Subtle gloss highlight on rim */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30 pointer-events-none rounded-full" />
          </div>

          {/* Floating Pill Tag (Styled strictly with La Facinerosa Navy & Cream) */}
          <div className="absolute -bottom-2 sm:-bottom-3 bg-[#00167A] text-[#FFF3C1] border-2 border-[#FFF3C1] px-4 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 z-30">
            <span className="text-sm">🔥</span>
            <span className="font-gotham font-extrabold text-[11px] sm:text-xs tracking-wider uppercase">
              Seco de Chabelo al Batán
            </span>
          </div>

        </div>

      </div>

      {/* 3. CONTACT SHADOW ON THE FLOOR (Pulses as food floats up and down) */}
      <div className="w-48 sm:w-64 md:w-72 h-6 sm:h-8 bg-[#00167A]/30 rounded-[100%] blur-md mt-4 sm:mt-6 animate-shadow-pulse pointer-events-none" />

    </div>
  );
};
