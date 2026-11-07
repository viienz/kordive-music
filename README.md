# Kordive ✦

> Universal, privacy-first smart desktop music player with 10-Band Studio DSP, synchronized lyrics, and intelligent ghost caching.

Designed with a modern **Warm Peachy Velvet Glass** aesthetic (`#0E0D12` Obsidian Canvas, `#FB9278` Sunset Peach Coral).

---

## Features

- **Personalized Home Hub**: 3D stacked cover flow, dynamic mood categories, listening history, heavy rotation favorites, top charts, and curated mixes.
- **Universal Ingestion**: Instant search and playlist importer supporting public Spotify, YouTube Music, and SoundCloud links.
- **Dedicated Track Experience**: Synchronized karaoke-style lyrics, full playback scrubber, and album navigation.
- **Studio DSP Engine**: Client-side 10-Band Graphic Equalizer (32Hz–16kHz), Sub-Bass warmth, spatial reverb, and preset import/export (`.json`).
- **Complete Library**: Custom playlist creation, sorting, search filter, and offline availability status.
- **Smart Sleep Timer**: Natural 30-second exponential volume fade-out.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Audio Engine**: HTML5 MediaElement + Web Audio API (`AudioContext`, `BiquadFilterNode`, `GainNode`)
- **Desktop Runtime**: Electron

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/viienz/kordive-music.git
cd kordive-music

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

### Production Build

```bash
npm run typecheck
npm run build
```

---

## License

Private & Proprietary. All rights reserved.
