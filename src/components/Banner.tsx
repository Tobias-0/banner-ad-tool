import { Fragment, forwardRef, type ReactNode, type Ref } from 'react';
import { THEMES, type BannerState } from '../types';
import logoCrown from '../assets/metafy-logo.svg';
import watermarkSrc from '../assets/metafy-watermark.svg';

// ── Shared primitives ────────────────────────────────────────────────────────

function ArrowUpRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M5 11L11 5M11 5H6.5M11 5V9.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SlotIcon({ icon, size, borderRadius }: { icon: string | null; size: number; borderRadius: number }) {
  const style: React.CSSProperties = {
    display: 'inline-block',
    width: size,
    height: size,
    borderRadius,
    objectFit: 'cover',
    flexShrink: 0,
  };
  return icon
    ? <img style={style} src={icon} alt="" crossOrigin="anonymous" />
    : <span style={{ ...style, background: 'linear-gradient(135deg,#2e2e3a,#1a1a22)', border: '1px solid #2a2a35', display: 'inline-block', boxSizing: 'border-box' }} aria-hidden />;
}

interface SlotProps {
  icon: string | null;
  name: string;
  iconSize: number;
  iconVA: number; // vertical-align offset in px (negative = up)
  iconMarginRight: number;
  iconBR: number;
}

function Slot({ icon, name, iconSize, iconVA, iconMarginRight, iconBR }: SlotProps) {
  const spaceIdx = name.indexOf(' ');
  const first = spaceIdx === -1 ? name : name.slice(0, spaceIdx);
  const rest = spaceIdx === -1 ? '' : name.slice(spaceIdx);
  return (
    <span style={{ display: 'inline', wordSpacing: 'normal' }}>
      <span style={{ whiteSpace: 'nowrap' }}>
        <span style={{ display: 'inline-block', verticalAlign: iconVA, marginRight: iconMarginRight }}>
          <SlotIcon icon={icon} size={iconSize} borderRadius={iconBR} />
        </span><span style={{ color: '#fff', fontWeight: 600 }}>{first}</span>
      </span>{rest && <span style={{ color: '#fff', fontWeight: 600 }}>{rest}</span>}
    </span>
  );
}

function buildParts(
  data: BannerState,
  iconProps: Omit<SlotProps, 'icon' | 'name'>,
  insertBreaks = false,
  fillerPR = 2,
): ReactNode[] {
  const { filler1, filler2, filler3, gameName, gameIcon, creatorName, creatorIcon } = data;
  const f = (t: string) => t ? <span key={t} style={{ color: '#C0C0D1', fontWeight: 400, wordSpacing: 'normal', paddingRight: fillerPR }}>{t}</span> : null;
  const game = <Slot key="game" icon={gameIcon} name={gameName} {...iconProps} />;
  const creator = <Slot key="creator" icon={creatorIcon} name={creatorName} {...iconProps} />;
  const br = insertBreaks ? <br key="br" /> : null;

  const raw: (ReactNode | null)[] = {
    creator:   [f(filler1), game, f(filler2), creator],
    game:      [f(filler1), game, br, f(filler2)],
    community: [f(filler1), creator, f(filler2), game, f(filler3)],
    guide:     [f(filler1), game, f(filler2), creator, f(filler3)],
    shop:      [f(filler1), br, creator],
  }[data.format];

  const filtered = raw.filter(Boolean) as ReactNode[];
  return filtered.map((part, i) => {
    const isBreak = (part as any)?.type === 'br';
    return <Fragment key={i}>{i > 0 && !isBreak && ' '}{part}</Fragment>;
  });
}

// ── Watermark ────────────────────────────────────────────────────────────────

export interface WmConfig {
  height: number;
  right: number;
  top: number;
}

function Watermark({ height, right, top }: WmConfig) {
  const svgAspect = 931 / 710;
  return (
    <img
      src={watermarkSrc}
      aria-hidden
      crossOrigin="anonymous"
      style={{
        position: 'absolute',
        right,
        top,
        height,
        width: height * svgAspect,
        transform: 'translate(50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

// ── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ height, style }: { height: number; style?: React.CSSProperties }) {
  return <img style={{ height, width: 'auto', display: 'block', ...style }} src={logoCrown} alt="Metafy" crossOrigin="anonymous" />;
}

// ── Glow ─────────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function bannerBg(color: string, midOpacity = 0.01, maxOpacity = 0.12) {
  return `radial-gradient(137.68% 100% at 50% 0%, ${hexToRgba(color, 0)} 0%, ${hexToRgba(color, midOpacity)} 62.15%, ${hexToRgba(color, maxOpacity)} 100%), #0E0E11`;
}

// ── 300×250 ───────────────────────────────────────────────────────────────────

const WM_DEFAULTS: Record<string, WmConfig> = {
  '300x250': { height: 455, right: 220, top: 185 },
  '300x600': { height: 641, right: 242, top: 508 },
  '970x250': { height: 751, right: 600, top: 151 },
  '980x90':  { height: 378, right: 700, top: 28  },
};

export const Banner300x250 = forwardRef<HTMLDivElement, { data: BannerState; wmConfig?: WmConfig }>(({ data, wmConfig }, ref) => {
  const color = THEMES[data.theme].color;
  const iconProps = { iconSize: 20, iconVA: -2, iconMarginRight: 9, iconBR: 4 };
  const wm = wmConfig ?? WM_DEFAULTS['300x250'];
  const isShop = data.format === 'shop';
  return (
    <div ref={ref} style={{ width: 300, height: 250, position: 'relative', background: bannerBg(color), fontFamily: "'Suisse Intl', system-ui, sans-serif", overflow: 'hidden', flexShrink: 0 }}>
      <Watermark {...wm} />
      <div style={{ position: 'relative', zIndex: 2, height: '100%', padding: 24, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <Logo height={28} style={{ alignSelf: 'flex-start' }} />
        <div style={{ marginTop: isShop ? 'auto' : 35, fontSize: 22, lineHeight: '33px', letterSpacing: '0.005em', color: '#C0C0D1', fontWeight: 400 }}>
          {buildParts(data, iconProps)}
        </div>
        <div style={{ marginTop: 16, fontSize: 16, lineHeight: '24px', fontWeight: 600, color, display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}>
          <span>{data.ctaText}</span>
          <ArrowUpRight size={17} />
        </div>
      </div>
    </div>
  );
});
Banner300x250.displayName = 'Banner300x250';

// ── 300×600 ───────────────────────────────────────────────────────────────────

export const Banner300x600 = forwardRef<HTMLDivElement, { data: BannerState; wmConfig?: WmConfig }>(({ data, wmConfig }, ref) => {
  const color = THEMES[data.theme].color;
  const iconProps = { iconSize: 28, iconVA: -2, iconMarginRight: 12, iconBR: 4 };
  const wm = wmConfig ?? WM_DEFAULTS['300x600'];
  return (
    <div ref={ref} style={{ width: 300, height: 600, position: 'relative', background: bannerBg(color), fontFamily: "'Suisse Intl', system-ui, sans-serif", overflow: 'hidden', flexShrink: 0 }}>
      <Watermark {...wm} />
      <div style={{ position: 'relative', zIndex: 2, height: '100%', padding: 28, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <Logo height={34} style={{ alignSelf: 'flex-start' }} />
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, lineHeight: '41px', letterSpacing: '-0.01em', color: '#C0C0D1', fontWeight: 400 }}>
            {buildParts(data, iconProps)}
          </div>
          <div style={{ marginTop: 28, fontSize: 18, lineHeight: '26px', fontWeight: 600, color, display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start' }}>
            <span>{data.ctaText}</span>
            <ArrowUpRight size={19} />
          </div>
        </div>
      </div>
    </div>
  );
});
Banner300x600.displayName = 'Banner300x600';

// ── 970×250 ───────────────────────────────────────────────────────────────────

export const Banner970x250 = forwardRef<HTMLDivElement, { data: BannerState; wmConfig?: WmConfig }>(({ data, wmConfig }, ref) => {
  const color = THEMES[data.theme].color;
  const iconProps = { iconSize: 28, iconVA: -2, iconMarginRight: 12, iconBR: 4 };
  const wm = wmConfig ?? WM_DEFAULTS['970x250'];
  return (
    <div ref={ref} style={{ width: 970, height: 250, position: 'relative', background: bannerBg(color, 0.06), fontFamily: "'Suisse Intl', system-ui, sans-serif", overflow: 'hidden', flexShrink: 0 }}>
      <Watermark {...wm} />
      <div style={{ position: 'relative', zIndex: 2, height: '100%', padding: '32px 32px 24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <Logo height={34} style={{ alignSelf: 'flex-start' }} />
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ fontSize: 36, lineHeight: '48px', letterSpacing: '-0.005em', color: '#C0C0D1', fontWeight: 400, maxWidth: 560 }}>
            {buildParts(data, iconProps, false, 6)}
          </div>
          <div style={{ flexShrink: 0, fontSize: 18, lineHeight: '24px', fontWeight: 600, color, display: 'inline-flex', alignItems: 'center', gap: 5, paddingBottom: 6 }}>
            <span>{data.ctaText}</span>
            <ArrowUpRight size={19} />
          </div>
        </div>
      </div>
    </div>
  );
});
Banner970x250.displayName = 'Banner970x250';

// ── 980×90 ────────────────────────────────────────────────────────────────────

export const Banner980x90 = forwardRef<HTMLDivElement, { data: BannerState; wmConfig?: WmConfig }>(({ data }, ref) => {
  const color = THEMES[data.theme].color;
  const iconProps = { iconSize: 17, iconVA: -2, iconMarginRight: 8, iconBR: 4 };
  return (
    <div ref={ref} style={{ width: 980, height: 90, position: 'relative', background: bannerBg(color, 0.06), fontFamily: "'Suisse Intl', system-ui, sans-serif", overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ position: 'relative', zIndex: 2, height: '100%', padding: '0 28px', display: 'flex', alignItems: 'center', gap: 16, boxSizing: 'border-box' }}>
        <Logo height={30} />
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 18, lineHeight: '25px', letterSpacing: '0.003em', color: '#C0C0D1', fontWeight: 400, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {buildParts(data, iconProps, false, 4)}
        </div>
        <div style={{ flexShrink: 0, fontSize: 18, lineHeight: '22px', fontWeight: 600, color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span>{data.ctaText}</span>
          <ArrowUpRight size={19} />
        </div>
      </div>
    </div>
  );
});
Banner980x90.displayName = 'Banner980x90';

// ── 320×50 ────────────────────────────────────────────────────────────────────

export const Banner320x50 = forwardRef<HTMLDivElement, { data: BannerState; logoSize?: number }>(({ data, logoSize = 18 }, ref) => {
  const color = THEMES[data.theme].color;
  const iconProps = { iconSize: 12, iconVA: -2, iconMarginRight: 5, iconBR: 3 };
  return (
    <div ref={ref} style={{ width: 320, height: 50, position: 'relative', background: bannerBg(color, 0.06), fontFamily: "'Suisse Intl', system-ui, sans-serif", overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ position: 'relative', zIndex: 2, height: '100%', padding: '0 14px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
        <Logo height={logoSize} style={{ marginRight: 8 }} />
        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', flexShrink: 0, marginRight: 12 }} />
        <div style={{ flex: 1, fontSize: 11, lineHeight: '14px', letterSpacing: '0.003em', color: '#C0C0D1', fontWeight: 400, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', wordSpacing: 2 }}>
          {buildParts(data, iconProps, true, 0)}
        </div>
      </div>
    </div>
  );
});
Banner320x50.displayName = 'Banner320x50';

// ── Generic wrapper (used by App for export refs) ─────────────────────────────

export type BannerSize = '300x250' | '980x90' | '300x600' | '970x250';

const BANNER_MAP: Record<BannerSize, React.ForwardRefExoticComponent<{ data: BannerState } & React.RefAttributes<HTMLDivElement>>> = {
  '300x250': Banner300x250,
  '980x90':  Banner980x90,
  '300x600': Banner300x600,
  '970x250': Banner970x250,
};

export const Banner = forwardRef<HTMLDivElement, { data: BannerState; size: BannerSize }>(
  ({ data, size }, ref) => {
    const Comp = BANNER_MAP[size];
    return <Comp ref={ref as Ref<HTMLDivElement>} data={data} />;
  }
);
Banner.displayName = 'Banner';
