import React from 'react';
import { CategoryId } from '../types';
import { Flame, Sparkles, Fish, Wine, Tag, Info, Heart, Star } from 'lucide-react';

interface StoryItem {
  id: string;
  title: string;
  category?: CategoryId;
  action?: 'brand_story' | 'offers' | 'popular';
  image: string;
  badge?: string;
  isHot?: boolean;
}

interface MobileStoryHighlightsProps {
  onSelectCategory: (cat: CategoryId) => void;
  onOpenBrandStory: () => void;
  onOpenOffers: () => void;
  onSelectPopular: () => void;
}

export const MobileStoryHighlights: React.FC<MobileStoryHighlightsProps> = ({
  onSelectCategory,
  onOpenBrandStory,
  onOpenOffers,
  onSelectPopular,
}) => {
  const stories: StoryItem[] = [
    {
      id: 'insignias',
      title: 'Al Batán',
      category: 'insignias',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80',
      badge: 'TOP',
      isHot: true,
    },
    {
      id: 'cupones',
      title: '10% OFF',
      action: 'offers',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      badge: 'PROMO',
    },
    {
      id: 'marinos',
      title: 'Ceviches',
      category: 'marinos',
      image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'chichas',
      title: 'Chichas',
      category: 'bebidas',
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=300&q=80',
      badge: 'Jarra',
    },
    {
      id: 'entradas',
      title: 'Tamalitos',
      category: 'entradas',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'historia',
      title: 'Picantería',
      action: 'brand_story',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
      badge: 'Piura',
    },
  ];

  const handleClick = (story: StoryItem) => {
    if (story.action === 'brand_story') {
      onOpenBrandStory();
    } else if (story.action === 'offers') {
      onOpenOffers();
    } else if (story.category) {
      onSelectCategory(story.category);
    }
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-2.5 px-4 bg-white border-b border-[#00167A]/8">
      <div className="flex items-center gap-3.5 min-w-max">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => handleClick(story)}
            className="flex flex-col items-center gap-1.5 focus:outline-none group active:scale-95 transition-transform"
          >
            {/* Circular Ring with Avatar */}
            <div className="relative">
              <div className={`w-15 h-15 rounded-full p-[2.5px] transition-all duration-300 ${
                story.isHot
                  ? 'bg-gradient-to-tr from-amber-400 via-red-500 to-[#00167A] ring-2 ring-amber-300/50'
                  : 'bg-gradient-to-tr from-[#00167A] via-blue-700 to-[#FFF3C1]'
              }`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Little Floating Badge */}
              {story.badge && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#00167A] text-[#FFF3C1] text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full border border-white shadow-2xs whitespace-nowrap">
                  {story.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span className="text-[11px] font-bold text-[#2C2D2F] tracking-tight text-center max-w-[64px] truncate group-hover:text-[#00167A]">
              {story.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
