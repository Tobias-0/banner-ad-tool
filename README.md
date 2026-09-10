# Metafy Banner Ad Tool

Internal generator for Metafy display ads. Pick a format and theme, edit the headline and call to action, then download every size as a PNG.

## Features

- **Formats:** Creator, Game, Community, Guide, Shop
- **Themes:** Gold, Green, Purple, Pink
- **Sizes:** 300×250, 300×600, 970×250, 980×90, 320×50
- **Export:** Download all sizes at 2× resolution

## Setup

Requires [Node.js](https://nodejs.org/).

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Usage

1. Choose a format. Copy, CTA, and default theme update to match.
2. Optionally switch the theme.
3. Edit the headline fillers, game/creator names, and call to action.
4. Upload game or creator images (or keep the defaults).
5. Click **Download all sizes** to save one PNG per banner.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Serve the production build locally |

## Stack

React, TypeScript, Vite, and [html-to-image](https://github.com/bubkoo/html-to-image) for PNG export.
