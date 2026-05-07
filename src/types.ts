import defaultGameIcon    from './assets/default-icon-1.jpeg';
import defaultCreatorIcon from './assets/default-icon-2.jpeg';

export type Format = 'creator' | 'game' | 'community' | 'guide';
export type Theme = 'gold' | 'green' | 'purple' | 'pink';

export interface BannerState {
  format: Format;
  theme: Theme;
  filler1: string;
  filler2: string;
  filler3: string;
  gameName: string;
  gameIcon: string | null;
  creatorName: string;
  creatorIcon: string | null;
  ctaText: string;
}

export const FORMATS: Record<Format, { label: string; defaultTheme: Theme }> = {
  creator:   { label: 'Creator',   defaultTheme: 'gold'   },
  game:      { label: 'Game',      defaultTheme: 'green'  },
  community: { label: 'Community', defaultTheme: 'purple' },
  guide:     { label: 'Guide',     defaultTheme: 'pink'   },
};

export const FORMAT_DEFAULTS: Record<Format, Pick<BannerState, 'filler1' | 'filler2' | 'filler3' | 'ctaText' | 'gameName' | 'creatorName'>> = {
  creator:   { filler1: 'Get good at', filler2: 'with coaching from',    filler3: '',                          ctaText: 'Book a session',  gameName: 'Smash Ultimate', creatorName: 'Dark Wizzy.'  },
  game:      { filler1: 'Get good at', filler2: 'with 1-on-1 coaching.', filler3: '',                          ctaText: 'Find a coach',    gameName: 'Smash Ultimate', creatorName: 'Dark Wizzy'  },
  community: { filler1: 'Join',        filler2: 'exclusive',             filler3: 'Discord.',                  ctaText: 'Become a member', gameName: 'Smash Ultimate', creatorName: 'Dark Wizzy'  },
  guide:     { filler1: 'Master',      filler2: 'with',                  filler3: 'complete guide for Melee.', ctaText: 'Read the guide',  gameName: 'Pikachu',        creatorName: 'Dark Wizzy'  },
};

export const THEMES: Record<Theme, { label: string; color: string }> = {
  gold:   { label: 'Gold',   color: '#FCD23E' },
  green:  { label: 'Green',  color: '#94F094' },
  purple: { label: 'Purple', color: '#8685FF' },
  pink:   { label: 'Pink',   color: '#F58FD3' },
};

export const INITIAL_STATE: BannerState = {
  format: 'creator',
  theme: 'gold',
  ...FORMAT_DEFAULTS.creator,
  gameIcon: defaultGameIcon,
  creatorIcon: defaultCreatorIcon,
};
