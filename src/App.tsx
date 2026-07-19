import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { spots, REGIONS, REGION_CENTERS, REGION_GROUPS } from './data/spots';
import { MapView, type Place } from './components/MapView.tsx';
import { SearchBar } from './components/SearchBar.tsx';
import { RegionFilter } from './components/RegionFilter.tsx';


function TaegukSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="88" fill="#0a0a0a" />
      <path d="M100 12 A88 88 0 0 1 100 188 A44 44 0 0 1 100 100 A44 44 0 0 0 100 12Z" fill="#EF4444" />
      <circle cx="100" cy="100" r="88" stroke="#EF4444" strokeWidth="3" fill="none" />
      <circle cx="100" cy="56" r="22" fill="#0a0a0a" />
      <circle cx="100" cy="144" r="22" fill="#EF4444" />
    </svg>
  );
}

function TigerSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 200" className={className} aria-hidden="true">
      <ellipse cx="90" cy="102" rx="80" ry="86" fill="#991b1b" />
      <path d="M20 58 L6 14 L54 42Z" fill="#dc2626" /><path d="M160 58 L174 14 L126 42Z" fill="#dc2626" />
      <path d="M23 54 L12 22 L50 42Z" fill="#3f0505" /><path d="M157 54 L168 22 L130 42Z" fill="#3f0505" />
      <path d="M88 20 L84 58 L92 58Z" fill="#3f0505" /><path d="M73 26 L69 60 L76 60Z" fill="#3f0505" /><path d="M107 26 L111 60 L104 60Z" fill="#3f0505" />
      <ellipse cx="60" cy="90" rx="21" ry="17" fill="#1a0505" /><ellipse cx="120" cy="90" rx="21" ry="17" fill="#1a0505" />
      <ellipse cx="60" cy="90" rx="11" ry="15" fill="#f59e0b" /><ellipse cx="120" cy="90" rx="11" ry="15" fill="#f59e0b" />
      <ellipse cx="60" cy="90" rx="5" ry="13" fill="#1a0505" /><ellipse cx="120" cy="90" rx="5" ry="13" fill="#1a0505" />
      <ellipse cx="55" cy="84" rx="3" ry="2" fill="#fef3c7" /><ellipse cx="115" cy="84" rx="3" ry="2" fill="#fef3c7" />
      <path d="M80 114 L100 114 L90 127Z" fill="#1a0505" />
      <path d="M3 110 L38 106 L38 116Z" fill="#3f0505" /><path d="M5 124 L40 120 L40 129Z" fill="#3f0505" />
      <path d="M177 110 L142 106 L142 116Z" fill="#3f0505" /><path d="M175 124 L140 120 L140 129Z" fill="#3f0505" />
      <ellipse cx="90" cy="130" rx="26" ry="19" fill="#b91c1c" />
      <path d="M68 132 Q90 148 112 132" stroke="#3f0505" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

// ── Fixture type ──────────────────────────────────────────────────────────
type Fixture = {
  date: string; time: string;
  home: string; away: string;
  homeFlag: string; awayFlag: string;
  featured?: boolean;
};

// ── Fixtures data ──────────────────────────────────────────────────────────
const FIXTURES: Fixture[] = [
  { date:"2026-06-12",time:"11:00",home:"대한민국",away:"체코",homeFlag:"kr",awayFlag:"cz",featured:true },
  { date:"2026-06-13",time:"04:00",home:"캐나다",away:"보스니아 헤르체고비나",homeFlag:"ca",awayFlag:"ba" },
  { date:"2026-06-13",time:"10:00",home:"미국",away:"파라과이",homeFlag:"us",awayFlag:"py" },
  { date:"2026-06-14",time:"04:00",home:"카타르",away:"스위스",homeFlag:"qa",awayFlag:"ch" },
  { date:"2026-06-14",time:"07:00",home:"브라질",away:"모로코",homeFlag:"br",awayFlag:"ma" },
  { date:"2026-06-14",time:"10:00",home:"아이티",away:"스코틀랜드",homeFlag:"ht",awayFlag:"sc" },
  { date:"2026-06-14",time:"13:00",home:"호주",away:"튀르키예",homeFlag:"au",awayFlag:"tr" },
  { date:"2026-06-15",time:"02:00",home:"독일",away:"퀴라소",homeFlag:"de",awayFlag:"cw" },
  { date:"2026-06-15",time:"05:00",home:"네덜란드",away:"일본",homeFlag:"nl",awayFlag:"jp" },
  { date:"2026-06-15",time:"08:00",home:"코트디부아르",away:"에콰도르",homeFlag:"ci",awayFlag:"ec" },
  { date:"2026-06-15",time:"11:00",home:"스웨덴",away:"튀니지",homeFlag:"se",awayFlag:"tn" },
  { date:"2026-06-16",time:"01:00",home:"스페인",away:"카보베르데",homeFlag:"es",awayFlag:"cv" },
  { date:"2026-06-16",time:"04:00",home:"벨기에",away:"이집트",homeFlag:"be",awayFlag:"eg" },
  { date:"2026-06-16",time:"07:00",home:"사우디아라비아",away:"우루과이",homeFlag:"sa",awayFlag:"uy" },
  { date:"2026-06-16",time:"10:00",home:"이란",away:"뉴질랜드",homeFlag:"ir",awayFlag:"nz" },
  { date:"2026-06-17",time:"04:00",home:"프랑스",away:"세네갈",homeFlag:"fr",awayFlag:"sn" },
  { date:"2026-06-17",time:"07:00",home:"이라크",away:"노르웨이",homeFlag:"iq",awayFlag:"no" },
  { date:"2026-06-17",time:"10:00",home:"아르헨티나",away:"알제리",homeFlag:"ar",awayFlag:"dz" },
  { date:"2026-06-17",time:"13:00",home:"오스트리아",away:"요르단",homeFlag:"at",awayFlag:"jo" },
  { date:"2026-06-18",time:"02:00",home:"포르투갈",away:"콩고민주공화국",homeFlag:"pt",awayFlag:"cd" },
  { date:"2026-06-18",time:"05:00",home:"잉글랜드",away:"크로아티아",homeFlag:"gb",awayFlag:"hr" },
  { date:"2026-06-18",time:"08:00",home:"가나",away:"파나마",homeFlag:"gh",awayFlag:"pa" },
  { date:"2026-06-18",time:"11:00",home:"우즈베키스탄",away:"콜롬비아",homeFlag:"uz",awayFlag:"co" },
  { date:"2026-06-19",time:"01:00",home:"체코",away:"남아프리카공화국",homeFlag:"cz",awayFlag:"za" },
  { date:"2026-06-19",time:"04:00",home:"스위스",away:"보스니아 헤르체고비나",homeFlag:"ch",awayFlag:"ba" },
  { date:"2026-06-19",time:"07:00",home:"캐나다",away:"카타르",homeFlag:"ca",awayFlag:"qa" },
  { date:"2026-06-19",time:"10:00",home:"멕시코",away:"대한민국",homeFlag:"mx",awayFlag:"kr",featured:true },
  { date:"2026-06-20",time:"04:00",home:"미국",away:"호주",homeFlag:"us",awayFlag:"au" },
  { date:"2026-06-20",time:"07:00",home:"스코틀랜드",away:"모로코",homeFlag:"sc",awayFlag:"ma" },
  { date:"2026-06-20",time:"09:30",home:"브라질",away:"아이티",homeFlag:"br",awayFlag:"ht" },
  { date:"2026-06-20",time:"12:00",home:"튀르키예",away:"파라과이",homeFlag:"tr",awayFlag:"py" },
  { date:"2026-06-21",time:"02:00",home:"네덜란드",away:"스웨덴",homeFlag:"nl",awayFlag:"se" },
  { date:"2026-06-21",time:"05:00",home:"독일",away:"코트디부아르",homeFlag:"de",awayFlag:"ci" },
  { date:"2026-06-21",time:"09:00",home:"에콰도르",away:"퀴라소",homeFlag:"ec",awayFlag:"cw" },
  { date:"2026-06-21",time:"13:00",home:"튀니지",away:"일본",homeFlag:"tn",awayFlag:"jp" },
  { date:"2026-06-22",time:"02:00",home:"스페인",away:"브라질",homeFlag:"es",awayFlag:"br" },
  { date:"2026-06-22",time:"05:00",home:"아르헨티나",away:"프랑스",homeFlag:"ar",awayFlag:"fr" },
  { date:"2026-06-22",time:"08:00",home:"포르투갈",away:"잉글랜드",homeFlag:"pt",awayFlag:"gb" },
  { date:"2026-06-22",time:"11:00",home:"독일",away:"벨기에",homeFlag:"de",awayFlag:"be" },
  { date:"2026-06-23",time:"02:00",home:"우루과이",away:"콜롬비아",homeFlag:"uy",awayFlag:"co" },
  { date:"2026-06-23",time:"05:00",home:"미국",away:"캐나다",homeFlag:"us",awayFlag:"ca" },
  { date:"2026-06-23",time:"08:00",home:"크로아티아",away:"네덜란드",homeFlag:"hr",awayFlag:"nl" },
  { date:"2026-06-23",time:"11:00",home:"모로코",away:"이란",homeFlag:"ma",awayFlag:"ir" },
  { date:"2026-06-24",time:"02:00",home:"포르투갈",away:"우즈베키스탄",homeFlag:"pt",awayFlag:"uz" },
  { date:"2026-06-24",time:"05:00",home:"잉글랜드",away:"가나",homeFlag:"gb",awayFlag:"gh" },
  { date:"2026-06-24",time:"08:00",home:"파나마",away:"크로아티아",homeFlag:"pa",awayFlag:"hr" },
  { date:"2026-06-24",time:"11:00",home:"콜롬비아",away:"콩고민주공화국",homeFlag:"co",awayFlag:"cd" },
  { date:"2026-06-25",time:"04:00",home:"스위스",away:"캐나다",homeFlag:"ch",awayFlag:"ca" },
  { date:"2026-06-25",time:"04:00",home:"보스니아 헤르체고비나",away:"카타르",homeFlag:"ba",awayFlag:"qa" },
  { date:"2026-06-25",time:"07:00",home:"스코틀랜드",away:"브라질",homeFlag:"sc",awayFlag:"br" },
  { date:"2026-06-25",time:"07:00",home:"모로코",away:"아이티",homeFlag:"ma",awayFlag:"ht" },
  { date:"2026-06-25",time:"10:00",home:"남아프리카 공화국",away:"대한민국",homeFlag:"za",awayFlag:"kr",featured:true },
  { date:"2026-06-25",time:"10:00",home:"체코",away:"멕시코",homeFlag:"cz",awayFlag:"mx" },
  { date:"2026-06-26",time:"05:00",home:"퀴라소",away:"코트디부아르",homeFlag:"cw",awayFlag:"ci" },
  { date:"2026-06-26",time:"05:00",home:"에콰도르",away:"독일",homeFlag:"ec",awayFlag:"de" },
  { date:"2026-06-26",time:"08:00",home:"튀니지",away:"네덜란드",homeFlag:"tn",awayFlag:"nl" },
  { date:"2026-06-26",time:"08:00",home:"일본",away:"스웨덴",homeFlag:"jp",awayFlag:"se" },
  { date:"2026-06-26",time:"11:00",home:"파라과이",away:"호주",homeFlag:"py",awayFlag:"au" },
  { date:"2026-06-26",time:"11:00",home:"튀르키예",away:"미국",homeFlag:"tr",awayFlag:"us" },
  { date:"2026-06-27",time:"04:00",home:"세네갈",away:"이라크",homeFlag:"sn",awayFlag:"iq" },
  { date:"2026-06-27",time:"04:00",home:"노르웨이",away:"프랑스",homeFlag:"no",awayFlag:"fr" },
  { date:"2026-06-27",time:"09:00",home:"우루과이",away:"스페인",homeFlag:"uy",awayFlag:"es" },
  { date:"2026-06-27",time:"09:00",home:"카보베르데",away:"사우디아라비아",homeFlag:"cv",awayFlag:"sa" },
  { date:"2026-06-27",time:"12:00",home:"뉴질랜드",away:"벨기에",homeFlag:"nz",awayFlag:"be" },
  { date:"2026-06-27",time:"12:00",home:"이집트",away:"이란",homeFlag:"eg",awayFlag:"ir" },
  { date:"2026-06-28",time:"06:00",home:"파나마",away:"잉글랜드",homeFlag:"pa",awayFlag:"gb" },
  { date:"2026-06-28",time:"06:00",home:"크로아티아",away:"가나",homeFlag:"hr",awayFlag:"gh" },
  { date:"2026-06-28",time:"08:30",home:"콜롬비아",away:"포르투갈",homeFlag:"co",awayFlag:"pt" },
  { date:"2026-06-28",time:"08:30",home:"콩고민주공화국",away:"우즈베키스탄",homeFlag:"cd",awayFlag:"uz" },
  { date:"2026-06-28",time:"11:00",home:"요르단",away:"아르헨티나",homeFlag:"jo",awayFlag:"ar" },
  { date:"2026-06-28",time:"11:00",home:"알제리",away:"오스트리아",homeFlag:"dz",awayFlag:"at" },
  { date:"2026-06-29",time:"04:00",home:"남아프리카 공화국",away:"캐나다",homeFlag:"za",awayFlag:"ca" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const flagEmoji = (code: string) =>
  code.toUpperCase().split('').map(c =>
    String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
  ).join('');

const fmtDate = (d: string) => {
  const [, m, day] = d.split('-');
  return `${parseInt(m)}월 ${parseInt(day)}일`;
};

// ── MatchCard ──────────────────────────────────────────────────────────────
function MatchCard({ match, selected, onClick }: {
  match: Fixture; selected: boolean; onClick: () => void;
}) {
  const isKorea = !!match.featured;
  return (
    <div
      onClick={onClick}
      className={[
        'relative px-3 py-2.5 border-b border-white/8 cursor-pointer select-none',
        'transition-all duration-150 active:scale-[0.98]',
        selected
          ? 'bg-red-800/45'
          : isKorea
          ? 'bg-red-950/32 hover:bg-red-900/40'
          : 'hover:bg-white/[0.06]',
      ].join(' ')}
    >
      {/* Korea inner glow */}
      {isKorea && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 22px rgba(200,0,0,0.30)' }} />
      )}
      {/* KOREA badge */}
      {isKorea && (
        <span className="absolute top-1.5 right-2 text-[6px] font-black uppercase tracking-widest
          text-red-400 bg-red-950/70 border border-red-700/50 px-1.5 py-0.5 rounded-sm">
          KOREA
        </span>
      )}
      {/* Teams */}
      <div className="flex items-center gap-1">
        <span className="text-[13px] leading-none shrink-0">{flagEmoji(match.homeFlag)}</span>
        <span className={`text-[9.5px] font-bold flex-1 min-w-0 truncate
          ${isKorea ? 'text-white' : 'text-white/82'}`}>
          {match.home}
        </span>
        <span className="text-[7px] font-black text-white/25 shrink-0 px-0.5">VS</span>
        <span className={`text-[9.5px] font-bold flex-1 min-w-0 truncate text-right
          ${isKorea ? 'text-white' : 'text-white/82'}`}>
          {match.away}
        </span>
        <span className="text-[13px] leading-none shrink-0">{flagEmoji(match.awayFlag)}</span>
      </div>
      {/* Date & time */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[8px] text-white/35">{fmtDate(match.date)}</span>
        <span className={`text-[8.5px] font-bold tabular-nums
          ${isKorea ? 'text-yellow-300' : 'text-white/50'}`}>
          {match.time} KST
        </span>
      </div>
    </div>
  );
}

// ── MatchSchedulePanel ─────────────────────────────────────────────────────
const MatchSchedulePanel = React.memo(function MatchSchedulePanel({ selectedMatch, onSelectMatch, venueCount }: {
  selectedMatch: Fixture | null;
  onSelectMatch: (m: Fixture) => void;
  venueCount: number;
}) {
  const upcoming = FIXTURES.filter(f =>
    new Date(`${f.date}T${f.time}:00+09:00`) >= new Date()
  );
  return (
    <div className="flex-1 bg-black/52 border-t-4 border-red-500 rounded-b-xl rounded-tr-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-red-900/55 px-3 py-2 border-b border-white/10">
        <p className="text-[7px] font-black tracking-[0.35em] text-white/55 uppercase">
          FIFA World Cup 2026
        </p>
        <p className="text-[11px] font-black text-white tracking-[0.18em] uppercase mt-0.5">
          Upcoming Matches
        </p>
      </div>
      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(180,0,0,0.45) transparent' }}>
        {upcoming.map((match, i) => (
          <React.Fragment key={`${match.date}-${match.time}`}>
            <MatchCard
              match={match}
              selected={
                selectedMatch?.date === match.date &&
                selectedMatch?.time === match.time
              }
              onClick={() => onSelectMatch(match)}
            />
          </React.Fragment>
        ))}
      </div>
      {/* Footer */}
      <div className="shrink-0 px-3 py-2.5 border-t border-white/10 flex items-end justify-between">
        <p className="text-[7.5px] text-white/30 uppercase tracking-[0.25em]">응원 장소</p>
        <p className="text-[11px] font-black text-white leading-none">
          {venueCount}<span className="text-[10px] text-red-400 ml-0.5">곳</span>
        </p>
      </div>
    </div>
  );
});

// ── 추천 응원 스팟 순환 배너 (헤더 아래 — 모바일+PC, 3초 교체) ──
// 헤더에 노출할 스팟 ID 목록 (순서대로 번갈아 표시)
const HEADER_BANNER_IDS = ['103', '104', '76', '34'];
// 진 파스타펍, 엘리펀트 키친, 비기스, 신촌 낭만오지

const RotatingSponsoredBanner = React.memo(function RotatingSponsoredBanner({
  getFavCount,
  onSelect,
}: {
  getFavCount: (id: string) => number;
  onSelect: (place: Place) => void;
}) {
  // HEADER_BANNER_IDS 순서대로 균등 순환
  const sequence = React.useMemo(() => {
    const allPlaces = spots as unknown as Place[];
    return HEADER_BANNER_IDS
      .map(id => allPlaces.find(s => s.id === id))
      .filter((s): s is Place => s != null);
  }, []);

  const [idx, setIdx] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (sequence.length <= 1) return;
    let tid: ReturnType<typeof setTimeout>;
    const iid = setInterval(() => {
      setVisible(false);
      tid = setTimeout(() => {
        setIdx(i => (i + 1) % sequence.length);
        setVisible(true);
      }, 280);
    }, 3000);
    return () => { clearInterval(iid); clearTimeout(tid); };
  }, [sequence.length]);

  if (!sequence.length) return null;
  const s = sequence[idx];

  return (
    <div
      className="shrink-0 flex items-center gap-3 px-4 border-b border-amber-500/20 cursor-pointer active:opacity-75"
      style={{
        background: 'linear-gradient(90deg, rgba(120,53,15,0.55) 0%, rgba(0,0,0,0.75) 100%)',
        minHeight: '44px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-5px)',
        transition: 'opacity 0.26s ease, transform 0.26s ease',
      }}
      onClick={() => onSelect(s)}
    >
      <span className="text-[9px] font-black text-amber-300 tracking-widest shrink-0 bg-amber-400/15 border border-amber-400/40 rounded px-1.5 py-0.5 uppercase">
        ⭐ {s.badge || '추천 응원 스팟'}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-[13px] font-black text-white mr-2">{s.name}</span>
        <span className="text-[11px] text-amber-200/60">{s.tags[0]}</span>
      </div>
      <span className="text-[11px] text-red-300/70 shrink-0">❤️ {getFavCount(s.id)}</span>
      <a
        href={s.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/40 rounded-lg px-2.5 py-1.5"
        onClick={e => e.stopPropagation()}
      >
        지도 보기
      </a>
    </div>
  );
});

// ── HOT NOW 패널 (PC 사이드바용) ─────────────────────────────────
const HotNowPanel = React.memo(function HotNowPanel({ hotSpots, onSelect }: { hotSpots: Place[]; onSelect: (place: Place) => void }) {
  if (!hotSpots.length) return null;
  return (
    <div className="shrink-0 bg-black/50 border-t-4 border-orange-500 rounded-b-xl rounded-tr-xl overflow-hidden mt-2">
      <div className="bg-orange-900/35 px-3 py-2 border-b border-white/8 flex items-center gap-1.5">
        <span className="text-[13px]">🔥</span>
        <span className="text-[9.5px] font-black text-orange-300 uppercase tracking-[0.28em]">HOT NOW</span>
      </div>
      {hotSpots.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
          className="w-full px-3 py-2 border-b border-white/6 last:border-0 flex items-center gap-2 hover:bg-orange-900/20 active:bg-orange-900/30 transition-colors cursor-pointer text-left"
        >
          <span className={`text-[10px] font-black w-4 shrink-0 tabular-nums ${
            i === 0 ? 'text-orange-400' : i === 1 ? 'text-orange-500/60' : 'text-white/20'
          }`}>{i + 1}</span>
          <span className="text-[10.5px] font-bold text-white/75 flex-1 truncate">{s.name}</span>
          <span className="text-[9px] text-white/28 shrink-0">{s.region}</span>
        </button>
      ))}
    </div>
  );
});

// ── PlaceSheet — 드래그 가능한 응원 스팟 상세 ───────────────────
// 스냅 포인트: 38vh (기본) → 65vh (근처 스팟) → 90vh (전체)
const SNAP_VH = [38, 65, 90];

const PlaceSheet = React.memo(function PlaceSheet({ place, onClose, onSelectPlace, allSpots, favorites, onToggleFavorite, onShare, getFavCount }: {
  place: Place | null;
  onClose: () => void;
  onSelectPlace: (p: Place) => void;
  allSpots: Place[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onShare: (place: Place) => void;
  getFavCount: (id: string) => number;
}) {
  const [snapIdx, setSnapIdx] = React.useState(0);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const startY = React.useRef(0);

  React.useEffect(() => {
    if (place) setSnapIdx(0);
  }, [place?.id]);

  if (!place) return null;

  const wh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const baseH = (SNAP_VH[snapIdx] / 100) * wh;
  const currentH = Math.max(120, Math.min(wh * 0.94, baseH - dragOffset));

  const onHandleDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    setIsDragging(true);
  };
  const onHandleMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragOffset(e.clientY - startY.current);
  };
  const onHandleUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    const delta = e.clientY - startY.current;
    setDragOffset(0);
    if (delta > 70) {
      if (snapIdx === 0) onClose();
      else setSnapIdx(i => i - 1);
    } else if (delta < -70) {
      setSnapIdx(i => Math.min(i + 1, SNAP_VH.length - 1));
    }
  };

  const isExpanded = snapIdx >= 1;
  const chips: string[] = (place as any).hashtags?.length
    ? (place as any).hashtags
    : place.tags;
  const nearbySpots = allSpots
    .filter(s => s.region === place.region && s.id !== place.id)
    .slice(0, 3);

  return (
    <>
      {/* 배경 딤 — 모바일 전용 */}
      <div className="lg:hidden fixed inset-0 z-[400] bg-black/30" onClick={onClose} />

      {/* 시트 — 모바일 전용 */}
      <div
        className="lg:hidden fixed inset-x-0 bottom-0 z-[500]"
        style={{
          height: `${currentH}px`,
          transition: isDragging ? 'none' : 'height 0.38s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        <div className="h-full bg-[#0f0f0f] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-white/8">

          {/* ── 드래그 핸들 + 닫기 ── */}
          <div
            className="shrink-0 flex items-center pt-3 pb-2 px-4 cursor-grab active:cursor-grabbing touch-none select-none"
            onPointerDown={onHandleDown}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onPointerCancel={onHandleUp}
          >
            <div className="flex-1 flex justify-center">
              <div className="w-9 h-1.5 rounded-full bg-white/20" />
            </div>
            <button
              onClick={onClose}
              onPointerDown={(e) => e.stopPropagation()}
              className="pointer-events-auto w-8 h-8 flex items-center justify-center
                rounded-full bg-white/10 text-white/50 text-[14px] active:opacity-60 shrink-0"
            >
              ✕
            </button>
          </div>

          {/* ── 스크롤 콘텐츠 ── */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">

            {/* ── 기본 정보 ── */}
            <div className="px-5 pt-2">
              <span className="inline-block text-[11px] bg-red-600 text-white
                px-2.5 py-0.5 rounded-md font-black tracking-wide mb-2">
                {place.region}
              </span>
              <h2 className="text-[24px] font-black text-white leading-tight tracking-tight mb-2">
                {place.name}
              </h2>
              <div className="flex items-start gap-2 pb-3 border-b border-white/8">
                <span className="text-[14px] mt-0.5 shrink-0">📍</span>
                <p className="text-[13px] text-white/50 leading-relaxed">{place.address}</p>
              </div>

              {/* ❤️ 찜하기 + 🔗 공유하기 */}
              <div className="flex gap-2 py-3 border-b border-white/8">
                <button
                  onClick={() => onToggleFavorite(place.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-[44px] rounded-xl border font-bold text-[13px] active:opacity-60 transition-all
                    ${favorites.has(place.id)
                      ? 'bg-red-500/20 border-red-500/40 text-red-400'
                      : 'bg-white/6 border-white/12 text-white/55'}`}
                >
                  {favorites.has(place.id) ? '❤️' : '🤍'}
                  <span>{favorites.has(place.id) ? '찜됨' : '찜하기'}</span>
                  <span className={`tabular-nums font-black text-[14px] ${favorites.has(place.id) ? 'text-red-400' : 'text-white/30'}`}>
                    {getFavCount(place.id)}
                  </span>
                </button>
                <button
                  onClick={() => onShare(place)}
                  className="flex-1 flex items-center justify-center gap-1.5 h-[44px] rounded-xl border font-bold text-[13px] bg-white/6 border-white/12 text-white/55 active:opacity-60"
                >
                  🔗 공유하기
                </button>
              </div>

              {/* 화면 종류 */}
              {place.tags.length > 0 && (
                <div className="py-4 border-b border-white/8">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.18em] mb-2.5">
                    화면 종류
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/6 border border-white/10
                        rounded-xl px-3 py-2.5 min-h-[44px]">
                        <span className="text-[16px]">{tag === '빔프로젝터' ? '📽️' : '📺'}</span>
                        <span className="text-[13px] text-white/70 font-semibold">{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 해시태그 */}
              {chips.length > 0 && (
                <div className="py-4 border-b border-white/8">
                  <div className="flex flex-wrap gap-1.5">
                    {chips.map((tag, i) => (
                      <span key={i} className="text-[12px] bg-red-950/50 border border-red-700/30
                        text-red-300/75 px-2.5 py-1 rounded-full font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 네이버 지도 버튼 */}
              <div className="py-4">
                <a href={place.mapUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-red-600
                    text-white font-black text-[15px] rounded-2xl active:opacity-80 select-none
                    hover:bg-red-500 transition-colors">
                  🗺️ 네이버 지도에서 보기
                </a>
              </div>
            </div>

            {/* ── 확장 영역 (65%+ 스냅에서 표시) ── */}
            {isExpanded && (
              <div className="px-5">

                {/* 근처 응원 스팟 */}
                {nearbySpots.length > 0 && (
                  <div className="pb-5 border-t border-white/8 pt-4">
                    <p className="text-[11px] font-black text-white/35 uppercase tracking-[0.18em] mb-3">
                      🏟️ {place.region} 근처 응원 스팟
                    </p>
                    <div className="flex flex-col gap-2">
                      {nearbySpots.map(s => (
                        <button key={s.id}
                          onClick={() => onSelectPlace(s)}
                          className="flex items-center gap-3 bg-white/5 border border-white/8
                            rounded-2xl px-4 py-3 active:bg-white/10 transition-colors text-left min-h-[60px]">
                          <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-700/30
                            flex items-center justify-center shrink-0">
                            <span className="text-[15px]">📍</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-bold text-white truncate">{s.name}</p>
                            <p className="text-[11px] text-white/35 truncate mt-0.5">{s.address}</p>
                          </div>
                          <span className="text-white/20 text-[20px] shrink-0">›</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-6" />
              </div>
            )}

            {/* 위로 당겨 더보기 힌트 */}
            {snapIdx === 0 && (
              <div className="flex flex-col items-center py-5 text-white/20 select-none">
                <span className="text-[18px] mb-0.5">↑</span>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase">위로 당기면 더 볼 수 있어요</span>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
});

// ── ReportSheet (응원 스팟 제보 폼) ──────────────────────────────
function ReportSheet({ open, onClose }: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = React.useState('');
  const [region, setRegion] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !region.trim()) return;
    setSubmitting(true);
    try {
      const reportEmail = import.meta.env.VITE_REPORT_EMAIL;
      if (reportEmail) {
        await fetch(`https://formsubmit.co/ajax/${reportEmail}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: `[응원맵 제보] ${name.trim()} (${region.trim()})`,
            _captcha: 'false',
            업장명: name.trim(),
            지역: region.trim(),
            추천이유: reason.trim() || '(없음)',
            제출시간: new Date().toISOString(),
          }),
        });
      }
    } catch { /* 네트워크 오류 — 사용자에게 성공으로 표시 */ }
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setName(''); setRegion(''); setReason(''); setSubmitted(false); setSubmitting(false);
    onClose();
  };

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[600]" onClick={handleClose} />
      <div className="fixed inset-x-0 bottom-0 lg:inset-0 lg:flex lg:items-center lg:justify-center z-[700]">
        <div className="bg-[#111] rounded-t-3xl lg:rounded-2xl shadow-2xl w-full lg:max-w-md bottom-sheet">
          <div className="flex justify-center pt-3 pb-1 lg:hidden">
            <div className="w-9 h-1 rounded-full bg-white/20" />
          </div>
          <div className="px-5 pb-8 pt-3">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-black text-white">📍 응원 스팟 제보</h2>
              <button onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/50">
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <p className="text-[44px] mb-3">✅</p>
                <p className="text-[18px] font-black text-white mb-2">응원 스팟 제보가 접수되었습니다</p>
                <p className="text-[13px] text-white/50 leading-relaxed">
                  운영자가 확인 후 반영할 예정입니다.<br />소중한 제보 감사합니다!
                </p>
                <button onClick={handleClose}
                  className="mt-6 w-full py-4 bg-red-600 text-white font-black text-[15px] rounded-2xl active:opacity-80">
                  확인
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[12px] font-bold text-white/55 mb-1.5 block">
                    업장명 <span className="text-red-400">*</span>
                  </label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="예: 축구포차 홍대점" required
                    className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl
                      text-white text-[14px] placeholder-white/25 focus:outline-none
                      focus:border-red-500/60 min-h-[48px]" />
                </div>

                <div>
                  <label className="text-[12px] font-bold text-white/55 mb-1.5 block">
                    지역 <span className="text-red-400">*</span>
                  </label>
                  <input type="text" value={region} onChange={e => setRegion(e.target.value)}
                    placeholder="예: 성수동, 연남동, 수원 영통구" required
                    className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl
                      text-white text-[14px] placeholder-white/25 focus:outline-none
                      focus:border-red-500/60 min-h-[48px]" />
                </div>

                <div>
                  <label className="text-[12px] font-bold text-white/55 mb-1.5 block">
                    추천 이유 <span className="text-white/30">(선택)</span>
                  </label>
                  <textarea value={reason} onChange={e => setReason(e.target.value)}
                    placeholder="예: 대형 스크린, 월드컵 분위기 최고, 치맥 맛집" rows={3}
                    className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl
                      text-white text-[14px] placeholder-white/25 focus:outline-none
                      focus:border-red-500/60 resize-none" />
                </div>

                <p className="text-[11px] text-white/30 -mt-2">
                  * 위도/경도/주소는 운영자가 직접 확인 후 등록합니다.
                </p>

                <button type="submit" disabled={!name.trim() || !region.trim() || submitting}
                  className="w-full py-4 bg-red-600 text-white font-black text-[15px] rounded-2xl
                    disabled:opacity-35 active:opacity-80 min-h-[52px] transition-opacity">
                  {submitting ? '제출 중...' : '제보 제출'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── MobileInfoPanel (정보 탭) ────────────────────────────────────
function isUpcoming(f: Fixture) {
  return new Date(`${f.date}T${f.time}:00+09:00`) >= new Date();
}

const MobileInfoPanel = React.memo(function MobileInfoPanel({
  favorites,
  allSpots,
  onToggleFavorite,
  onOpenSpot,
  onOpenReport,
}: {
  favorites: Set<string>;
  allSpots: Place[];
  onToggleFavorite: (id: string) => void;
  onOpenSpot: (p: Place) => void;
  onOpenReport: () => void;
}) {
  const favSpots = allSpots.filter(s => favorites.has(s.id));

  return (
    <div className="flex flex-col pb-10" style={{ background: '#0d0000', minHeight: '100%' }}>

      {/* ❤️ 찜한 스팟 */}
      <section className="px-4 pt-5 pb-5 border-b border-white/8">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-[13px] font-black text-white tracking-wide">❤️ 찜한 스팟</h3>
          {favSpots.length > 0 && (
            <span className="text-[11px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full leading-none">
              {favSpots.length}
            </span>
          )}
        </div>
        {favSpots.length === 0 ? (
          <div className="flex flex-col items-center py-7 rounded-2xl border border-dashed border-white/10">
            <span className="text-[28px] mb-2">🤍</span>
            <p className="text-[13px] text-white/40 font-semibold">아직 찜한 스팟이 없어요</p>
            <p className="text-[11px] text-white/25 mt-1">장소 상세에서 ❤️ 를 눌러 저장하세요</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {favSpots.map(s => (
              <div key={s.id}
                className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3 min-h-[64px]"
              >
                <button onClick={() => onOpenSpot(s)} className="flex-1 min-w-0 text-left active:opacity-70">
                  <p className="text-[10px] font-black text-red-400 mb-0.5">{s.region}</p>
                  <p className="text-[15px] font-bold text-white leading-tight truncate">{s.name}</p>
                  <p className="text-[11px] text-white/35 truncate mt-0.5">{s.address}</p>
                </button>
                <button
                  onClick={() => onToggleFavorite(s.id)}
                  className="shrink-0 w-10 h-10 flex items-center justify-center text-[20px] rounded-full active:bg-white/10 transition-colors"
                  aria-label="찜 해제"
                >
                  ❤️
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 📅 경기 일정 — 지난 경기 자동 제거 */}
      <section className="px-4 pt-5 pb-5 border-b border-white/8">
        <h3 className="text-[13px] font-black text-white tracking-wide mb-3">📅 경기 일정</h3>
        {(() => {
          const koreaMatches = FIXTURES.filter(f => f.featured && isUpcoming(f));
          const otherMatches = FIXTURES.filter(f => !f.featured && isUpcoming(f)).slice(0, 4);
          return (
            <>
              {koreaMatches.map((f, i) => (
                <div key={i} className="rounded-2xl px-4 py-3.5 bg-red-950/55 border border-red-500/35 mb-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-red-400 tracking-wider">🇰🇷 KOREA MATCH</span>
                    <span className="text-[10px] text-white/35 font-mono">{fmtDate(f.date)} {f.time} KST</span>
                  </div>
                  <p className="text-[16px] font-black text-white">
                    {flagEmoji(f.homeFlag)} {f.home} <span className="text-white/30 font-normal text-[14px]">vs</span> {f.away} {flagEmoji(f.awayFlag)}
                  </p>
                </div>
              ))}
              {koreaMatches.length === 0 && (
                <p className="text-[12px] text-white/30 mb-3">예정된 한국 경기가 없습니다</p>
              )}
              <div className="flex flex-col gap-2">
                {otherMatches.map((f, i) => (
                  <div key={i} className="rounded-xl px-4 py-2.5 bg-white/4 border border-white/8">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-white/65">
                        {flagEmoji(f.homeFlag)} {f.home} <span className="text-white/25">vs</span> {f.away} {flagEmoji(f.awayFlag)}
                      </p>
                      <span className="text-[10px] text-white/30 font-mono shrink-0 ml-2">{f.time}</span>
                    </div>
                    <p className="text-[10px] text-white/25 mt-0.5">{fmtDate(f.date)}</p>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </section>

      {/* 📍 스팟 제보 */}
      <section className="px-4 pt-5">
        <h3 className="text-[13px] font-black text-white tracking-wide mb-2">📍 응원 스팟 제보</h3>
        <p className="text-[12px] text-white/40 leading-relaxed mb-4">
          아직 지도에 없는 응원 스팟을 알고 계신가요?<br />
          제보해 주시면 검토 후 등록합니다.
        </p>
        <button
          onClick={onOpenReport}
          className="w-full py-4 bg-red-600 text-white font-black text-[15px] rounded-2xl active:opacity-80 transition-colors"
        >
          ➕ 스팟 제보하기
        </button>
      </section>
    </div>
  );
});

// ── PlaceList (목록 보기 — 모바일 전용) ──────────────────────────
const PlaceList = React.memo(function PlaceList({ places, onSelect, favorites, onToggleFavorite, onShare, getFavCount }: {
  places: Place[];
  onSelect: (place: Place) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onShare: (place: Place) => void;
  getFavCount: (id: string) => number;
}) {
  const [sortBy, setSortBy] = React.useState<'default' | 'popular' | 'latest'>('default');

  const sorted = React.useMemo(() => {
    const arr = [...places];
    if (sortBy === 'popular') return arr.sort((a, b) => getFavCount(b.id) - getFavCount(a.id));
    if (sortBy === 'latest')  return arr.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    return arr;
  }, [places, sortBy, getFavCount]);

  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/35">
        <p className="text-[16px] mb-1">검색 결과가 없습니다</p>
        <p className="text-[13px]">다른 검색어를 입력해 보세요</p>
      </div>
    );
  }
  return (
    <div className="px-3 pt-2 pb-4 flex flex-col gap-2">
      {/* 정렬 탭 */}
      <div className="flex items-center justify-between px-1 mb-1">
        <p className="text-[11px] text-white/40 font-bold tracking-wider uppercase">{places.length}개 장소</p>
        <div className="flex gap-1">
          {(['default', 'popular', 'latest'] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                sortBy === s ? 'bg-red-600 text-white' : 'bg-white/8 text-white/45 active:bg-white/15'
              }`}
            >
              {s === 'default' ? '기본' : s === 'popular' ? '❤️ 인기' : '최신'}
            </button>
          ))}
        </div>
      </div>

      {sorted.map((place) => (
        <button
          key={place.id}
          onClick={() => onSelect(place)}
          className={`w-full text-left rounded-2xl p-4 transition-colors min-h-[76px] ${
            place.isSponsored
              ? 'bg-amber-950/40 border-2 border-amber-400/60 active:bg-amber-900/50'
              : 'bg-black/50 border border-white/10 active:bg-red-950/60 active:border-red-700/50'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                {place.isSponsored && place.badge && (
                  <span className="text-[9px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded font-black shrink-0">
                    ⭐ {place.badge}
                  </span>
                )}
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold shrink-0">
                  {place.region}
                </span>
              </div>
              <p className="text-[16px] font-black text-white leading-tight truncate">{place.name}</p>
              <p className="text-[12px] text-white/45 mt-0.5 truncate">{place.address}</p>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(place.id); }}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl active:bg-white/10 transition-colors min-w-[36px]"
                aria-label="찜하기"
              >
                <span className="text-[17px] leading-none">{favorites.has(place.id) ? '❤️' : '🤍'}</span>
                <span className={`text-[10px] font-bold tabular-nums leading-none ${favorites.has(place.id) ? 'text-red-400' : 'text-white/35'}`}>
                  {getFavCount(place.id)}
                </span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onShare(place); }}
                className="w-8 h-8 flex items-center justify-center text-[14px] rounded-full active:bg-white/10 transition-colors"
                aria-label="공유하기"
              >
                🔗
              </button>
            </div>
          </div>
          {place.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {place.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-[10px] bg-white/8 text-white/50 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
});

// ── 위치 사용 안내 카드 ────────────────────────────────────────
function LocationPrompt({ onAllow, onDismiss }: { onAllow: () => void; onDismiss: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[900] pointer-events-none">
      <div
        className="pointer-events-auto mx-auto max-w-sm px-4"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))' }}
      >
        <div
          className="bottom-sheet rounded-2xl"
          style={{
            background: 'rgba(10,0,0,0.97)',
            border: '1px solid rgba(255,255,255,0.13)',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          <div className="px-5 pt-5 pb-2">
            <div className="flex items-start gap-3.5">
              <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-2xl"
                style={{ background: 'rgba(220,38,38,0.18)', border: '1px solid rgba(220,38,38,0.25)' }}>
                ⚽
              </div>
              <div>
                <p className="text-[15px] font-black text-white leading-snug mb-1.5">
                  내 주변 응원 스팟을 찾아볼까요?
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.50)' }}>
                  현재 위치를 사용하면 가장 가까운<br />응원 장소를 바로 확인할 수 있어요.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 pt-3 pb-5">
            <button
              onClick={onAllow}
              className="flex-1 text-white font-black text-[13px] rounded-xl py-3 transition-all active:scale-[0.97]"
              style={{ background: '#DC2626' }}
            >
              📍 위치 사용하기
            </button>
            <button
              onClick={onDismiss}
              className="shrink-0 px-4 py-3 font-bold text-[13px] transition-colors"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              나중에
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [mobilePlace, setMobilePlace] = useState<Place | null>(null);
  const [listView, setListView] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [focusCoords, setFocusCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string, ms = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }, []);

  // 위치 안내 프롬프트 — 최초 방문 시 1회 표시
  useEffect(() => {
    if (!localStorage.getItem('hasSeenLocationPrompt')) {
      const t = setTimeout(() => setShowLocationPrompt(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  const doGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      showToast('이 브라우저에서는 위치 서비스를 지원하지 않습니다');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setFocusCoords(loc);
      },
      () => showToast('위치 권한이 필요합니다. 브라우저 주소창 옆 🔒 아이콘을 확인해주세요.', 4000),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [showToast]);

  const handleAllowLocation = useCallback(() => {
    localStorage.setItem('hasSeenLocationPrompt', 'true');
    setShowLocationPrompt(false);
    doGeolocate();
  }, [doGeolocate]);

  const handleDismissLocation = useCallback(() => {
    localStorage.setItem('hasSeenLocationPrompt', 'true');
    setShowLocationPrompt(false);
  }, []);

  // 찜한 스팟 — localStorage 영속
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const s = localStorage.getItem('wm-favorites');
      return s ? new Set(JSON.parse(s) as string[]) : new Set<string>();
    } catch { return new Set<string>(); }
  });
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem('wm-favorites', JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  // 찜 수 — 시드(likes) + 현재 사용자의 찜 여부 (+1)
  const getFavCount = useCallback((id: string) => {
    const spot = (spots as any[]).find(s => s.id === id);
    const seed = spot?.likes ?? Math.floor((spot?.views || 0) * 0.31);
    return seed + (favorites.has(id) ? 1 : 0);
  }, [favorites]);

  // 공유
  const shareSpot = useCallback(async (place: Place) => {
    const text = `월드컵 응원 여기서 보자 ⚽\n${place.name}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: place.name, text, url: place.mapUrl });
      } else {
        await navigator.clipboard.writeText(`${text}\n${place.mapUrl}`);
        showToast('링크가 복사되었습니다 🔗', 2200);
      }
    } catch { /* 사용자 취소 등 무시 */ }
  }, [showToast]);
  // 세션 조회수 — 마커/목록 클릭 시 +1 (향후 DB 연동 시 교체)
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // HOT NOW 고정 명단 — 디슬로 건대(광고) 1위, 나머지 순서 고정
  const HOT_FIXED_IDS = ['87', '76', '66', '18'];  // 이유없는한잔, 비기스, 디슬로 건대, 호멜맥주
  const hotSpots = useMemo(() => {
    const allPlaces = spots as unknown as Place[];
    return HOT_FIXED_IDS
      .map(id => allPlaces.find(s => s.id === id))
      .filter((s): s is Place => s != null);
  }, []);

  // ── 검색 / 지역 필터 상태 ──────────────────────────────────────
  // searchInput: 입력창 즉시 반영, debouncedSearch: 300ms 후 마커/목록 필터에 적용
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('전체');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // 검색어 + 생활권 필터 (지도 마커 · 목록 공용)
  // 광고 스팟은 지역 필터 무관 항상 포함, priority 내림차순으로 최상단 고정
  const displayedSpots = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    const members = selectedRegion !== '전체' ? (REGION_GROUPS[selectedRegion] ?? []) : null;

    const filtered = spots.filter((spot) => {
      if (!spot.isSponsored && members && !members.includes(spot.region)) return false;
      if (!q) return true;
      return (
        spot.name.toLowerCase().includes(q) ||
        spot.address.toLowerCase().includes(q) ||
        spot.region.toLowerCase().includes(q)
      );
    });

    return filtered.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }, [debouncedSearch, selectedRegion]);

  // 지역 탭 클릭 → 지도 중심 이동 (mapCenter), 지도 뷰 유지
  const mapCenter = (REGION_CENTERS as Record<string, { lat: number; lng: number; level: number } | null>)[selectedRegion] ?? null;

  const handleRegionSelect = useCallback((region: string) => {
    setSelectedRegion(region);
    setListView(false);
    setInfoOpen(false);
  }, []);

  const handlePlaceSelect = useCallback((p: Place | null) => {
    if (p) {
      setViewCounts(prev => ({ ...prev, [p.id]: (prev[p.id] || 0) + 1 }));
      setListView(false);
    }
    setMobilePlace(p);
  }, []);

  const handlePlaceClose = useCallback(() => setMobilePlace(null), []);
  const handlePlaceSelectFromSheet = useCallback((p: Place) => setMobilePlace(p), []);

  const handleListSelect = useCallback((place: Place) => {
    setViewCounts(prev => ({ ...prev, [place.id]: (prev[place.id] || 0) + 1 }));
    setMobilePlace(place);
    setListView(false);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="app-root h-screen text-white flex flex-col font-sans overflow-hidden" style={{ background: '#7a0000' }}>

      {/* ════════════════════════════════════════
          히어로 헤더 — 반응형 (모바일 90px / 태블릿 120px / 데스크탑 168px)
      ════════════════════════════════════════ */}
      <header
        className="hero-header shrink-0 relative overflow-hidden h-[130px] lg:h-[168px]"
        style={{
          backgroundImage: 'url(/background/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

        {/* ── 선수 Radial Glow ── */}
        <div className="absolute pointer-events-none" style={{
          top: '10px', left: 'calc(50% - 290px)',
          width: '240px', height: '260px',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,60,60,0.50) 0%, transparent 65%)',
          filter: 'blur(80px)', zIndex: 4,
        }} />
        <div className="absolute pointer-events-none" style={{
          top: '10px', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '300px',
          background: 'radial-gradient(ellipse at 50% 28%, rgba(255,60,60,0.45) 0%, transparent 62%)',
          filter: 'blur(100px)', zIndex: 9,
        }} />
        <div className="absolute pointer-events-none" style={{
          top: '10px', right: 'calc(50% - 278px)',
          width: '240px', height: '260px',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,60,60,0.50) 0%, transparent 65%)',
          filter: 'blur(80px)', zIndex: 4,
        }} />

        {/* ── 선수 이미지 ── */}

        {/* 손흥민 — 중앙 */}
        <div className="hero-son-wrapper absolute" style={{ top: '5px', left: '50%', transform: 'translateX(-50%)', zIndex: 11 }}>
          <img src="/players/son-2.png" alt="손흥민" style={{
            height: '230px', width: 'auto', opacity: 1.0,
            mixBlendMode: 'multiply',
            filter: 'drop-shadow(0px 4px 18px rgba(0,0,0,0.85))',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 18%), linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 18%), linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
            WebkitMaskComposite: 'destination-in',
            maskComposite: 'intersect',
          }} />
        </div>

        {/* 이강인 — 좌측 (손흥민보다 앞 레이어, 얼굴 가림 방지) */}
        <div className="absolute player-side-img" style={{ top: '14px', left: 'calc(50% - 318px)', zIndex: 14 }}>
          <img src="/players/lee-2.png" alt="이강인" style={{
            height: '232px', width: 'auto', opacity: 0.98,
            filter: 'drop-shadow(0px 4px 18px rgba(0,0,0,0.85))',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
          }} />
        </div>

        {/* 조규성 — 우측 (82px 좌측 이동, 머리 온전히 노출) */}
        <div className="absolute player-side-img" style={{ top: '14px', right: 'calc(50% - 310px)', zIndex: 8 }}>
          <img src="/players/cho-2.png" alt="조규성" style={{
            height: '370px', width: 'auto', opacity: 0.98,
            filter: 'drop-shadow(0px 4px 18px rgba(0,0,0,0.85))',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
          }} />
        </div>

        {/* 텍스트 가독성 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/48 via-transparent to-black/48 pointer-events-none" style={{ zIndex: 15 }} />
        <div className="absolute top-0 left-0 right-0 h-[20px] bg-gradient-to-b from-black/25 to-transparent pointer-events-none" style={{ zIndex: 15 }} />
        <div className="absolute bottom-0 left-0 right-0 h-[27px] bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" style={{ zIndex: 15 }} />

        {/* ── 텍스트 콘텐츠 (z-20) ── */}
        <div className="relative flex flex-col justify-between h-full px-5 pt-2 pb-1.5 md:px-7" style={{ zIndex: 20 }}>

          {/* 상단: 타이틀 + 카운트다운 */}
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* ── 브랜드 로고 ── */}
              <div className="relative" style={{ userSelect: 'none', lineHeight: 1 }}>

                {/* 브러시 스트로크 SVG */}
                <svg
                  aria-hidden="true"
                  className="absolute pointer-events-none logo-brush"
                  style={{ top: '-3px', left: '-8px', width: '240px', height: '62px', overflow: 'visible' }}
                  viewBox="0 0 320 82"
                >
                  <defs>
                    <filter id="brush-rough" x="-8%" y="-40%" width="116%" height="180%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.040 0.016" numOctaves="3" seed="7" result="n"/>
                      <feDisplacementMap in="SourceGraphic" in2="n" scale="8" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                  </defs>
                  {/* 메인 브러시 스트로크 */}
                  <path
                    d="M0,54 C32,28 72,20 122,30 C172,40 205,24 250,16 C266,13 288,11 318,9
                       L319,34 C289,36 267,38 251,41 C206,50 173,66 123,56 C73,46 33,54 1,80 Z"
                    fill="rgba(255,255,255,0.85)"
                    filter="url(#brush-rough)"
                  />
                  {/* 보조 얇은 스트로크 */}
                  <path
                    d="M-3,18 C22,12 56,8 96,12 C136,16 162,8 198,4 L200,13
                       C164,17 138,25 98,21 C58,17 24,21 -1,27 Z"
                    fill="rgba(255,255,255,0.20)"
                    filter="url(#brush-rough)"
                  />
                </svg>

                {/* 로고 텍스트 */}
                <div className="relative flex items-baseline" style={{ gap: '2px' }}>
                  {/* 응원 — 흰색 */}
                  <span className="logo-text-span" style={{
                    fontFamily: "'Black Han Sans', 'Noto Sans KR', sans-serif",
                    fontSize: '52px',
                    color: '#FFFFFF',
                    lineHeight: 1,
                    letterSpacing: '-0.01em',
                    textShadow: [
                      '2px 2px 0 #080000',
                      '3px 3px 0 #080000',
                      '4px 4px 0 #080000',
                      '5px 5px 0 #080000',
                      '6px 6px 0 #080000',
                      '7px 8px 15px rgba(0,0,0,0.92)',
                      '0 0 35px rgba(255,255,255,0.18)',
                    ].join(', '),
                  }}>응원</span>
                  {/* 맵 — 붉은색 */}
                  <span className="logo-text-span" style={{
                    fontFamily: "'Black Han Sans', 'Noto Sans KR', sans-serif",
                    fontSize: '52px',
                    color: '#FF1A1A',
                    lineHeight: 1,
                    letterSpacing: '-0.01em',
                    textShadow: [
                      '2px 2px 0 #080000',
                      '3px 3px 0 #080000',
                      '4px 4px 0 #080000',
                      '5px 5px 0 #080000',
                      '6px 6px 0 #080000',
                      '7px 8px 15px rgba(0,0,0,0.92)',
                      '0 0 30px rgba(255,30,30,0.65)',
                    ].join(', '),
                  }}>맵</span>
                </div>
              </div>

              <p
                className="text-[10px] text-red-100/80 mt-1 font-semibold tracking-[0.14em]"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  textShadow: '0 1px 10px rgba(0,0,0,0.92)',
                }}
              >
                대한민국 축구 중계 스팟 찾기
              </p>
            </div>

          </div>

          {/* 하단: 서브텍스트 */}
          <div className="flex items-end justify-between">
            <p
              className="text-[11px] font-black text-white tracking-tight"
              style={{ textShadow: '0 1px 12px rgba(0,0,0,0.98)' }}
            >
              서울 전역 응원스팟 모음
            </p>
            <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-bold pb-0.5">
              FIFA World Cup 2026
            </p>
          </div>

        </div>
      </header>

      {/* ⭐ 추천 응원 스팟 배너 — 모바일 + PC, 3초 순환 */}
      <RotatingSponsoredBanner
        getFavCount={getFavCount}
        onSelect={(place) => {
          setMobilePlace(place);
          setListView(false);
          if (place.lat != null && place.lng != null) {
            setFocusCoords({ lat: place.lat, lng: place.lng });
          }
        }}
      />

      {/* ═══ 모바일 전용: 검색창 + 목록보기 + 지역 필터 바 ═══ */}
      <div className="lg:hidden shrink-0 bg-[#0d0000] border-b border-white/8">
        {/* 검색 + 목록보기 버튼 */}
        <div className="flex items-center gap-2 px-3 pt-1 pb-0.5 landscape-search-row">
          <div className="flex-1">
            <SearchBar value={searchInput} onChange={setSearchInput} />
          </div>
          <button
            onClick={() => setListView(v => !v)}
            className={[
              'shrink-0 flex items-center gap-1.5 px-3 rounded-xl font-bold text-[12px]',
              'border min-h-[44px] min-w-[76px] justify-center transition-colors active:opacity-75',
              listView
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-white/10 border-white/20 text-white/80',
            ].join(' ')}
          >
            {listView ? '🗺️ 지도' : '≡ 목록'}
          </button>
        </div>
        {/* 지역 필터 */}
        <div className="px-2 pb-1 landscape-filter-row">
          <RegionFilter regions={REGIONS} selected={selectedRegion} onSelect={handleRegionSelect} />
        </div>
      </div>

      {/* 메인 — 지도 또는 목록 */}
      <main className="flex-1 min-h-0 relative overflow-hidden flex flex-col" style={{ background: '#7a0000' }}>

        {/* 배경 장식 (데스크탑) */}
        <div className="absolute inset-0 pointer-events-none select-none hidden lg:block" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-black/22 via-transparent to-black/32" />
          <div className="absolute left-0 top-0 bottom-0 w-[28%] bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-[28%] bg-gradient-to-l from-black/35 via-black/10 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-[30%] opacity-[0.12]"
            style={{ backgroundImage: 'repeating-linear-gradient(-52deg, #EA580C 0px, #EA580C 10px, transparent 10px, transparent 36px, #EA580C 36px, #EA580C 44px, transparent 44px, transparent 66px)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-[30%] opacity-[0.13]"
            style={{ backgroundImage: 'radial-gradient(circle, #ff8888 2px, transparent 2px)', backgroundSize: '22px 22px' }} />
          <div className="absolute left-[0%] top-1/2 -translate-y-[48%]">
            <TigerSVG className="w-44 h-44 xl:w-56 xl:h-56 opacity-[0.40]" />
          </div>
          <div className="absolute right-[0%] top-1/2 -translate-y-1/2">
            <TaegukSVG className="w-40 h-40 xl:w-52 xl:h-52 opacity-[0.38]" />
          </div>
        </div>

        {/* 콘텐츠 — 모바일: 패딩 없이 꽉 채움 / 데스크탑: 패딩+사이드바 */}
        <div className="main-content-wrap relative z-10 flex-1 min-h-0 flex items-stretch p-0 lg:p-5 gap-0 lg:gap-4">

          {/* 경기 일정 패널 + HOT NOW — 데스크탑만 */}
          <div className="hidden lg:flex flex-col gap-2 w-[185px] xl:w-[200px] shrink-0">

            {/* 광고 스팟 — 최상단 고정 */}
            {spots.filter(s => s.isSponsored).map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setMobilePlace(s as unknown as Place);
                  if (s.lat != null && s.lng != null) setFocusCoords({ lat: s.lat, lng: s.lng });
                }}
                className="shrink-0 w-full text-left rounded-xl overflow-hidden border-2 border-amber-400/65 transition-all hover:border-amber-400 active:opacity-80"
                style={{ background: 'rgba(120,53,15,0.25)' }}
              >
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-amber-400/25"
                  style={{ background: 'rgba(245,158,11,0.18)' }}>
                  <span className="text-[10px] font-black text-amber-300 tracking-wide">⭐ {s.badge || '추천 스팟'}</span>
                </div>
                <div className="px-2.5 py-2">
                  <p className="text-[13px] font-black text-white leading-tight">{s.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.region} · {s.address.slice(0, 14)}…</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {s.tags.map((t, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(245,158,11,0.2)', color: 'rgba(253,230,138,0.9)' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}

            <div className="flex-1 min-h-0 flex flex-col">
              <MatchSchedulePanel
                selectedMatch={selectedFixture}
                onSelectMatch={setSelectedFixture}
                venueCount={displayedSpots.length}
              />
            </div>
            <HotNowPanel hotSpots={hotSpots} onSelect={(place) => {
              setMobilePlace(place);
              if (place.lat != null && place.lng != null) {
                setFocusCoords({ lat: place.lat, lng: place.lng });
              }
            }} />
          </div>

          {/* 지도/목록 영역 */}
          <div className="flex-1 min-w-0 flex flex-col gap-0">

            {/* 검색창 헤더 — 데스크탑만 */}
            <div className="hidden lg:block shrink-0 rounded-t-xl px-3 py-2 border-t-2 border-x-2 border-red-400/48"
              style={{ background: 'rgba(0,0,0,0.42)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-black text-white tracking-wider uppercase">
                  {infoOpen ? '정보 & 제보' : '서울 응원 스팟 지도'}
                </p>
                <div className="flex items-center gap-2">
                  {!infoOpen && (
                    <p className="text-[10px] text-red-300/60 font-bold tabular-nums">{displayedSpots.length}개 장소</p>
                  )}
                  <button
                    onClick={() => setInfoOpen(v => !v)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                      infoOpen
                        ? 'bg-red-600/80 text-white'
                        : 'bg-white/10 text-white/55 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {infoOpen ? '✕ 닫기' : 'ℹ️ 정보'}
                  </button>
                </div>
              </div>
              {!infoOpen && <SearchBar value={searchInput} onChange={setSearchInput} />}
            </div>

            {/* 지도 — 목록/정보 탭에서 숨김 */}
            <div className={`flex-1 min-h-0 lg:border-x-2 lg:border-b-2 border-red-400/48
              lg:rounded-t-none overflow-hidden relative
              ${infoOpen ? 'hidden' : listView ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}`}>
              <MapView places={displayedSpots} mapCenter={mapCenter} focusCoords={focusCoords} onPlaceSelect={handlePlaceSelect} userLocation={userLocation} hotSpotIds={HOT_FIXED_IDS} />

              {/* 지역 필터 오버레이 — 데스크탑만 */}
              <div className="hidden lg:block absolute top-2.5 left-2.5 right-2.5 pointer-events-none" style={{ zIndex: 200 }}>
                <div className="inline-flex max-w-full bg-black/60 backdrop-blur-sm rounded-xl px-2 py-1.5
                  pointer-events-auto overflow-x-auto" style={{ scrollbarWidth: 'none' } as React.CSSProperties}>
                  <RegionFilter regions={REGIONS} selected={selectedRegion} onSelect={handleRegionSelect} />
                </div>
              </div>

              {/* 내 위치 버튼 — 항상 표시 */}
              <button
                onClick={doGeolocate}
                className="absolute bottom-4 right-4 flex items-center gap-2 font-bold text-[12px] rounded-xl px-3.5 py-2.5 transition-all active:scale-[0.95] hover:brightness-125"
                style={{
                  zIndex: 200,
                  background: 'rgba(0,0,0,0.78)',
                  border: `1px solid ${userLocation ? 'rgba(96,165,250,0.45)' : 'rgba(255,255,255,0.18)'}`,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
                  color: userLocation ? '#60A5FA' : 'rgba(255,255,255,0.85)',
                }}
                aria-label="내 위치로 이동"
              >
                <span
                  className="shrink-0 rounded-full"
                  style={{
                    width: 10, height: 10,
                    background: userLocation ? '#3B82F6' : 'rgba(255,255,255,0.4)',
                    boxShadow: userLocation ? '0 0 0 2px rgba(59,130,246,0.35)' : 'none',
                  }}
                />
                내 위치
              </button>

              {/* 검색 결과 없음 */}
              {displayedSpots.length === 0 && debouncedSearch.trim() && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 100 }}>
                  <div className="bg-black/72 border border-white/12 rounded-xl px-5 py-3.5 text-center">
                    <p className="text-[13px] font-bold text-white/80">검색 결과가 없습니다</p>
                    <p className="text-[11px] text-white/40 mt-1">다른 검색어를 입력해 보세요</p>
                  </div>
                </div>
              )}
            </div>

            {/* 목록 보기 — 모바일 전용 */}
            {listView && !infoOpen && (
              <div className="lg:hidden flex-1 min-h-0 overflow-y-auto" style={{ background: '#0d0000' }}>
                <PlaceList
                  places={displayedSpots}
                  onSelect={handleListSelect}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onShare={shareSpot}
                  getFavCount={getFavCount}
                />
              </div>
            )}

            {/* 정보 탭 — 모바일 + 데스크탑 */}
            {infoOpen && (
              <div className="flex-1 min-h-0 overflow-y-auto lg:border-x-2 lg:border-b-2 border-red-400/48 lg:rounded-b-xl" style={{ background: '#0d0000' }}>
                <MobileInfoPanel
                  favorites={favorites}
                  allSpots={spots as unknown as Place[]}
                  onToggleFavorite={toggleFavorite}
                  onOpenSpot={(p) => { setMobilePlace(p); }}
                  onOpenReport={() => setReportOpen(true)}
                />
              </div>
            )}

          </div>
        </div>
      </main>

      {/* PlaceSheet — 전 플랫폼 드래그 가능 상세 */}
      <PlaceSheet
        place={mobilePlace}
        onClose={handlePlaceClose}
        onSelectPlace={handlePlaceSelectFromSheet}
        allSpots={spots as unknown as Place[]}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onShare={shareSpot}
        getFavCount={getFavCount}
      />

      {/* 모바일 하단 탭 바 */}
      <nav className="lg:hidden shrink-0 flex items-stretch bg-[#0d0000]/98 border-t border-white/10 mobile-bottom-nav"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <button
          onClick={() => { setListView(false); setInfoOpen(false); }}
          className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px]
            transition-colors ${!listView && !infoOpen ? 'text-red-500' : 'text-white/35'}`}
        >
          <span className="text-[22px]">🗺️</span>
          <span className="text-[10px] font-bold tracking-wide">지도</span>
        </button>
        <button
          onClick={() => { setListView(true); setInfoOpen(false); }}
          className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px]
            transition-colors ${listView && !infoOpen ? 'text-red-500' : 'text-white/35'}`}
        >
          <span className="text-[22px]">⚽</span>
          <span className="text-[10px] font-bold tracking-wide">응원 스팟</span>
        </button>
        <button
          onClick={() => { setInfoOpen(true); setListView(false); }}
          className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[56px]
            transition-colors ${infoOpen ? 'text-red-500' : 'text-white/35'}`}
        >
          <span className="text-[22px]">ℹ️</span>
          <span className="text-[10px] font-bold tracking-wide">정보</span>
        </button>
      </nav>

      {/* 스팟 제보 모달 */}
      <ReportSheet
        open={reportOpen}
        onClose={() => setReportOpen(false)}
      />

      {/* 위치 사용 안내 프롬프트 — 최초 방문 시 */}
      {showLocationPrompt && (
        <LocationPrompt onAllow={handleAllowLocation} onDismiss={handleDismissLocation} />
      )}

      {/* 공유/찜 토스트 */}
      {toast && (
        <div className="lg:hidden fixed bottom-24 left-4 right-4 z-[800] flex justify-center pointer-events-none">
          <div className="bg-zinc-800/95 text-white text-[13px] font-bold px-5 py-2.5 rounded-full shadow-xl border border-white/10 backdrop-blur-sm">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
