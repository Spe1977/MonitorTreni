# Train Tracker PWA - Task List

- [x] **Phase 1: Project Scaffolding & Tooling**
  - [x] Initialize Vue 3 project with TypeScript in current directory.
  - [x] Install and configure Tailwind CSS.
  - [x] Configure Code Quality tools (ESLint, Prettier, Husky, lint-staged).
  - [x] Configure Testing tools (Vitest, Playwright).
  - [x] Setup GitHub Actions template.
- [x] **Phase 2: Cloudflare Functions Proxy**
  - [x] Set up `functions/api/` directory.
  - [x] Create proxy endpoints (`/api/train-status`, `/api/travel-solutions`, `/api/station-autocomplete`).
  - [x] Fix API base URL (corrected from `/infomobilita/` a `/infomobilitamobile/`).
  - [ ] Implement CORS restriction and basic Rate Limiting (as per sec 5.4).
- [x] **Phase 3: PWA Configuration & App Shell**
  - [x] Configure `vite-plugin-pwa` (manifest, service worker).
  - [x] Implement App Shell layout (Bottom Navigation).
  - [x] Implement offline fallback UI.
- [x] **Phase 4: Core Services & API Client**
  - [x] Create API client service.
  - [x] Define TypeScript interfaces for Viaggiatreno responses.
- [x] **Phase 5: View 1 - Stato Treno**
  - [x] Search input (accessible).
  - [x] Disambiguation UI (Bottom Sheet).
  - [x] Train Dashboard & Live Status badge.
  - [x] Route Timeline (animated).
  - [x] Unit & E2E Tests for Train Status flow (unit + smoke E2E con API mockata).
- [ ] **Phase 6: View 2 - Ricerca Viaggio** ⏸️ _Disabilitata: placeholder "Funzionalità in fase di sviluppo" mostrato nella vista. Componenti, CF Functions e API client correlati rimossi dal codice. Riabilitazione vincolata alla migrazione a Navitia.io._
- [ ] **Phase 7: Quality & Deployment**
  - [ ] Verify accessibility (A11y, WCAG, ARIA tags).
  - [ ] Verify Lighthouse score > 95.
  - [ ] Finalize GitHub Actions CI/CD for Cloudflare Pages.

---

## ⚠️ Problemi aperti emersi dall'analisi live API (2026-05-09)

- [ ] **Vista "Ricerca Viaggio" — migrazione a Navitia.io** (decisione presa 2026-05-09, vista disabilitata con placeholder 2026-05-10). L'endpoint `soluzioniViaggioNew` di ViaggiaTreno è stato dismesso dal provider (confermato da [dltmtt/viaggiatreno-api](https://github.com/dltmtt/viaggiatreno-api), [MarcoBuster/railway-opendata](https://github.com/MarcoBuster/railway-opendata) e dal blog di [Jacopo Jannone](https://blog.jacopo.io/it/post/trenitalia-reverse-engineering/)). I file della vecchia implementazione (`StationInput.vue`, `TravelSolutionCard.vue`, `functions/api/station-autocomplete.ts`, `functions/api/travel-solutions.ts`, metodi `searchStation`/`searchTravelSolutions` in `api.ts`) sono stati rimossi. La vista mostra "Funzionalità in fase di sviluppo". Step per riabilitarla con Navitia:
  - [ ] Registrazione utente su https://navitia.io/inscription per ottenere il token (azione manuale, non automatizzabile).
  - [ ] Configurare il token come secret Cloudflare Pages (`NAVITIA_TOKEN`), mai committarlo.
  - [ ] Verificare via `GET https://api.navitia.io/v1/coverage` che la coverage italiana includa Trenitalia (cercare un id tipo `it-trenitalia` o simili). Se non è coperta, fallback a opzione "Tabellone Stazione" via ViaggiaTreno `partenze`/`arrivi`.
  - [ ] Creare `functions/api/travel-solutions.ts` che chiami `GET /coverage/{region}/journeys?from={lon;lat}&to={lon;lat}&datetime=YYYYMMDDTHHMMSS` con header `Authorization: <token>`.
  - [ ] Creare `functions/api/station-autocomplete.ts` che usi `/coverage/{region}/places?q=<text>&type[]=stop_area` per ottenere coordinate (lat/lon) necessarie a `journeys`.
  - [ ] Ripristinare `src/services/api.ts` con le interfacce e i metodi (`Station`, `TravelSolution`, `Vehicle`, `searchStation`, `searchTravelSolutions`) adattati al payload Navitia (`journeys[].sections[]`).
  - [ ] Sostituire il placeholder in `src/components/TravelSearchView.vue` con la UI reale (form A→B + cards delle soluzioni).
  - [ ] Tenere ViaggiaTreno per "Stato Treno" (già funzionante).
- [ ] **CORS restriction + Rate Limiting** sul proxy Cloudflare Functions (sez. 5.4) — attualmente `_middleware.ts` permette `Access-Control-Allow-Origin: *` e non c'è alcun rate limiting. Da restringere al solo dominio di produzione e aggiungere throttling base. Opzioni valutate (2026-05-10):
  - **CORS strict**: in `_middleware.ts` restringere a `Access-Control-Allow-Origin: https://<dominio-pages>.pages.dev` (e custom domain se configurato), via env var `ALLOWED_ORIGIN`.
  - **Rate limit globale per-IP** (raccomandato): contatore Cloudflare KV `ratelimit:<ip>:<YYYY-MM-DD>`, limite ~30 req/min e ~500 req/giorno per IP, header `cf-connecting-ip` come chiave. Free tier KV sufficiente. Skippare il per-utente: senza login, "utente" = IP o fingerprint aggirabile, valore aggiunto basso rispetto a per-IP.
  - **Alternativa zero-code**: Cloudflare Rate Limiting nativo via dashboard (richiede Workers Paid ~$5/mese o Pro plan).
- [ ] **Test E2E reali per il flusso "Stato Treno"** — al momento c'è solo uno smoke test con API mockata. Dopo aver verificato che `andamentoTreno` ora riceve correttamente il `departureTimestamp`, vale la pena aggiungere un E2E end-to-end con disambiguazione (>1 risultato → BottomSheet) e rendering della timeline.
- [ ] **Test E2E reali per "Ricerca Viaggio"** — attualmente solo smoke sul cambio tab; bloccato dal punto 1.
- [ ] **Theme color manifest** — già allineato a `#aa3bff` / `#0d0e1a`, ma da verificare visivamente su Android/iOS reali (sez. 5.5).
- [ ] **Base URL ViaggiaTreno** — la documentazione di terzi ([dltmtt](https://github.com/dltmtt/viaggiatreno-api), [MarcoBuster](https://github.com/MarcoBuster/railway-opendata)) raccomanda `/infomobilita/` invece di `/infomobilitamobile/`. Verificato live: entrambi rispondono, ma `/infomobilita/` è il path canonico. Da uniformare nei 4 file `functions/api/*.ts` quando tocchiamo nuovamente quel codice.
- [x] **Dev server con Cloudflare Functions attive** — `npm run dev` ora lancia Wrangler (`wrangler pages dev --port 8788 -- vite`); aprire `http://localhost:8788`. Risolto il bug per cui il vecchio `npm run dev` (solo Vite) restituiva `index.html` per `/api/*` causando il messaggio "Errore di connessione".
- [x] **Date/orari fermate normalizzati nel proxy** — l'API ViaggiaTreno restituisce `partenza_teorica`/`arrivo_teorico` (snake_case) e omette i flag `isPartenzaEffettuata`/`isArrivoEffettuato`; il proxy `train-status.ts` ora rimappa in camelCase e deriva i flag da `partenzaReale`/`arrivoReale`.
- [x] **Vista "Ricerca Viaggio" sostituita da placeholder** — pagina disabilitata con messaggio "Funzionalità in fase di sviluppo" (2026-05-10), file orfani rimossi (`StationInput.vue`, `TravelSolutionCard.vue`, `HelloWorld.vue`, le due Functions, gli unit test).
- [x] **PWA ottimizzata (2026-05-10)** — manifest aggiornato (`name: "MonitorTreni"`, `lang: "it"`, `orientation: "portrait"`, `categories`, `purpose: "any"` sulle icone), `index.html` arricchito con `apple-touch-icon`, `mask-icon`, `apple-mobile-web-app-*`, `mobile-web-app-capable`, `viewport-fit=cover`. Manca ancora un PNG maskable per Android adaptive icons (TODO opzionale, non bloccante).
- [x] **Refactor `buildDepartureInfo`** — estratta la logica del badge data (5 varianti + status text dinamico) in `src/components/departureInfo.ts` con 8 unit test dedicati. Bug fix incidentale: status "in viaggio" ora rispetta il `ritardo` (treno con +60min non viene marcato "corsa terminata" prematuramente); status "in partenza ora" se `now === orarioPartenza`.
- [x] **Gestione 204 in `train-status`** — l'API ritorna 204 quando il treno non è in circolazione per la data richiesta; il proxy ora restituisce `404 NOT_AVAILABLE` e il client mostra il messaggio specifico "Treno non in circolazione per la data odierna." (prima si vedeva "Impossibile recuperare lo stato del treno." generico).

---

## Riferimenti API Viaggiatreno

> Fonte ufficiale (non documentata, client JS auto-generato da RESTEasy):
> http://www.viaggiatreno.it/infomobilitamobile/rest-jsapi

**Base URL:** `http://www.viaggiatreno.it/infomobilitamobile`

Tutti gli endpoint sono `GET` e restituiscono JSON (tranne autocomplete che restituisce `text/plain`).

### Endpoint usati in questo progetto

| Endpoint                                                                                   | Funzione                   | Note                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/{numeroTreno}`                   | Autocomplete numero treno  | Risposta: `text/plain`, righe `"Numero - Origine - DD/MM/YY\|trainNumber-codOrigine-timestampMs"` (esempio: `9618 - ROMA TERMINI - 09/05/26\|9618-S08409-1778277600000`). Il `timestampMs` è la `dataPartenza` da usare in `andamentoTreno`. |
| `/resteasy/viaggiatreno/autocompletaStazione/{text}`                                       | Autocomplete nome stazione | Risposta: `text/plain`, righe `"Nome\|codice"`                                                                                                                                                                                               |
| `/resteasy/viaggiatreno/andamentoTreno/{codOrigine}/{numeroTreno}/{dataPartenza}`          | Stato treno live + fermate | Risposta: JSON complesso con campo `fermate[]`. **`dataPartenza` è il timestamp Unix in ms** restituito dall'autocomplete, NON il numero treno.                                                                                              |
| `/resteasy/viaggiatreno/soluzioniViaggioNew/{codOrigine}/{codDestinazione}/{dataPartenza}` | Soluzioni di viaggio A→B   | ⚠️ **Endpoint non funzionante via API pubblica** — il sito ufficiale lo invoca con path relativo `./resteasy/viaggiatreno/soluzioniViaggioNew/.../YYYY-MM-DDTHH:mm:ss` ma chiamato direttamente ritorna 404. Da rivedere prima del rilascio. |

### Endpoint aggiuntivi disponibili (da espandere in futuro)

| Endpoint                                                                        | Funzione                         |
| ------------------------------------------------------------------------------- | -------------------------------- |
| `/resteasy/viaggiatreno/partenze/{codiceStazione}/{orario}`                     | Tabellone partenze da stazione   |
| `/resteasy/viaggiatreno/arrivi/{codiceStazione}/{orario}`                       | Tabellone arrivi in stazione     |
| `/resteasy/viaggiatreno/tratteCanvas/{codOrigine}/{numeroTreno}/{dataPartenza}` | Tratta geografica su mappa       |
| `/resteasy/viaggiatreno/getCoordinateStazione/{codstazione}`                    | Coordinate GPS stazione          |
| `/resteasy/news/infomobility`                                                   | Notizie infomobilità per regione |
| `/resteasy/news/smartcaring`                                                    | Notizie Smart Caring per treno   |

### Note importanti

- **Non ufficiali:** Nessuna garanzia di stabilità. Gli endpoint possono cambiare senza preavviso.
- **CORS:** Le API non rispondono a richieste cross-origin dal browser → obbligatorio il proxy Cloudflare.
- **ID Stazione:** Il codice stazione ha formato `S` + 5 cifre (es. `S08409` per Roma Termini, `S01700` per Milano Centrale).
- **Timestamp:** Per `andamentoTreno` la `dataPartenza` è un timestamp Unix in millisecondi (ottenuto dall'autocomplete treno). Per gli endpoint orario (es. `partenze/arrivi`) si usa lo stesso formato.

---

## Riferimenti API Navitia.io (per "Ricerca Viaggio" A→B)

> Documentazione ufficiale: https://doc.navitia.io
> Registrazione free tier: https://navitia.io/inscription

**Base URL:** `https://api.navitia.io/v1`

**Autenticazione:** header `Authorization: <token>`. Token privato, da NON committare. Va salvato come secret/env-var sul deploy (Cloudflare Pages → Settings → Environment Variables → `NAVITIA_TOKEN`).

### Endpoint utili al progetto

| Endpoint                                             | Funzione                             | Note                                                                                                                                                                                                             |
| ---------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/coverage`                                          | Lista delle regioni coperte          | Da chiamare una volta per individuare la coverage italiana (es. `it-…`).                                                                                                                                         |
| `/coverage/{region}/places?q=<txt>&type[]=stop_area` | Autocomplete stazioni con coordinate | Restituisce `stop_areas` con `coord.lat`/`coord.lon` necessari a `journeys`.                                                                                                                                     |
| `/coverage/{region}/journeys`                        | Trip planner A→B                     | Query: `from=<lon>;<lat>&to=<lon>;<lat>&datetime=YYYYMMDDTHHMMSS`. Risposta: `journeys[].sections[]` con `departure_date_time`, `arrival_date_time`, `display_informations.headsign`, ritardi via `disruptions`. |
| `/coverage/{region}/stop_areas/{id}/departures`      | Tabellone partenze realtime          | Eventuale fallback / vista aggiuntiva.                                                                                                                                                                           |

### Note di integrazione

- **Free tier:** rate limit indicativo 30k richieste/mese, da verificare al momento della registrazione.
- **Copertura Trenitalia:** dichiarata nella documentazione, da confermare empiricamente sul `/coverage` proprio token. Se assente, valutare opzione fallback (Tabellone Stazione via ViaggiaTreno `partenze`/`arrivi`).
- **Formato date:** Navitia usa `YYYYMMDDTHHMMSS` (basic ISO senza separatori), diverso da ViaggiaTreno.
