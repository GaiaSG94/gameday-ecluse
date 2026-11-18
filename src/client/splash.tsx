import './index.css';

import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0c1c26] px-6 text-center text-[#cfe8f3]">
      <div className="text-3xl">🚢</div>
      <h1 className="text-3xl font-black tracking-[0.3em] text-[#4cc9f0]">ECLUSE</h1>
      <p className="max-w-[240px] text-[13px] leading-snug text-[#5f8fa5]">
        Five sweeping gates, one sinking crate. Hi {context.username ?? 'keeper'}.
      </p>
      <button
        onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        className="mt-2 rounded-full bg-[#4cc9f0] px-8 py-2.5 text-sm font-black uppercase tracking-widest text-[#0c1c26] transition-transform active:scale-[0.98]"
      >
        Open the canal
      </button>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
