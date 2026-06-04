/** @type {Array<{id:string,name:string,region:string,address:string,lat:number,lng:number,screenType:string,naverLink:string}>} */
export const sampleData = [
  {
    id: '1',
    name: '신촌 낭만오지',
    region: '신촌',
    address: '서울 마포구 고산길 17',
    lat: 37.5536476,
    lng: 126.9380832,
    screenType: '빔프로젝터',
    naverLink: 'https://naver.me/5r9z7UxJ',
  },
  {
    id: '2',
    name: '신촌 썬더치킨',
    region: '신촌',
    address: '서울 서대문구 연세로11길 20 1층',
    lat: 37.5590094,
    lng: 126.9357571,
    screenType: '빔프로젝터',
    naverLink: 'https://naver.me/FTXDlTC9',
  },
  {
    id: '3',
    name: '신촌 뉴타운',
    region: '신촌',
    address: '서울 서대문구 연세로12길 27',
    lat: 37.5590866,
    lng: 126.9385177,
    screenType: 'TV',
    naverLink: 'https://naver.me/IGJyfK7B',
  },
  {
    id: '4',
    name: '홍대 만선호프',
    region: '홍대',
    address: '서울 마포구 와우산로17길 15 1층, 2층',
    lat: 37.5500894,
    lng: 126.9221145,
    screenType: '빔프로젝터',
    naverLink: 'https://naver.me/xq3drtjR',
  },
  {
    id: '5',
    name: '신촌 오퍼스',
    region: '신촌',
    address: '서울 서대문구 연세로7길 18 2층',
    lat: 37.5577833,
    lng: 126.9358819,
    screenType: '빔프로젝터',
    naverLink: 'https://naver.me/Gipd4Lqn',
  },
];

/**
 * 지역 필터 배열 — 향후 지역 추가 시 이 배열만 수정
 * @type {string[]}
 */
export const REGIONS = ['전체', '신촌', '홍대', '강남', '이태원', '잠실'];

/**
 * 지역별 지도 중심 좌표
 * 전체: null (bounds fit 사용)
 * @type {Record<string, {lat:number,lng:number,level:number}|null>}
 */
export const REGION_CENTERS = {
  전체: null,
  신촌: { lat: 37.5577, lng: 126.9368, level: 5 },
  홍대: { lat: 37.5520, lng: 126.9237, level: 5 },
  강남: { lat: 37.4979, lng: 127.0276, level: 5 },
  이태원: { lat: 37.5346, lng: 126.9942, level: 5 },
  잠실: { lat: 37.5133, lng: 127.1007, level: 5 },
};
