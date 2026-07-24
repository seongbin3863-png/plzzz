import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    <Analytics />
  </StrictMode>,
);

// 프로덕션 빌드에서만 등록 — 로컬 개발 서버(vite dev)에서 SW 캐시가 HMR과 충돌하는 것을 방지
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
