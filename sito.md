Specifica di Progetto: Train Tracker PWA (MVP)

Data: 09 Maggio 2026

1. Ambiente di Sviluppo e Setup

Questa applicazione sarà sviluppata interamente tramite LLM assistito.
L'ambiente di lavoro sul quale andranno eseguiti i comandi è:

Sistema Operativo: Linux Zorin OS 18.1 Pro.

Toolchain pre-installata: Node.js e npm sono già installati e configurati nel sistema.

Nota per l'LLM sviluppatore: Fornire comandi bash compatibili con Debian/Ubuntu (base di Zorin OS) e utilizzare npm come package manager primario per lo scaffolding e l'installazione delle dipendenze.

2. Obiettivo del Progetto

Realizzare una Progressive Web App (PWA) ultra-minimalista per il monitoraggio in tempo reale degli orari e dei ritardi dei treni in Italia (copertura Trenitalia, Trenord, TPER). L'interfaccia deve essere moderna, pulita e ottimizzata per l'uso mobile a una mano (target: pendolari).

3. Esclusioni dall'MVP (YAGNI)

Per garantire una rapida messa in produzione e un'alta stabilità, le seguenti funzionalità sono esplicitamente escluse da questa prima iterazione:

Integrazione con i treni Italo (mancanza di API pubbliche documentate e gratuite).

Salvataggio dei Preferiti o della Cronologia Ricerche (l'app avrà un approccio "usa e getta").

Integrazioni con hardware nativo o sensori dello smartphone (GPS, Fotocamera, Bluetooth, Calendario).

Qualsiasi forma di database backend persistente o autenticazione utente.

4. Stack Tecnologico

Linguaggio: TypeScript (per garantire type safety e robustezza del codice).

Frontend Framework: Vue.js (per leggerezza, reattività e facilità di generazione come PWA).

Styling: Tailwind CSS (per design su misura, pulito e supporto nativo e automatico al tema Chiaro/Scuro).

Sorgente Dati: API pubblica non ufficiale "Viaggiatreno".

Hosting e Infrastruttura: Deploy del frontend su Cloudflare Pages.

Infrastruttura Proxy API: Per superare i blocchi CORS dei browser per le PWA, le chiamate alle API di Viaggiatreno verranno instradate attraverso Cloudflare Pages Functions integrate direttamente nel progetto.

Gestione dello Stato: Memoria puramente effimera (svuotata al cambio pagina).

5. Stabilità, Sicurezza e Qualità del Codice

5.1. Testing e Standardizzazione

Test Unitari e di Componente: Utilizzo di Vitest per testare la logica di business e il corretto rendering.

Test End-to-End (E2E): Utilizzo di Playwright per simulare i flussi utente reali sul browser.

Linting e Formattazione: ESLint per l'analisi statica; Prettier per la formattazione automatica.

Pre-commit Hooks: Utilizzo di Husky e lint-staged per impedire il commit di codice mal formattato.

5.2. Automazione, CI/CD e Deploy

Deploy Automatico: Integrazione nativa tra repository (es. GitHub) e Cloudflare Pages per build e pubblicazione automatica ad ogni push sul branch principale.

Continuous Integration: Pipeline GitHub Actions per eseguire test (Vitest/Playwright) e controlli ESLint su ogni nuova Pull Request prima che venga unita.

5.3. Resilienza e Gestione Errori (UX/UI)

Gestione Offline: Configurazione del Service Worker per memorizzare l'"App Shell" nella cache. In assenza di rete, l'app mostrerà un avviso grafico ("Sei offline") senza mostrare la pagina di errore del browser.

Graceful Degradation: Se le API vanno in timeout, l'app mostrerà messaggi user-friendly senza bloccare l'interfaccia.

5.4. Sicurezza, Performance e Standard Web

Sicurezza Proxy: Le Cloudflare Functions includeranno restrizioni CORS (solo il nostro dominio Cloudflare potrà chiamarle) e un Rate Limiting di base.

Obiettivi Lighthouse: Punteggio >90 in tutte le categorie (Performance, Accessibility, Best Practices, SEO).

Accessibilità (A11y): Contrasto colori ottimizzato per l'uso all'aperto (standard WCAG) e utilizzo di HTML semantico/tag ARIA per il supporto agli screen reader (TalkBack/VoiceOver).

Gestione Dati/Ore: Utilizzo esclusivo delle API native del browser (Intl.DateTimeFormat) per limitare il peso del bundle, vietato l'uso di librerie pesanti come Moment.js.

5.5. Configurazione PWA e UX di Sistema

Il file manifest.json e i meta-tag dovranno definire rigorosamente il theme_color e il background_color per far colorare correttamente la barra di stato di Android e iOS, garantendo l'effetto "App Nativa".

6. UI/UX e Navigazione Strutturale

L'applicazione si struttura su due viste principali gestite tramite una Bottom Navigation Bar fissa.

6.1. Vista 1: "Stato Treno" (Schermata di Default)

Input: Un singolo campo di testo grande e accessibile per digitare il numero del treno.

Gestione Omonimie (Disambiguazione):

Se l'API restituisce 1 risultato: passaggio istantaneo al cruscotto di dettaglio.

Se l'API restituisce >1 risultato: Bottom Sheet scorrevole dal basso con le opzioni disponibili.

Cruscotto Treno (Dettaglio):

Intestazione: Numero, Categoria, Stazione Partenza/Arrivo (con orari programmati ed effettivi).

Stato Live: Un badge visivo prominente che indica lo stato corrente (es. "In orario", "+5 min").

Timeline: Linea temporale verticale con tutte le fermate del percorso e indicatore visivo animato per la posizione.

6.2. Vista 2: "Ricerca Viaggio" (Soluzioni da A a B)

Input Form: Area compatta con campi per: Stazione di Partenza, Stazione di Arrivo, Data e Ora (preimpostate ad adesso).

Risoluzione Stazioni: Traduzione automatica del nome stazione nel codice univoco richiesto dall'API (es. "S01700").

Elenco Soluzioni: Lista di schede (cards) che indicano: orario partenza/arrivo, durata, numero di cambi e treni.

Stato Live Integrato: Il ritardo in tempo reale dei treni in circolazione viene mostrato direttamente all'interno della card.
