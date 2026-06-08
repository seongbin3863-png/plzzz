import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Compass, Plus, Minus } from 'lucide-react';

export interface Place {
  id: string;
  name: string;
  region: string;
  address: string;
  lat?: number;
  lng?: number;
  tags: string[];
  mapUrl: string;
  images?: string[];
  hashtags?: string[];
}

export interface MapCenter {
  lat: number;
  lng: number;
  level: number;
}

interface MapViewProps {
  places: Place[];
  mapCenter?: MapCenter | null;
  focusCoords?: { lat: number; lng: number } | null;
  onPlaceSelect?: (place: Place | null) => void;
  userLocation?: { lat: number; lng: number } | null;
}

declare global {
  interface Window { kakao: any; }
}

const DEFAULT_CENTER: MapCenter = { lat: 37.5559, lng: 126.9341, level: 7 };

const MARKER_SVG = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42">
    <path d="M18 0C8.059 0 0 8.059 0 18c0 14 18 24 18 24s18-10 18-24c0-9.941-8.059-18-18-18z"
      fill="#EF4444" stroke="#FFFFFF" stroke-width="2"/>
    <circle cx="18" cy="16" r="10" fill="white"/>
    <path d="M18 9 L21 11.5 L20 15 L16 15 L15 11.5Z" fill="#111"/>
    <path d="M21 11.5 L24.5 10.5 L25.5 14.5 L23 17 L20 15Z" fill="#111"/>
    <path d="M15 11.5 L11.5 10.5 L10.5 14.5 L13 17 L16 15Z" fill="#111"/>
    <path d="M23 17 L25.5 20 L23 22.5 L20 21.5 L20 17Z" fill="#111"/>
    <path d="M13 17 L10.5 20 L13 22.5 L16 21.5 L16 17Z" fill="#111"/>
    <path d="M16 21.5 L20 21.5 L21 24 L18 24.5 L15 24Z" fill="#111"/>
  </svg>
`);

const MapViewBase: React.FC<MapViewProps> = ({ places, mapCenter, focusCoords, onPlaceSelect, userLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const currentInfoWindowRef = useRef<any>(null);
  const mapCenterRef = useRef<MapCenter | null>(null);
  const userLocationOverlayRef = useRef<any>(null);

  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // 최신 mapCenter를 ref에 동기화 (마커 effect의 deps에 포함 안 해도 최신값 접근 가능)
  mapCenterRef.current = mapCenter ?? null;

  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  // ── Effect 1: Kakao 스크립트 로드 ──────────────────────────────
  useEffect(() => {
    if (!apiKey) { setLoadError(true); return; }
    if (window.kakao?.maps) { setIsKakaoLoaded(true); return; }

    const scriptId = 'kakao-map-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
    }

    const onLoad = () => {
      window.kakao?.maps?.load(() => {
        setIsKakaoLoaded(true);
        setLoadError(false);
      });
    };
    const onError = () => setLoadError(true);

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
    return () => {
      script!.removeEventListener('load', onLoad);
      script!.removeEventListener('error', onError);
    };
  }, [apiKey]);

  // ── Effect 2: 지도 초기화 (1회만) ────────────────────────────
  useEffect(() => {
    if (!isKakaoLoaded || !mapContainerRef.current || kakaoMapRef.current) return;

    const map = new window.kakao.maps.Map(mapContainerRef.current, {
      center: new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
      level: DEFAULT_CENTER.level,
    });
    kakaoMapRef.current = map;

    window.kakao.maps.event.addListener(map, 'click', () => {
      currentInfoWindowRef.current?.close();
      currentInfoWindowRef.current = null;
      setSelectedPlace(null);
      onPlaceSelect?.(null);
    });
  }, [isKakaoLoaded]);

  // ── Effect 3: 마커 업데이트 (places 변경 시) ─────────────────
  useEffect(() => {
    if (!isKakaoLoaded || !kakaoMapRef.current) return;
    const map = kakaoMapRef.current;

    // 기존 마커 제거 및 인포창 닫기
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    currentInfoWindowRef.current?.close();
    currentInfoWindowRef.current = null;
    setSelectedPlace(null);

    const imageSize = new window.kakao.maps.Size(36, 42);
    const imageOption = { offset: new window.kakao.maps.Point(18, 42) };
    const markerImage = new window.kakao.maps.MarkerImage(
      `data:image/svg+xml;charset=utf-8,${MARKER_SVG}`,
      imageSize,
      imageOption
    );

    // 좌표가 확보된 스팟만 마커 생성 (좌표 미확보 스팟은 추후 보강)
    const locatedPlaces = places.filter((p) => p.lat != null && p.lng != null);

    console.group(`[MapView] 마커 생성 분석 — 전체 ${places.length}개`);
    console.log('좌표 확보(마커 생성):', locatedPlaces.length, '개');
    console.log('좌표 없음(건너뜀):', places.length - locatedPlaces.length, '개');
    locatedPlaces.forEach((p) =>
      console.log(`  marker: ${p.name} | ${p.lat} | ${p.lng}`)
    );
    places.filter((p) => p.lat == null || p.lng == null).forEach((p) =>
      console.log(`  skipped: ${p.name} | lat ${p.lat} | lng ${p.lng}`)
    );
    console.groupEnd();

    locatedPlaces.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.lat!, place.lng!);
      const marker = new window.kakao.maps.Marker({ position, image: markerImage, clickable: true });
      marker.setMap(map);
      markersRef.current.push(marker);

      const tagsHtml = place.tags.length > 0
        ? `<span style="font-size:11px;color:#dc2626;font-weight:600;display:block;margin-bottom:8px;">📺 ${place.tags.join(' · ')}</span>`
        : '';
      const infoContent = `
        <div style="padding:10px 12px;min-width:170px;max-width:220px;
          font-family:-apple-system,sans-serif;line-height:1.5;">
          <strong style="font-size:14px;color:#111;display:block;margin-bottom:2px;">
            ${place.name}
          </strong>
          <span style="font-size:11px;background:#fee2e2;color:#dc2626;font-weight:700;
            padding:1px 6px;border-radius:3px;display:inline-block;margin-bottom:5px;">
            ${place.region}
          </span>
          <span style="font-size:12px;color:#555;display:block;margin-bottom:4px;">
            ${place.address}
          </span>
          ${tagsHtml}
          <a href="${place.mapUrl}" target="_blank" rel="noopener noreferrer"
            style="display:inline-block;padding:4px 10px;background:#03c75a;
              color:#fff;border-radius:3px;font-size:12px;font-weight:600;text-decoration:none;">
            네이버 지도 →
          </a>
        </div>`;
      const infoWindow = new window.kakao.maps.InfoWindow({ content: infoContent, removable: true });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        currentInfoWindowRef.current?.close();
        currentInfoWindowRef.current = null;
        setSelectedPlace(place);
        onPlaceSelect?.(place);
        map.setLevel(4);
        map.setCenter(position);
        // PC(≥1024px): InfoWindow 말풍선 / 모바일: PlaceSheet가 담당
        if (window.innerWidth >= 1024) {
          infoWindow.open(map, marker);
          currentInfoWindowRef.current = infoWindow;
        }
      });
    });

    // 특정 지역이 선택되지 않은 경우 bounds fit (좌표 있는 스팟 기준)
    if (locatedPlaces.length > 0 && !mapCenterRef.current) {
      const bounds = new window.kakao.maps.LatLngBounds();
      locatedPlaces.forEach((p) => bounds.extend(new window.kakao.maps.LatLng(p.lat!, p.lng!)));
      map.setBounds(bounds);
    } else if (locatedPlaces.length === 0) {
      // 좌표 있는 결과 없을 때 기본 서울 뷰로
      map.setCenter(new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng));
      map.setLevel(DEFAULT_CENTER.level);
    }
  }, [isKakaoLoaded, places]);

  // ── Effect 4: 지역 필터 → 지도 중심 이동 ─────────────────────
  useEffect(() => {
    if (!isKakaoLoaded || !kakaoMapRef.current || !mapCenter) return;
    kakaoMapRef.current.setCenter(
      new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng)
    );
    kakaoMapRef.current.setLevel(mapCenter.level);
  }, [isKakaoLoaded, mapCenter]);

  // ── Effect 5: 특정 핀 포커스 → 해당 좌표로 지도 이동 ──────────
  useEffect(() => {
    if (!isKakaoLoaded || !kakaoMapRef.current || !focusCoords) return;
    kakaoMapRef.current.setCenter(
      new window.kakao.maps.LatLng(focusCoords.lat, focusCoords.lng)
    );
    kakaoMapRef.current.setLevel(4);
  }, [isKakaoLoaded, focusCoords]);

  // ── Effect 6: 내 위치 파란 점 오버레이 ───────────────────────
  useEffect(() => {
    if (!isKakaoLoaded || !kakaoMapRef.current) return;

    if (userLocationOverlayRef.current) {
      userLocationOverlayRef.current.setMap(null);
      userLocationOverlayRef.current = null;
    }
    if (!userLocation) return;

    const el = document.createElement('div');
    el.innerHTML = `
      <div style="position:relative;width:16px;height:16px;pointer-events:none;">
        <div class="user-loc-pulse" style="position:absolute;inset:-8px;border-radius:50%;background:rgba(59,130,246,0.2);"></div>
        <div style="position:absolute;inset:0;background:#3B82F6;border-radius:50%;border:2.5px solid white;box-shadow:0 0 0 1px rgba(59,130,246,0.4),0 2px 8px rgba(0,0,0,0.5);"></div>
      </div>
    `;

    const overlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      content: el,
      zIndex: 10,
      yAnchor: 0.5,
      xAnchor: 0.5,
    });
    overlay.setMap(kakaoMapRef.current);
    userLocationOverlayRef.current = overlay;
  }, [isKakaoLoaded, userLocation]);

  // ── 가상 지도 fallback (API 키 없을 때) ───────────────────────
  const [zoomLevel, setZoomLevel] = useState(3);

  // 서울 전역 커버 — 140% 컨테이너 중앙 정렬 보정:
  // 상단 margin 늘려 노원(37.66)이 y=25%+ 이상에 위치하도록 maxLat=37.74
  const mapBounds = { minLat: 37.43, maxLat: 37.74, minLng: 126.73, maxLng: 127.18 };
  const toPercent = (lat: number, lng: number) => ({
    y: ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100,
    x: ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100,
  });

  const hasCoords = selectedPlace?.lat != null && selectedPlace?.lng != null;
  const virtualStyle = (selectedPlace && hasCoords)
    ? (() => {
        const pos = toPercent(selectedPlace.lat!, selectedPlace.lng!);
        return {
          transform: `scale(${1 + (zoomLevel - 3) * 0.25}) translate(${(50 - pos.x) * 0.35}%, ${(50 - pos.y) * 0.35}%)`,
          transition: 'transform 0.5s ease-out',
        };
      })()
    : { transform: `scale(${1 + (zoomLevel - 3) * 0.15})`, transition: 'all 0.5s ease-out' };

  return (
    <div className="relative w-full h-full bg-neutral-950 flex flex-col justify-center items-center overflow-hidden">
      {!loadError && apiKey ? (
        <div ref={mapContainerRef} className="w-full h-full" id="kakao-map-canvas" />
      ) : (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-neutral-950 text-neutral-200">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
          <div className="absolute w-[140%] h-[140%] origin-center" style={virtualStyle}>
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
              <path d="M 50,650 Q 300,500 620,590 T 1200,480 T 1800,550"
                fill="none" stroke="#3B82F6" strokeWidth="48" strokeLinecap="round"/>
              <text x="35%" y="45%" fill="#ffffff" fontSize="11" opacity="0.25">한강 (HAN RIVER)</text>
            </svg>
            <div className="absolute text-[10px] font-semibold tracking-widest text-neutral-600 uppercase pointer-events-none select-none"
              style={{ top: '38%', left: '22%' }}>서울 서부</div>
            <div className="absolute text-[10px] font-semibold tracking-widest text-neutral-600 uppercase pointer-events-none select-none"
              style={{ top: '38%', left: '52%' }}>서울 도심</div>
            <div className="absolute text-[10px] font-semibold tracking-widest text-neutral-600 uppercase pointer-events-none select-none"
              style={{ top: '55%', left: '68%' }}>강남·강동</div>

            {places.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-neutral-500 text-[12px]">검색 결과가 없습니다</p>
              </div>
            ) : (
              places.filter(p => p.lat != null && p.lng != null).map((place) => {
                const pos = toPercent(place.lat!, place.lng!);
                const isSel = selectedPlace?.id === place.id;
                return (
                  <button
                    key={place.id}
                    onClick={() => setSelectedPlace(isSel ? null : place)}
                    className="absolute cursor-pointer transition-all duration-300 focus:outline-none"
                    style={{ top: `${pos.y}%`, left: `${pos.x}%`, transform: 'translate(-50%, -100%)' }}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`mb-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold text-center whitespace-nowrap shadow-lg transition-all duration-200 ${
                        isSel
                          ? 'bg-red-600 border-red-500 text-white scale-105 z-50'
                          : 'bg-neutral-900/90 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}>
                        <span>{place.name}</span>
                        <span className="block text-[9px] opacity-70">{place.region}</span>
                      </div>
                      <div className="relative">
                        {isSel && <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-600 rounded-full animate-ping opacity-30" />}
                        <div className={`w-6 h-8 rounded-t-full rounded-br-full transform rotate-45 flex items-center justify-center border transition-colors ${
                          isSel ? 'bg-red-500 border-red-300' : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700'
                        }`}>
                          <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full -rotate-45" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="absolute right-4 bottom-4 flex flex-col gap-1 z-20">
            <button onClick={() => setZoomLevel((z) => Math.min(5, z + 1))}
              className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white transition shadow-lg">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={() => setZoomLevel((z) => Math.max(1, z - 1))}
              className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white transition shadow-lg">
              <Minus className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute top-4 left-4 right-4 sm:left-auto sm:max-w-xs p-3.5 rounded-xl border border-red-900/40 bg-red-950/20 backdrop-blur-md text-xs leading-relaxed text-red-100 flex items-start gap-2.5 z-20 shadow-xl">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-400">지도 API 키 연결 필요</p>
              <p className="text-[11px] text-red-200/80 mt-1">
                카카오 JavaScript 키를 발급받아 환경변수로 추가하면 실제 지도로 전환됩니다.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-3 text-[10px] font-mono text-neutral-500/70 pointer-events-none select-none flex items-center gap-1">
        <Compass className="w-3 h-3" />
        <span>SEOUL MVP GRID MAP V2.0</span>
      </div>
    </div>
  );
};

export const MapView = React.memo(MapViewBase);
