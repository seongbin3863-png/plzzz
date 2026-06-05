import React from 'react';

interface EBProps { children: React.ReactNode }
interface EBState { hasError: boolean; message: string }

export class ErrorBoundary extends React.Component {
  // React 19 ships no bundled .d.ts — explicit declarations avoid inference gaps
  declare props: EBProps;
  state: EBState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): EBState {
    const msg = error instanceof Error ? error.message : '알 수 없는 오류';
    return { hasError: true, message: msg };
  }

  componentDidCatch(error: unknown, info: { componentStack?: string | null }) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0d0000] text-white px-6 text-center gap-4">
          <span style={{ fontSize: 48 }}>⚽</span>
          <p className="text-[20px] font-black">잠시 오류가 발생했어요</p>
          <p className="text-[13px] text-white/50 leading-relaxed max-w-xs">
            페이지를 새로 고치면 대부분 해결됩니다.<br />
            <span className="text-red-400/70 text-[11px]">{this.state.message}</span>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-3 bg-red-600 rounded-2xl font-black text-[15px] active:opacity-80"
          >
            새로 고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
