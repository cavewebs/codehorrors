import React from 'react';
import { Filter, Code, Server, Settings, Database, Shield, Zap, Building } from 'lucide-react';
import type { Category, Submission } from '../types';

interface FilterSidebarProps {
  selectedCategory: Category | 'all';
  selectedTags: string[];
  onCategoryChange: (category: Category | 'all') => void;
  onTagsChange: (tags: string[]) => void;
  submissions: Submission[];
}

const categories = [
  { id: 'all' as const, name: 'All Categories', icon: Filter, color: 'text-gray-400' },
  { id: 'frontend' as const, name: 'Frontend', icon: Code, color: 'text-blue-400' },
  { id: 'backend' as const, name: 'Backend', icon: Server, color: 'text-green-400' },
  { id: 'devops' as const, name: 'DevOps', icon: Settings, color: 'text-orange-400' },
  { id: 'database' as const, name: 'Database', icon: Database, color: 'text-purple-400' },
  { id: 'security' as const, name: 'Security', icon: Shield, color: 'text-red-400' },
  { id: 'performance' as const, name: 'Performance', icon: Zap, color: 'text-yellow-400' },
  { id: 'architecture' as const, name: 'Architecture', icon: Building, color: 'text-indigo-400' },
];

export default function FilterSidebar({ 
  selectedCategory, 
  selectedTags, 
  onCategoryChange, 
  onTagsChange, 
  submissions 
}: FilterSidebarProps) {
  // Get all unique tags from submissions
  const allTags = Array.from(new Set(submissions.flatMap(s => s.tags))).sort();

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const getCategoryCount = (categoryId: Category | 'all') => {
    if (categoryId === 'all') return submissions.length;
    return submissions.filter(s => s.category === categoryId).length;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4 text-white">Filters</h2>
      
      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const count = getCategoryCount(category.id);
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                  isSelected 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : category.color}`} />
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isSelected 
                    ? 'bg-red-700 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  isSelected
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategory !== 'all' || selectedTags.length > 0) && (
        <button
          onClick={() => {
            onCategoryChange('all');
            onTagsChange([]);
          }}
          className="w-full mt-4 px-3 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}