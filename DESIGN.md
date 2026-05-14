---
name: MonitorTreni
description: PWA minimalista per il monitoraggio in tempo reale dei treni in Italia.
colors:
  primary: "#2563eb"
  primary-light: "#60a5fa"
  secondary: "#0284c7"
  success: "#10b981"
  error: "#ef4444"
  neutral-bg-dark: "#0d0e1a"
  neutral-bg-light: "#f1f5f9"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "text-4xl (36px)"
    fontWeight: 800
  headline:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "text-2xl (24px)"
    fontWeight: 700
  title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "text-lg (18px)"
    fontWeight: 800
  body:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "text-sm (14px)"
    fontWeight: 400
  label:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "text-xs (12px)"
    fontWeight: 700
    letterSpacing: "wider"
rounded:
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "20px"
components:
  card-glass:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  button-primary:
    backgroundColor: "linear-gradient(to bottom right, {colors.primary}, {colors.secondary})"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "8px 20px"
---

# Design System: MonitorTreni

## 1. Overview

**Creative North Star: "The Commuter's HUD"**

Questo design system si basa sull'efficienza e sulla visibilità immediata. Immagina il cruscotto di chi viaggia: sfondi profondi, contrasti netti e dati che emergono attraverso strati di vetro opacizzato ("glassmorphism"). L'estetica è moderna e pulita, senza elementi che intralcino la lettura degli orari e dei ritardi. Il layout è ottimizzato per dispositivi mobili, garantendo immediatezza anche in condizioni di scarsa connettività.

**Key Characteristics:**
- **Glassmorphism funzionale:** L'effetto vetro non è puramente decorativo, ma separa i livelli di informazione dallo sfondo.
- **Accenti luminosi (Glow):** L'uso di gradienti e ombre colorate guida l'occhio sui dati cruciali (es. ritardo del treno).
- **Leggibilità assoluta:** Font sans-serif geometrico e pesi bold usati in modo strategico.

## 2. Colors

La palette si basa su toni profondi per lo sfondo con gradienti luminosi che fanno risaltare i dati. 

### Primary
- **Deep Blue** (#2563eb): Il colore principale per bottoni e accenti attuali.
- **Sky Light** (#60a5fa): Usato per i gradienti e gli effetti testuali.

### Secondary
- **Azure Sky** (#0284c7): Usato per chiudere il gradiente della Primary, creando profondità.

### Neutral
- **Deep Space** (#0d0e1a): Lo sfondo principale della modalità scura, per massimo contrasto.
- **Slate Light** (#f1f5f9): Lo sfondo per la modalità chiara.

### Status
- **Success Emerald** (#10b981): Treno in orario.
- **Error Red** (#ef4444): Treno in ritardo.

### Named Rules
**The Status First Rule.** I colori semantici (Rosso e Smeraldo) sono riservati esclusivamente allo stato del treno. Non usarli mai come decorazione per altri elementi.

## 3. Typography

**Display Font:** Space Grotesk (with system-ui, sans-serif)
**Body Font:** Space Grotesk (with system-ui, sans-serif)

**Character:** Strumentale, tecnico e altamente leggibile. I numeri e i codici dei treni devono poter essere letti a colpo d'occhio.

### Hierarchy
- **Display** (800, 36px, tight): Usato per il numero del treno, enorme e inequivocabile.
- **Headline** (700, 24px, tight): Titoli principali (es. "Sei offline").
- **Title** (800, 18px, tight): Logo e sezioni importanti della dashboard.
- **Body** (400, 14px, normal): Testo descrittivo, messaggi di errore.
- **Label** (700, 12px, wider): Badge di stato, categorie treno (es. "REG", "PARTENZA"). In maiuscolo.

### Named Rules
**The Data Emphasis Rule.** I dati numerici (ritardi, orari, numero treno) devono sempre avere un peso Bold o Extrabold.

## 4. Elevation

Il sistema usa il "Glassmorphic Layering" su uno sfondo scuro o chiaro. Le carte non sono solide, ma semi-trasparenti, con un leggero bordo luminoso.

### Shadow Vocabulary
- **Glow Ambientale** (`box-shadow: 0 0 30px rgba(37, 99, 235, 0.3)`): Usato per elementi in caricamento (loader) per comunicare attività.
- **Card Glass** (`background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(16px)`): Lo strato base per raggruppare i contenuti.

### Named Rules
**The Glass Only Rule.** I contenitori principali devono usare lo stile `.glass` per mantenere la consistenza. Evita sfondi solidi opachi per le card.

## 5. Components

### Cards / Containers
- **Corner Style:** Molto arrotondato (16px, `rounded-2xl`).
- **Background:** Effetto vetro (`.glass` o `.glass-strong`).
- **Border:** Un bordo sottilissimo bianco (o nero in modalità light) semitrasparente per delimitare la forma (`rgba(255,255,255,0.08)`).
- **Internal Padding:** Generoso (20px, `p-5`).

### Buttons
- **Shape:** Arrotondato (12px, `rounded-xl`).
- **Primary:** Gradiente da Blue a Sky, testo bianco, font semibold.
- **Hover / Focus:** Transizione scale-95 al click, leggero cambiamento di opacità.

### Inputs / Fields
- **Style:** Effetto vetro, padding generoso (`py-4`), arrotondamento `rounded-2xl`.
- **Focus:** Anello luminoso attorno al campo di input (es. `focus:ring-blue-500/60`).

### Badges / Tags
- **Style:** Sfondo semitrasparente con lo stesso colore del testo (es. sfondo verde al 10%, testo verde acceso). Lettere maiuscole, tracking largo.

## 6. Responsive Layout

Il layout è mobile-first e si adatta a desktop senza cambiare il design system.

### Breakpoints (Tailwind defaults)
- **< 768px** (mobile): Bottom Navigation fissa, header in alto con logo + toggle tema, contenuto centrato su `max-w-md`. Pensato per uso a una mano in movimento.
- **≥ 768px** (`md`, tablet): Sidebar laterale fissa (256–288px, `w-64 lg:w-72`) con navigazione verticale; scompaiono la bottom nav e l'header mobile. Il contenuto principale si allarga a `max-w-2xl`.
- **≥ 1024px** (`lg`, desktop): Lo "Stato Treno" passa a layout a due colonne — cruscotto sticky a sinistra (`w-[420px]`) e timeline allargata a destra. `max-w-5xl` con padding generoso.

### Named Rules
**The One-Hand Rule.** Su mobile la primaria interazione deve essere raggiungibile con il pollice → CTA primaria, navigazione e azioni distruttive sempre nella zona inferiore o vicino al campo input attivo.

**The Same System Rule.** Sidebar desktop e Bottom Nav mobile usano gli stessi token (gradiente blu→indaco per lo stato attivo, glass background, font/peso identici). Cambia solo l'orientamento.

## 7. Do's and Don'ts

Le seguenti regole mantengono il focus dell'app come "HUD" rapido ed essenziale.

### Do:
- **Do** evidenziare il ritardo del treno con badge grandi e inequivocabili.
- **Do** usare il glassmorphism per alleggerire visivamente l'interfaccia e mostrare gli sfondi sfocati retrostanti.
- **Do** ottimizzare l'interazione per l'utilizzo a una sola mano (es. bottom navigation).

### Don't:
- **Don't** creare interfacce complesse, menu sovraccarichi e processi macchinosi (come spesso accade sui siti istituzionali).
- **Don't** usare colori saturi per lo sfondo delle intere card, mantienili per dettagli, testo e accenti (gradient bar).
- **Don't** nascondere l'orario o il binario dentro fisarmoniche o tab secondari.
