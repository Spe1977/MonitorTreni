# MonitorTreni

PWA minimalista per il monitoraggio in tempo reale dei treni in Italia (Trenitalia, Trenord, TPER).
Stack: **Vue 3 + TypeScript + Tailwind CSS + Vite + Cloudflare Pages Functions**.

## Funzionalità

- **Stato Treno** — ricerca per numero treno, badge ritardo live, timeline percorso con orari teorici e reali per ogni fermata, indicatore "OGGI / DOMANI / IERI" con stato dinamico (in partenza tra X / in viaggio / corsa terminata).
- **Disambiguazione omonimie** via Bottom Sheet accessibile (focus management, chiusura con `Esc`, scroll lock) quando l'API restituisce più treni con lo stesso numero.
- **Tema chiaro / scuro** automatico con persistenza su `localStorage`. Implementato con la variant nativa `dark:` di Tailwind 4 (zero ramificazioni `:class` runtime).
- **Layout responsivo** — Bottom Navigation a una mano su mobile, sidebar fissa e dashboard a due colonne (cruscotto + timeline) da breakpoint `md`/`lg` in su.
- **PWA installabile** su iOS e Android, con App Shell offline e service worker auto-update.
- **Ricerca soluzioni viaggio (A→B)** — al momento mostra placeholder "Funzionalità in fase di sviluppo" (vedi `task.md` per la roadmap Navitia.io).

## Design System

- **Palette**: blu (`#2563eb`) + indaco/sky come accenti, rosso/smeraldo riservati allo stato del treno (vedi `DESIGN.md`).
- **Font**: `Space Grotesk` (300–800), caricato da Google Fonts con `preconnect`.
- **Vetro**: stile `glassmorphism` con due livelli (`.glass`, `.glass-strong`) accelerati in hardware (`translateZ(0)`), sfumature di sfondo "ambient blob".
- **Accessibilità**: target touch ≥ 44px, contrasti WCAG-conformi, `aria-live`/`aria-modal`/`role="alert"` su feedback async, label dedicate sui controlli icona.
- **Performance**: `v-memo` + `content-visibility: auto` sulle fermate della timeline, `will-change` mirato su animazioni, font con `display=swap`.

## Sviluppo locale

> Prerequisiti: Node.js ≥ 20, npm.

```bash
npm install
npm run dev
```

Apri il browser su **`http://localhost:8788`** (Wrangler Pages dev davanti a Vite, intercetta `/api/*` con le Cloudflare Functions).

⚠️ NON usare `http://localhost:5173` direttamente: quella porta serve solo il frontend, le API Functions non vengono eseguite e ogni chiamata `/api/*` ritornerà l'`index.html` come fallback → "Errore di connessione".

Per lavorare solo sul frontend (es. CSS) senza chiamare le API: `npm run dev:vite` su `http://localhost:5173`.

## Script

| Comando                           | Descrizione                                                    |
| --------------------------------- | -------------------------------------------------------------- |
| `npm run dev`                     | Wrangler + Vite dev server (porta 8788)                        |
| `npm run dev:vite`                | Solo Vite (porta 5173)                                         |
| `npm run build`                   | Type-check (`vue-tsc`) + bundle di produzione + service worker |
| `npm run preview`                 | Anteprima del bundle di produzione                             |
| `npm run test:unit`               | Test unitari Vitest (jsdom)                                    |
| `npm run test:e2e`                | Test E2E Playwright (Mobile Chrome + Mobile Safari)            |
| `npm run lint`                    | ESLint con auto-fix                                            |
| `npm run format` / `format:check` | Prettier                                                       |

## Struttura

```
src/
  components/        # Vue SFC + utils (departureInfo.ts) + __tests__/
  services/api.ts    # Client API tipizzato verso il proxy
  App.vue, main.ts   # Entry point + service worker registration
functions/api/       # Cloudflare Pages Functions (proxy ViaggiaTreno)
  _middleware.ts     # CORS headers
  train-autocomplete.ts
  train-status.ts
e2e/                 # Test Playwright
public/              # train.svg, favicon, asset PWA
```

## PWA

- **Installabile**: manifest valido (`name`, `short_name`, `theme_color`, `background_color`, `start_url`, `scope`, `icons` 192/512, `lang: it`, `categories`).
- **Offline**: il service worker (Workbox via `vite-plugin-pwa`) precachea l'App Shell. Se l'utente è offline e l'API è irraggiungibile, viene mostrato l'overlay "Sei offline" (`@vueuse/core` `useNetwork`).
- **Auto-update**: `registerType: 'autoUpdate'` con `skipWaiting` + `clientsClaim`. La nuova versione si attiva alla successiva navigazione.
- **iOS**: `apple-touch-icon`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style: black-translucent` per integrazione "Aggiungi a Home" coerente.
- **Android**: `theme-color` + `mobile-web-app-capable` per status bar colorata in modalità standalone.
- **Bundle size**: ~165 KB precache totale (~42 KB gzip per il chunk JS principale).

## Deploy (Cloudflare Pages)

Il progetto è progettato per Cloudflare Pages con Functions integrate.

1. Collega il repo GitHub a Cloudflare Pages.
2. Build command: `npm run build`. Output directory: `dist`.
3. Le Cloudflare Functions in `functions/api/*` vengono deployate automaticamente.
4. Branch `main` → produzione; altri branch → preview deployments.

Le API ufficiali ViaggiaTreno non rispondono a richieste cross-origin: il proxy Cloudflare è obbligatorio (vedi `task.md` § "Riferimenti API ViaggiaTreno").

## Documentazione di progetto

- [`PRODUCT.md`](./PRODUCT.md) — utenti, scopo, brand personality, principi di design
- [`DESIGN.md`](./DESIGN.md) — design system (palette, tipografia, elevation, componenti)
- [`sito.md`](./sito.md) — specifica funzionale dell'MVP
- [`task.md`](./task.md) — roadmap, problemi aperti, riferimenti API
