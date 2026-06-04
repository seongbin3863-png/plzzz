import React from 'react';

interface RegionFilterProps {
  regions: string[];
  selected: string;
  onSelect: (region: string) => void;
}

export const RegionFilter: React.FC<RegionFilterProps> = ({ regions, selected, onSelect }) => (
  <div
    className="flex gap-1.5 overflow-x-auto py-0.5"
    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
  >
    {regions.map((r) => (
      <button
        key={r}
        onClick={() => onSelect(r)}
        className={[
          'shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border min-h-[36px]',
          'transition-all duration-150 active:scale-95',
          selected === r
            ? 'bg-red-600 border-red-500 text-white shadow-[0_0_8px_rgba(220,0,0,0.40)]'
            : 'bg-black/30 border-white/14 text-white/58 hover:bg-black/50 hover:text-white/88 hover:border-white/24',
        ].join(' ')}
      >
        {r}
      </button>
    ))}
  </div>
);
