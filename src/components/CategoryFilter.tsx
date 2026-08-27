import React from 'react';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';
import { 
  Flame, 
  Sparkles, 
  Fish, 
  Users, 
  Wine, 
  Cookie, 
  Utensils,
  Coffee,
  Beer,
  Pizza,
  IceCream,
  ChefHat,
  Salad,
  Sandwich,
  Soup
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  categoryCounts: Record<CategoryId, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const { categories } = useStore();

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Fish':
        return <Fish className="w-4 h-4" />;
      case 'Users':
        return <Users className="w-4 h-4" />;
      case 'Wine':
        return <Wine className="w-4 h-4" />;
      case 'Cookie':
        return <Cookie className="w-4 h-4" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4" />;
      case 'Beer':
        return <Beer className="w-4 h-4" />;
      case 'Pizza':
        return <Pizza className="w-4 h-4" />;
      case 'IceCream':
        return <IceCream className="w-4 h-4" />;
      case 'ChefHat':
        return <ChefHat className="w-4 h-4" />;
      case 'Salad':
        return <Salad className="w-4 h-4" />;
      case 'Sandwich':
        return <Sandwich className="w-4 h-4" />;
      case 'Soup':
        return <Soup className="w-4 h-4" />;
      case 'Utensils':
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  return (
    <div className="sticky top-[108px] sm:top-[73px] z-30 bg-[#F9F9F9]/95 backdrop-blur-md py-3.5 border-b border-[#00167A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id as CategoryId] || 0;

            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id as CategoryId)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#00167A] text-[#FFF3C1] shadow-sm scale-102'
                    : 'bg-white text-[#2C2D2F] border border-[#00167A]/15 hover:bg-[#FFF3C1]/40 hover:text-[#00167A]'
                }`}
              >
                <span className={isSelected ? 'text-[#FFF3C1]' : 'text-[#00167A]'}>
                  {getIcon(cat.icon)}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    isSelected
                      ? 'bg-[#FFF3C1]/20 text-[#FFF3C1]'
                      : 'bg-[#00167A]/10 text-[#00167A]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
