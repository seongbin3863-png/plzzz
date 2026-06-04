import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <div className="relative">
    <span
      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] pointer-events-none select-none"
      aria-hidden="true"
    >🔍</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="응원 스팟 또는 지역 검색"
      className="w-full pl-8 pr-7 py-1.5 text-[11.5px] bg-black/35 border border-white/12
        rounded-lg text-white placeholder-white/32 focus:outline-none focus:border-red-500/55
        transition-colors duration-150"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40
          hover:text-white/75 transition-colors text-[16px] leading-none"
        aria-label="검색 초기화"
      >
        ×
      </button>
    )}
  </div>
);
