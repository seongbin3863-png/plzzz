// ── 응원 스팟 데이터 ────────────────────────────────────────────────────────
// 좌표 출처: OpenStreetMap Nominatim (주소 기반 지오코딩)
// 수정 시 이 파일만 편집하세요.

export interface Spot {
  id: string;
  name: string;
  region: string;
  address: string;
  lat?: number;   // 좌표 미확보 시 생략 — 추후 보강
  lng?: number;
  tags: string[];
  mapUrl: string;
}

export const spots: Spot[] = [
  {
    id: '1',
    name: '레츠펍 발산',
    region: '발산',
    address: '서울 강서구 마곡중앙6로 76-3 지상1층 104, 105호',
    lat: 37.5600073,
    lng: 126.8300269,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/xHgppnXe',
  },
  {
    id: '2',
    name: '리버풀펍',
    region: '흑석',
    address: '서울 동작구 흑석로 101-10 1층',
    lat: 37.5092927,
    lng: 126.9608616,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/GEXhvH16',
  },
  {
    id: '3',
    name: '신사펍 발산',
    region: '발산',
    address: '서울 강서구 마곡중앙6로 69 세움빌딩 3층',
    lat: 37.5610674,
    lng: 126.8301750,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/5du4FSLf',
  },
  {
    id: '4',
    name: '레츠펍 시청',
    region: '시청',
    address: '서울 중구 남대문로1길 47',
    lat: 37.5632055,
    lng: 126.9772797,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/5qc34GC6',
  },
  {
    id: '5',
    name: '우프라운지 을지로',
    region: '을지로',
    address: '서울 중구 퇴계로41가길 11-14 2층',
    lat: 37.5636100,
    lng: 126.9954016,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/565MHyrC',
  },
  {
    id: '6',
    name: '을지 OB베어',
    region: '을지로',
    address: '서울 중구 충무로 49-2 1층',
    lat: 37.5635074,
    lng: 126.9929865,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/GmbMs2xp',
  },
  {
    id: '7',
    name: '키페&펍 연무장 던던 동대문점',
    region: '동대문',
    address: '서울 중구 을지로 264 7층',
    lat: 37.5658165,
    lng: 127.0070369,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/GtURcvPg',
  },
  {
    id: '8',
    name: '마디그라',
    region: '종로',
    address: '서울 종로구 우정국로2길 29 B1F',
    lat: 37.5695618,
    lng: 126.9843029,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/5JpUL4hh',
  },
  {
    id: '9',
    name: '데빌스도어 코엑스',
    region: '강남',
    address: '서울 강남구 영동대로 513 코엑스 동문 1층',
    lat: 37.5125275,
    lng: 127.0588489,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/FhULo3Wn',
  },
  {
    id: '10',
    name: '몽롱 종각',
    region: '종로',
    address: '서울 종로구 삼일대로17길 42-1',
    lat: 37.5691738,
    lng: 126.9860324,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/xKERWtWb',
  },
  {
    id: '11',
    name: '금성슈퍼 광화문',
    region: '광화문',
    address: '서울 종로구 새문안로9길 9',
    lat: 37.5708701,
    lng: 126.9758872,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/xjgcD8Iy',
  },
  {
    id: '12',
    name: '크래프트한스 사당',
    region: '사당',
    address: '서울 서초구 방배천로 12-4',
    lat: 37.4877430,
    lng: 126.9853858,
    tags: ['빔프로젝터', 'TV다수'],
    mapUrl: 'https://naver.me/xf5A4ZTp',
  },
  {
    id: '13',
    name: '펍어스',
    region: '서울대입구',
    address: '서울 관악구 양녕로6길 39',
    lat: 37.4837609,
    lng: 126.9499161,
    tags: ['TV'],
    mapUrl: 'https://naver.me/FtGfCTnd',
  },
  {
    id: '14',
    name: '호리도',
    region: '서울대입구',
    address: '서울 관악구 봉천로 518-4',
    lat: 37.4795103,
    lng: 126.9555205,
    tags: ['빔프로젝터', 'TV다수'],
    mapUrl: 'https://naver.me/IFgdCto6',
  },
  {
    id: '15',
    name: '샘라이언스 스포츠펍',
    region: '이태원',
    address: '서울 용산구 이태원로27가길 50 2층',
    lat: 37.5350693,
    lng: 126.9925552,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/xExW7nr6',
  },
  {
    id: '16',
    name: '제이알펍',
    region: '이태원',
    address: '서울 용산구 보광로 127',
    lat: 37.5291841,
    lng: 126.9980415,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/G8s9uLbD',
  },

  // ── 2차 추가 (좌표 보강 완료) ──────────────────────────────────────────────
  {
    id: '17',
    name: '스패로우 본점',
    region: '성신여대',
    address: '서울 성북구 동소문로20가길 50',
    lat: 37.5923823,
    lng: 127.0170658,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/GKUqB68l',
  },
  {
    id: '18',
    name: '호멜맥주',
    region: '노량진',
    address: '서울 동작구 노들로2길 7 B동 지하1층',
    lat: 37.5160579,
    lng: 126.9412219,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/xbA5Dh1e',
  },
  {
    id: '19',
    name: '펍마이마이 잠실',
    region: '잠실',
    address: '서울 송파구 백제고분로7길 24-7',
    lat: 37.5102528,
    lng: 127.0817557,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/Gq84w2ld',
  },
  {
    id: '20',
    name: '스패로우 상계점',
    region: '노원',
    address: '서울 노원구 한글비석로20길 36 2층',
    lat: 37.6603543,
    lng: 127.0736612,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/GZZUyTck',
  },
  {
    id: '21',
    name: '와이키키비치포차',
    region: '이태원',
    address: '서울 용산구 보광로59길 43 1층',
    lat: 37.5337718,
    lng: 126.9915600,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/xLW9zK19',
  },
  {
    id: '22',
    name: '더피자스탠드 논현',
    region: '논현',
    address: '서울 강남구 학동로2길 19 1층',
    lat: 37.5099938,
    lng: 127.0228894,
    tags: [],
    mapUrl: 'https://naver.me/5cqmQt9h',
  },
  {
    id: '23',
    name: '드래프트128',
    region: '여의도',
    address: '서울 영등포구 여의대로 128 LG트윈타워 서관 B1',
    lat: 37.5280674,
    lng: 126.9276005,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/FeXRNRXY',
  },
  {
    id: '24',
    name: '치어하우스',
    region: '홍대',
    address: '서울 마포구 와우산로11길 9-11 1층',
    lat: 37.5484288,
    lng: 126.9224677,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/x0U3R0gW',
  },
  {
    id: '25',
    name: '포차주식시장',
    region: '강남',
    address: '서울 서초구 서초대로77길 41',
    lat: 37.5012347,
    lng: 127.0249422,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/5N15BkfQ',
  },
  {
    id: '26',
    name: '더피자스탠드 선릉',
    region: '선릉',
    address: '서울 강남구 삼성로81길 39 1층',
    lat: 37.5036515,
    lng: 127.0545116,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/Ghbu139q',
  },
  {
    id: '27',
    name: '왕스펍 강남',
    region: '강남',
    address: '서울 강남구 강남대로98길 11',
    lat: 37.5008073,
    lng: 127.0275959,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/53lKOXVt',
  },
  {
    id: '28',
    name: '더밤 합정',
    region: '합정',
    address: '서울 마포구 잔다리로 19 2층',
    lat: 37.5506619,
    lng: 126.9208262,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/x0UPIYym',
  },
  {
    id: '29',
    name: '더블플레이치킨 홍대',
    region: '홍대',
    address: '서울 마포구 동교로 201 2층',
    lat: 37.5582304,
    lng: 126.9229809,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/5jJTGGbS',
  },
  {
    id: '30',
    name: '서울갈매기',
    region: '홍대',
    address: '서울 마포구 연희로 3 2층',
    lat: 37.5617393,
    lng: 126.9271218,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/xExyi3iI',
  },
  {
    id: '31',
    name: '제이케이펍',
    region: '홍대',
    address: '서울 마포구 어울마당로5길 46 2층',
    lat: 37.5499473,
    lng: 126.9182258,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/F42lLXEp',
  },
  {
    id: '32',
    name: '당인리극장',
    region: '합정',
    address: '서울 마포구 양화로6길 21 2층',
    lat: 37.5491946,
    lng: 126.9154868,
    tags: ['TV다수'],
    mapUrl: 'https://naver.me/FhULAGmf',
  },
  {
    id: '33',
    name: '봉황당',
    region: '홍대',
    address: '서울 마포구 양화로23길 24',
    lat: 37.5592975,
    lng: 126.9256678,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/GDa2ivL5',
  },

  // ── 기존 sampleData.js 원본 복구 (신촌·홍대) ──────────────────────────────
  {
    id: '34',
    name: '신촌 낭만오지',
    region: '신촌',
    address: '서울 마포구 고산길 17',
    lat: 37.5536476,
    lng: 126.9380832,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/5r9z7UxJ',
  },
  {
    id: '35',
    name: '신촌 썬더치킨',
    region: '신촌',
    address: '서울 서대문구 연세로11길 20 1층',
    lat: 37.5590094,
    lng: 126.9357571,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/FTXDlTC9',
  },
  {
    id: '36',
    name: '신촌 뉴타운',
    region: '신촌',
    address: '서울 서대문구 연세로12길 27',
    lat: 37.5590866,
    lng: 126.9385177,
    tags: ['TV'],
    mapUrl: 'https://naver.me/IGJyfK7B',
  },
  {
    id: '37',
    name: '홍대 만선호프',
    region: '홍대',
    address: '서울 마포구 와우산로17길 15 1층, 2층',
    lat: 37.5500894,
    lng: 126.9221145,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/xq3drtjR',
  },
  {
    id: '38',
    name: '신촌 오퍼스',
    region: '신촌',
    address: '서울 서대문구 연세로7길 18 2층',
    lat: 37.5577833,
    lng: 126.9358819,
    tags: ['빔프로젝터'],
    mapUrl: 'https://naver.me/Gipd4Lqn',
  },
];

// ── 지역 필터 목록 ─────────────────────────────────────────────────────────
// 향후 지역 추가 시: spots 배열에 데이터 추가 + REGION_CENTERS에 좌표 추가
export const REGIONS = [
  '전체',
  // 서북·서부
  '발산', '여의도', '합정', '홍대', '신촌', '노량진', '흑석',
  // 도심
  '시청', '광화문', '종로', '동대문', '을지로',
  // 북부·동북
  '성신여대', '노원',
  // 동남·강남
  '이태원', '논현', '강남', '선릉', '잠실',
  // 남부
  '사당', '서울대입구',
];

// ── 지역별 지도 중심 좌표 ────────────────────────────────────────────────────
// 전체: null → 모든 마커가 보이도록 bounds fit
// 각 지역: 해당 지역 스팟들의 중심 좌표 (평균값)
export const REGION_CENTERS: Record<string, { lat: number; lng: number; level: number } | null> = {
  전체:       null,
  // 서북·서부 (역 좌표 기준)
  발산:       { lat: 37.5605, lng: 126.8301, level: 5 },  // 레츠펍·신사펍 중간
  여의도:     { lat: 37.5217, lng: 126.9244, level: 5 },  // 여의도역
  합정:       { lat: 37.5492, lng: 126.9146, level: 5 },  // 합정역
  홍대:       { lat: 37.5572, lng: 126.9236, level: 5 },  // 홍대입구역
  신촌:       { lat: 37.5574, lng: 126.9370, level: 5 },  // 4개 스팟 중심
  노량진:     { lat: 37.5132, lng: 126.9423, level: 5 },  // 노량진역
  흑석:       { lat: 37.5093, lng: 126.9609, level: 5 },
  // 도심
  시청:       { lat: 37.5632, lng: 126.9773, level: 5 },
  광화문:     { lat: 37.5709, lng: 126.9759, level: 5 },
  종로:       { lat: 37.5694, lng: 126.9852, level: 5 },  // 마디그라·몽롱종각 중간
  동대문:     { lat: 37.5658, lng: 127.0070, level: 5 },
  을지로:     { lat: 37.5636, lng: 126.9942, level: 5 },  // 우프라운지·OB베어 중간
  // 북부·동북
  성신여대:   { lat: 37.5921, lng: 127.0165, level: 5 },  // 성신여대입구역
  노원:       { lat: 37.6541, lng: 127.0571, level: 5 },  // 노원역
  // 동남·강남
  이태원:     { lat: 37.5321, lng: 126.9953, level: 5 },  // 샘라이언스·제이알펍 중간
  논현:       { lat: 37.5159, lng: 127.0279, level: 5 },  // 논현역
  강남:       { lat: 37.5125, lng: 127.0588, level: 5 },  // 코엑스 기준
  선릉:       { lat: 37.5044, lng: 127.0489, level: 5 },  // 선릉역
  잠실:       { lat: 37.5133, lng: 127.1000, level: 5 },  // 잠실역
  // 남부
  사당:       { lat: 37.4877, lng: 126.9854, level: 5 },
  서울대입구: { lat: 37.4816, lng: 126.9527, level: 5 },  // 펍어스·호리도 중간
};
