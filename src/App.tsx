import { useRef, useState, type ChangeEvent } from 'react';
import { toPng } from 'html-to-image';
import { Banner300x250, Banner300x600, Banner970x250, Banner980x90, Banner320x50 } from './components/Banner';
import {
  FORMAT_DEFAULTS,
  FORMATS,
  INITIAL_STATE,
  THEMES,
  type BannerState,
  type Format,
  type Theme,
} from './types';

export function App() {
  const [state, setState] = useState<BannerState>(INITIAL_STATE);
  const [exporting, setExporting] = useState(false);

  const ref250  = useRef<HTMLDivElement>(null);
  const ref600  = useRef<HTMLDivElement>(null);
  const ref970  = useRef<HTMLDivElement>(null);
  const ref980  = useRef<HTMLDivElement>(null);
  const ref320  = useRef<HTMLDivElement>(null);

  function update<K extends keyof BannerState>(key: K, value: BannerState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function selectFormat(format: Format) {
    setState((s) => ({
      ...s,
      format,
      theme: FORMATS[format].defaultTheme,
      ...FORMAT_DEFAULTS[format],
    }));
  }

  function onIconUpload(slot: 'gameIcon' | 'creatorIcon', e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(slot, reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  async function exportAll() {
    const targets = [
      { ref: ref250, label: '300x250' },
      { ref: ref600, label: '300x600' },
      { ref: ref970, label: '970x250' },
      { ref: ref980, label: '980x90'  },
      { ref: ref320, label: '320x50'  },
    ];
    setExporting(true);
    try {
      await document.fonts.ready;
      for (const { ref, label } of targets) {
        if (!ref.current) continue;
        await toPng(ref.current, { pixelRatio: 2 });
        const dataUrl = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `metafy-${state.format}-${state.theme}-${label}.png`;
        a.click();
        await new Promise((r) => setTimeout(r, 200));
      }
    } finally {
      setExporting(false);
    }
  }

  const showGame    = state.format !== 'shop';
  const showCreator = state.format !== 'game';
  const showFiller3 = state.format === 'community' || state.format === 'guide';

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Banner Ad Tool</h1>

        <div className="section">
          <div className="section-label">Format</div>
          <div className="format-grid">
            {(Object.keys(FORMATS) as Format[]).map((f) => (
              <button
                key={f}
                className={`format-btn ${state.format === f ? 'active' : ''}`}
                onClick={() => selectFormat(f)}
              >
                {FORMATS[f].label}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-label">Theme</div>
          <div className="swatches">
            {(Object.keys(THEMES) as Theme[]).map((t) => (
              <button
                key={t}
                className="swatch"
                data-active={state.theme === t}
                onClick={() => update('theme', t)}
                title={THEMES[t].label}
              >
                <span
                  className="swatch-dot"
                  style={{
                    background: `radial-gradient(ellipse 130% 90% at 50% 110%, ${THEMES[t].color}, #0E0E11 70%)`,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-label">Headline</div>

          <div className="field">
            <input type="text" value={state.filler1} onChange={(e) => update('filler1', e.target.value)} />
          </div>

          {showGame && (
            <div className="slot-controls">
              <div className="slot-controls-header">Game</div>
              <div className="field">
                <label>Name</label>
                <input type="text" value={state.gameName} onChange={(e) => update('gameName', e.target.value)} />
              </div>
              <div className="field">
                <label>Image</label>
                <div className="icon-row">
                  {state.gameIcon ? <img className="icon-preview" src={state.gameIcon} alt="" /> : <div className="icon-preview" />}
                  <label className="file-btn">
                    Upload
                    <input type="file" accept="image/*" onChange={(e) => onIconUpload('gameIcon', e)} />
                  </label>
                  {state.gameIcon && <button className="icon-clear" onClick={() => update('gameIcon', null)}>×</button>}
                </div>
              </div>
            </div>
          )}

          {showGame && (
            <div className="field">
              <input type="text" value={state.filler2} onChange={(e) => update('filler2', e.target.value)} />
            </div>
          )}

          {showCreator && (
            <div className="slot-controls">
              <div className="slot-controls-header">Creator</div>
              <div className="field">
                <label>Name</label>
                <input type="text" value={state.creatorName} onChange={(e) => update('creatorName', e.target.value)} />
              </div>
              <div className="field">
                <label>Image</label>
                <div className="icon-row">
                  {state.creatorIcon ? <img className="icon-preview" src={state.creatorIcon} alt="" /> : <div className="icon-preview" />}
                  <label className="file-btn">
                    Upload
                    <input type="file" accept="image/*" onChange={(e) => onIconUpload('creatorIcon', e)} />
                  </label>
                  {state.creatorIcon && <button className="icon-clear" onClick={() => update('creatorIcon', null)}>×</button>}
                </div>
              </div>
            </div>
          )}

          {showFiller3 && (
            <div className="field">
              <input type="text" value={state.filler3} onChange={(e) => update('filler3', e.target.value)} />
            </div>
          )}
        </div>

        <div className="section">
          <div className="section-label">Call to action</div>
          <div className="field">
            <input type="text" value={state.ctaText} onChange={(e) => update('ctaText', e.target.value)} />
          </div>
        </div>

        <button className="export-btn" onClick={exportAll} disabled={exporting}>
          {exporting ? 'Exporting…' : 'Download all sizes'}
        </button>
      </aside>

      <main className="canvas-area">
        <div className="banner-group">
          <div className="banner-row">
            <BannerBlock label="1 — 300 × 250" width={300}>
              <Banner300x250 ref={ref250} data={state} />
            </BannerBlock>
            <BannerBlock label="2 — 300 × 600" width={300}>
              <Banner300x600 ref={ref600} data={state} />
            </BannerBlock>
          </div>
          <BannerBlock label="3 — 970 × 250" width={970}>
            <Banner970x250 ref={ref970} data={state} />
          </BannerBlock>
          <BannerBlock label="4 — 980 × 90" width={980}>
            <Banner980x90 ref={ref980} data={state} />
          </BannerBlock>
          <BannerBlock label="5 — 320 × 50" width={320}>
            <Banner320x50 ref={ref320} data={state} logoSize={21} />
          </BannerBlock>
        </div>
      </main>
    </div>
  );
}

function BannerBlock({ label, width, children }: {
  label: string;
  width: number;
  children: React.ReactNode;
}) {
  return (
    <div className="banner-block" style={{ '--banner-width': `${width}px` } as React.CSSProperties}>
      <div className="banner-label">{label}</div>
      <div className="preview-frame">{children}</div>
    </div>
  );
}
