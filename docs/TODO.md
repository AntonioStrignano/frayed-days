# TODO List

## Fase 0 – Fondamenta Cognitivo/Strategiche
*(Obbligatorie prima di qualunque produzione)*

- **Visione sintetica** (elevator pitch)
- **Genere + loop centrale**
- **Unique selling points**
- **Ambito / scope** (cosa entra / cosa resta fuori)
- **Profilo giocatore** (motivazioni, session length, skill ceiling)
- **Target piattaforme** (impatta input, performance, packaging)
- **Pillars** (3–5 principi non negoziabili)
    *(Questi definiscono il perimetro: se mancano, ogni scelta dopo rischia rework.)*

### Fondamenta Design Coerente (Aggiornamento)
- **Conferma puzzle lineup finale (6 archetipi)**
- **Integra nuovo sistema monotonia (skip-driven)**
- **Stesura tabella tier palette bipolare (7) + hysteresis**
- **Definizione token sequence deterministica + cap 4**
- **Definizione Patto punitivo scaling (formula)**
- **Definizione Burnout soglie 6/9/12 + day pattern trigger**
- **GrowthScore + Monotonia base formulas centralizzate in DATA_MODEL.md**
- **Aggiornare DESIGN.md sezioni: Puzzle Progression, Monotony, Palette, Burnout, Tokens, Pact**
- **Puntatore implementazione Phase A (Memory / Timing / Risk) con nuova economia (failure reward + token guaranteed)**

---

## Fase 1 – Struttura di Gioco di Base
*(Design logico prima del contenuto – spec strutturata + valutazione + punti decisione sospesi)*

### 1. Core loop

#### 1.1 Fasi sequenziali (macro)
1. Avviare run (init variabili giorno 1)
2. Entrare prima stanza introduttiva (presa coscienza contesto)
3. Selezionare nodo successivo (puzzle / comfort / altro)
4. Eseguire nodo (puzzle: input → esito / non‑puzzle: applica effetti)
5. Aggiornare stato (growth, monotony, streak, token queue, palette, burnout)
6. Fornire feedback (UI valori, micro testo, variazione palette/audio)
7. Ripetere selezione nodi fino a stanza finale giorno (room 7)
8. Eseguire riepilogo fine giornata (conversioni, skill spend, clearing giornaliero)
9. Avanzare giorno (applicare risultati differiti, spawn nuovi nodi)
10. Al giorno soglia: valutare condizioni finale (growth / monotony lock)
11. Concludere run (finale growth / monotony / continua)

#### 1.2 Stati aggiornati per nodo
day_index, run_index, room_slot (1–7), monotony, growth_total, growth_score (se resta), puzzle_tier_per_type, puzzle_success_streak / fail_streak per tipo, tokens_inventory, token_queue_index, comfort, skips_today, pact_count, pact_decline_streak, burnout_stage, palette_tier, skills_unlocked, shop_items_owned, fragments_collected, hints_unlocked, depth (growth_total − monotony), time_in_day, retry_flag.

#### 1.3 Condizione uscita loop giorno
room_slot == 7 (comfort/finale di giornata) AND nodo risolto → trigger EndOfDay.

#### 1.4 Condizioni uscita loop run
- Finale Growth: day_index == 12 AND growth_total > monotony AND (opzionale: depth >= soglia) → pulsante “Guardati indietro”.
- Finale Monotony Lock: day_index ≥ 15 AND monotony_lock_flag true → pulsante “Loop” / “Routine”.
- Continuare: nessuna condizione raggiunta → start next day (day_index +1).
- Extra finale growth prolungato (NON definito qui).

#### 1.5 Tempo target ciclo nodo (decisione)
TARGET: 45–70 s puzzle (Easy <40 s) + 10–15 s decision inter‑nodo. HARD CAP: 90 s senza feedback.
TODO_DECISION_NODE_TIME.

#### 1.6 Max passi senza feedback visivo sostanziale
Suggerito: ≤2 azioni o ≤5 s.
TODO_DECISION_MAX_FEEDBACK_GAP.

---

### 2. Meccaniche primarie

#### 2.1 Elenco irrinunciabili
Navigazione, Node selection, Puzzle tier progression, Reflection (hint gating), Monotony accrual, Growth accumulation, Token deterministic cycle, Burnout, Palette bipolar tiers, End-of-day summary, Pact.

#### 2.2 Scopo funzionale (1 riga)
- Navigazione: ancorare scelta spaziale (diegesi).
- Node selection: generare costo opportunità.
- Puzzle progression: skill scaffolding e reward scaling.
- Reflection: trasformare fallimento in miglioramento strutturato.
- Monotony: misura erosione da avoidance/stasi.
- Growth: misura progresso deliberato.
- Token cycle: pianificazione micro strategica.
- Burnout: freno a iper‑grinding puzzle.
- Palette tiers: feedback visivo stato meta.
- End-of-day: checkpoint e conversioni differite.
- Pact: trade a lungo termine ad alto rischio.

#### 2.3 Meccaniche “raffreddabili” senza spezzare prototipo
Pact, Burnout (disattivare debuff tenendo contatore).

#### 2.4 Vincoli (una cosa da non fare per meccanica)
Navigazione: no puzzle ambientali.
Node selection: no branching narrativo complesso.
Puzzle: no RNG opaco sugli esiti base.
Reflection: no skip puzzle.
Monotony: no decremento tramite successi normali.
Token: no randomizzazione ordine.
Burnout: no azzeramento passivo.
Palette: no salto >1 tier per evento.
Pact: no scelta dominante positiva.

---

### 3. Failure states + recovery

#### 3.1 Tipi failure
Puzzle fail, Retrocessione tier, Burnout escalation (Stage1/2/3), Patto accettato (self‑imposed), Skip/rinuncia, Monotony lock (terminale).

#### 3.2 Costi / recupero (sintesi)
- Puzzle fail: reward ridotta (35%), rallenta tier; recovery = retry / reflection.
- Retrocessione tier: perdita reward futura; recovery = successi consecutivi.
- Burnout Stage1/2: malus timer/reward; recovery = nodo Comfort/Reflect.
- Burnout Stage3: giornata comfort forzata + monotony spike; recovery = completare giornata.
- Patto: monotony + penalty growth next day; recovery = decline streak.
- Skip/rinuncia: monotony +, palette degrade; recovery = reflection disciplinata.
- Monotony lock: run terminata.

#### 3.3 Recupero burnout Stage1 → neutro
Modello alternativo: 1 nodo Comfort/Reflect per -1 stage.
TODO_BURNOUT_RECOVERY_MODEL.

#### 3.4 Soglia percezione stallo puzzle fail
3 fail consecutivi → hint/ritmo.

#### 3.5 Feedback didascalico
Solo Patto esplicito. Marcatura: FEEDBACK_EXPLICITO_SOLO_PATTO.

---

### 4. Sistema salvataggi

#### 4.1 Frequenza commit
Dopo puzzle, dopo nodo non-puzzle, fine giorno, fine run.

#### 4.2 Struttura
Singolo file slot_01 + validazione coerenza.

#### 4.3 Chiavi imprescindibili
run_index, day_index, room_slot, monotony, growth_total, growth_score, comfort, skips_today, skips_run, tokens_inventory, token_queue_index, puzzle_tiers, puzzle_success_streaks, puzzle_fail_streaks, hints_unlocked, burnout_stage, palette_tier, pact_count, pact_decline_streak, fragments, depth, patto_pending_flag, version_id.

#### 4.4 Compatibilità
Invalidare e messaggio “save incompatible”.

#### 4.5 Limite dimensione target
≤32KB JSON. TODO_CONFIRM_SAVE_SIZE.

#### 4.6 Telemetria nel save
NO (separata).

---

### 5. Telemetria (baseline)
Set minimo proposto: NodeChosen, PuzzleResult, ReflectionUsed, Skip, TokenUse, BurnoutStageChange, PaletteTierChange, PattoDecision, DayEnd, RunEnd.
TODO_TELEMETRIA_SPEC se non accettato.

---

### 6. Sistema ricompense

#### 6.1 Growth curve placeholder (% cumulati vs obiettivo)
Giorni 1..12: [5, 12, 20, 30, 40, 50, 58, 65, 72, 80, 90, 100].
TODO_GROWTH_CURVE se diversa.

#### 6.2 Ritmo frammenti
Day3–4 / Day6–7 / Day10–12 (completamento set).

#### 6.3 Token deterministico
Confermato.

#### 6.4 Differenziale Hard vs Medium
Medium +50%, Hard +100%.

#### 6.5 Ricompensa meta più rara
Definire FRAMMENTO_RARO o SKILL_HIGH_TIER.
TODO_RARE_REWARD, TODO_PITY_THRESHOLD.

#### 6.6 Azione sterile
Decorare camera (solo cosmetico).

---

### 7. Economia

#### 7.1 Valute MVP
GC (Growth Coin), MC (Monotony Coin) [NUOVA], Token fittizi, Monotony (stato), Comfort.

#### 7.2 Ruoli
GC: progress skill tree.
MC: lato monotony (ibrido, da chiarire).
Token fittizi: micro vantaggi → convertibili in MC.
Monotony: rischio/erosione.
Comfort: buffer reflection.

#### 7.3 Fonti
GC: puzzle completati (delivery giorno dopo).
MC: conversione token fittizi (cap).
Token fittizi: scelte monotony / scorciatoie / puzzle(?)
Monotony: skip, rinuncia, patto, comfort overuse.
Comfort: nodo comfort (+ eventuali successi puzzle).
TODO_TOKEN_FONTS, TODO_DEFINE_MC_ROLE.

#### 7.4 Sink
GC & MC: skill unlock.
Token fittizi: consumo / conversione.
Comfort: reflection.
Monotony: nessun sink diretto (solo gestione indiretta).

#### 7.5 Negatività
Nessuna valuta negativa.

#### 7.6 Rapporto crescita:monotonia fine run target
Suggerito 1.2:1. TODO_RATIO_TARGET.

---

### 8. Bilanciamento – curve macro

#### 8.1 Monotonia target
Day1 5, Day4 18, Day8 28, Day12 <40.
TODO_MONOTONY_CURVE.

#### 8.2 GrowthScore target
Day1 4, Day4 15, Day8 30, Day12 50.
TODO_GS_CURVE.

#### 8.3 % Hard puzzle segmenti
Days1–2: 0% / Days3–5: ≤25% / Days6–8: ≤50% / Days9–12: ≤70%.

#### 8.4 % giocatori finale Growth ≤X run
5 run: 60–70%. TODO_FINAL_GROWTH_TARGET.

#### 8.5 Limite puzzle totali per run
CAP 48 (schema 4 puzzle/day *12). >54 = eccesso.

#### 8.6 Soglia abbandono interna
Monotony >55 prima di Day6 → flag. TODO_ADJUST_ABANDON (se serve).

---

### 9. Onboarding / first minute

#### 9.1 Righe testo primo minuto
≈20.

#### 9.2 Concetti nuovi per finestra (0–1 / 1–2 / 2–5 min)
Proposta 3 / 2 / 3. TODO_CONCEPT_PACING.

#### 9.3 Primo evento monotonia
Skip puzzle (o rinuncia) Day1.

#### 9.4 Prima scelta significativa
≈12 s.

#### 9.5 Prima Hard possibile
Day4 (gating su streak Medium).

#### 9.6 Condizione “loop base compreso”
Criterio: 1 fail + 1 reflection + 1 skip consapevole + 1 success Medium.
TODO_LOOP_COMPREHENSION_CRITERION se diverso.

---

### 10. UX flow grezzo

#### 10.1 Schermate
Title, SaveSelect, GameHub, PuzzleScene, ComfortRoom, SkillTree, DaySummary, RunSummary, Settings, LogViewer (dev), PauseOverlay.

#### 10.2 Transizioni obbligate
Title→SaveSelect →GameHub →(PuzzleScene|ComfortRoom|DaySummary) →RunSummary. SkillTree solo end-day. PauseOverlay da GameHub/PuzzleScene.

#### 10.3 Profondità stack UI max
Max 3 (target 2).

#### 10.4 HUD persistente
DayIndex, RoomSlot, Monotony, GrowthTotal, GrowthScore (se usata), TokenQueueNext, TokensHeld, BurnoutIndicator, PaletteTierIcon, SkipCountToday.

#### 10.5 Azioni ≤2 input
Retry, Reflection, Use token, Pause, Skip.

#### 10.6 Stato UI da evitare
Catena modali >1, overlay oscuranti multipli.

---

### 11. Accessibilità

#### 11.1 Palette alternative
3 (Standard, Deuteranopia, High Contrast). TODO_CONFIRM_COUNT.

#### 11.2 Scala font
1.0rem → 1.5rem (step 0.125). Display 2.5–3rem.

#### 11.3 Feedback ridondante stati critici
Colore + icona + testo: Burnout Stage change, Patto Offerto, Monotony Tier Down, Hard Unlock.

#### 11.4 Limite animazioni simultanee
≤5 (hard 8).

#### 11.5 Opzioni audio
Master, Music, SFX, UI, Ambient + Mute All.

#### 11.6 Contrasto minimo
≥4.5:1 testo normale; ≥3:1 ≥18px bold.

---

### 12. Vincoli temporali implementazione base

#### 12.1 Giorni stimati Phase A (3 puzzle + loop)
Suggerito 5. TODO_PHASEA_DAYS.

#### 12.2 Monotonia + palette
2 giorni.

#### 12.3 Riflessione + hint
1.5–2 giorni.

#### 12.4 Slack
30% (≈3 giorni). TODO_SLACK.

#### 12.5 Cut threshold
>130% tempo stimato → taglia pact/burnout. TODO_CUT_THRESHOLD_CONFIRM.

---

### Divergenze / conflitti introdotti
- MC vs Monotony (stato) → definire ruolo (TODO_DEFINE_MC_ROLE).
- Skill tree anticipato: valutare rischio drift.
- Timing nodo precedente “un paio di minuti” incompatibile con 48 puzzle/run (TODO_DECISION_NODE_TIME).
- Pacing concetti onboarding non formalizzato (TODO_CONCEPT_PACING).
- Loop comprehension criterion da finalizzare (TODO_LOOP_COMPREHENSION_CRITERION).

---

### TODO sintetici
TODO_DECISION_NODE_TIME
TODO_DECISION_MAX_FEEDBACK_GAP
TODO_BURNOUT_RECOVERY_MODEL
TODO_CONFIRM_SAVE_SIZE
TODO_TELEMETRIA_SPEC
TODO_GROWTH_CURVE
TODO_RARE_REWARD
TODO_PITY_THRESHOLD
TODO_DEFINE_MC_ROLE
TODO_TOKEN_FONTS
TODO_RATIO_TARGET
TODO_MONOTONY_CURVE
TODO_GS_CURVE
TODO_FINAL_GROWTH_TARGET
TODO_CONCEPT_PACING
TODO_LOOP_COMPREHENSION_CRITERION
TODO_PHASEA_DAYS
TODO_SLACK
TODO_CUT_THRESHOLD_CONFIRM

(Spec pronta per integrazione.)

## Fase 2 – Tecnologia & Processo Minimi (Definizione Operativa)

### Motore scelto
Godot 4.5 (standard, non Mono). Motivo: 2D nativo leggero, cross‑platform (Win/macOS) con stessa base asset, hot‑reload rapido, nessuna toolchain esterna pesante.

### Versione motore congelata
Freeze: 4.5.stable. Patch upgrade solo se: (a) crash blocker riproducibile, (b) bug salvataggio corrompe dati, (c) security CVE. Nessun salto a 4.6 finché Milestone M1 (Phase A + 3 puzzle + monotony + palette) completato e tag v0.1.0 creato.

### Linguaggi + standard codice
Linguaggio MVP: GDScript esclusivo.
Stile:
- Indent 4 spazi, max 100 colonne
- snake_case per variabili/funzioni/file
- PascalCase per scene root e class_name
- CONSTANTS in UPPER_SNAKE
- Segnali: signal puzzle_failed
- Return early; nesting ≤3 livelli
- File ≤300 linee (soft), funzione ≤40 linee (soft)
- Commenti solo su logica non ovvia
- Un manager = una responsabilità

### Controllo versione
Trunk‑Based. main sempre verde. Feature branch feature/<slug> vita <24h, merge fast‑forward. Tag semver vMAJOR.MINOR.PATCH (es v0.1.0). Hotfix: hotfix/<issue>. Prefix commit: feat|fix|refactor|chore|data|balance|docs|log.

### Naming conventions
Script: feature_role.gd (puzzle_memory.gd, token_manager.gd)
Scene: PascalCase.tscn (MemoryPuzzle.tscn)
Data JSON: lowercase singolare (puzzles.json, tokens.json)
Cartelle: lowercase, no spazi, profondità ≤3
Asset: category_identifier_variant.ext (ui_icon_token_focus.png)
Shader: shd_<purpose>.gdshader
Autoload: GameState, EventLogger, PaletteManager, TokenManager, SaveSystem, NodeDirector

### Directory / architettura high‑level
/game
├─ project.godot
├─ scenes/
│  ├─ core/ (Main, DayHub, PuzzleFrame, ComfortRoom, EndDaySummary)
│  └─ puzzles/<type>/
├─ scripts/
│  ├─ core/ (game_state.gd, constants.gd)
│  ├─ managers/ (puzzle_manager.gd, token_manager.gd, palette_manager.gd, reflection_manager.gd, burnout_manager.gd, pact_manager.gd, economy_manager.gd)
│  ├─ systems/ (node_director.gd, save_system.gd, event_logger.gd)
│  ├─ puzzles/
│  └─ ui/
├─ data/
├─ assets/
│  ├─ art/
│  ├─ audio/
│  ├─ fonts/
├─ themes/
├─ shaders/
├─ logs/ (gitignored)
├─ tests/
├─ build/
└─ addons/
Profondità max 3.

### Script / gestione configurazioni
JSON per parametri bilanciamento e puzzle defs. constants.gd centralizza soglie (monotony tiers, burnout thresholds, multipliers). Caricamento avvio → DataRegistry (dict). Ogni JSON ha "schema_version". Se mismatch → warning + fallback defaults in constants.gd. Reload solo manuale (comando debug).

### Sistema build minimo (CI)
GitHub Actions:
1. format: gdformat (fail se diff)
2. lint: grep tab + lunghezza linea
3. headless: godot --headless -s scripts/core/ci_stub.gd (o export HTML5 sanity)
Nessun artifact pre‑M1. Build rotta → fix immediato.

### Performance budget provvisorio
Target 60 FPS (accettabile 50, floor 30 legacy).
Frame 16.6 ms: logic <5, draw <8, resto overhead.
Draw calls target <300 (hard 500).
VRAM texture attiva <128 MB (process <512 MB).
Audio simultanei: music 1–2, sfx ≤8, ambient 1.
Shader custom ≤3 leggeri.
GC per frame ~0 (prealloc).
Load puzzle scene ≤150 ms (no hitch percepibile).

### Profiling toolset
Godot Profiler (FrameTime, Scripts, Monitors).
Custom event_logger → logs/perf_<timestamp>.json opzionale.
Profiling a: ogni nuovo puzzle + se frame time >20 ms per 3 frame consecutivi.
No profiler esterni iniziale.

### Risk register bozza + scope guard
R1 Scope creep / Nuovi sistemi fuori DESIGN / Gate: patch DESIGN + mapping a Pillar → altrimenti drop.
R2 Performance degrado / FPS <55 DayHub / Taglia animazioni, batch UI, riduci shader.
R3 Puzzle overscale / Hard troppo presto / Gating day_index.
R4 Costanti duplicate / Soglie replicate / constants.gd unica fonte; PR rifiutata se duplicati.
R5 Save corrotto / Load fallisce / Version field + fallback + rename .invalid.
R6 Hard reward bassa / Hard uptake <25% Day6+ / Buff multiplier via constants.gd dopo telemetria.

Scope guard:
- Nessun nuovo micro‑sistema finché Phase A incompleto
- Se Phase A >130% tempo stimato → freeze pact + burnout (solo logica minima)
- Nessuna nuova valuta prima di v0.2.0
- Checklist feature: DESIGN patch + constant in constants.gd + evento telemetria (se impatta loop) → senza tripla, reject.

---

## Fase 3 – Contenuto Nucleare per Vertical Slice (Spec Operativa Riempita)

### 3.1 Style Guide Embrionale

#### Palette Sets (5 fisse)
- Neutral (Tier4)
- MonotonyLow (Tier3→2 pre‑grave)
- MonotonyHigh (Tier1 estrema)
- GrowthLow (Tier5→6)
- GrowthHigh (Tier7)

#### Color Slots (immutabili tra palette)
background_dark
background_light
panel_bg
panel_outline
accent_primary
accent_secondary
accent_warning
accent_danger
accent_success
text_primary
text_secondary
text_degraded
ui_divider
interactive_hover
interactive_active
token_focus
token_foresight
token_null_debt
token_stabilizer
token_filter_boost
token_wildseed
fragment_glow
burnout_warning
pact_pulse

#### Hex Base (Neutral)
background_dark #121418
background_light #1E2228
panel_bg #242A33
panel_outline #39414D
accent_primary #4DA6FF
accent_secondary #7FC8FF
accent_warning #FFC642
accent_danger #FF4D4D
accent_success #58D27A
text_primary #E4E9EF
text_secondary #B3BDC9
text_degraded #7A8591
ui_divider #313A45
interactive_hover #5AB4FF
interactive_active #2F8CDB
token_focus #FF8A3C
token_foresight #AA73FF
token_null_debt #4DD5C0
token_stabilizer #FF5F9E
token_filter_boost #4DD27A
token_wildseed #E07BFF
fragment_glow #FFD980
burnout_warning #FF945A
pact_pulse #851CE0

#### Transformation Rules
- MonotonyLow: desaturazione −25%, value −8%, accent_primary → #3A6E9E, text_degraded lighten −5%.
- MonotonyHigh: grayscale blend 85%, accenti residuo blu #3A4E70, accent_warning → #A68E48, text_secondary → #6A727A, success/danger → #6E7378.
- GrowthLow: saturazione +15%, accent_primary → #55B9FF, text_secondary +6% value.
- GrowthHigh: saturazione +35%, emission overlay 20% (screen) su accent_primary + fragment_glow, background_dark lighten +4%, hue shift ±3°/6s solo fragment_glow.
- Saturazione interna max 70%.
- Contrast text_primary vs background_dark ≥7.0.

#### Typography / Degradazione Testo
Normal weight 500
Degraded weight 400 + letter‑spacing +4%
Sterile (later): weight 300, lowercase forzato, rimozione punteggiatura

#### Silhouette & Stile
Forme rotonde/squircle, chibi head ≈38% altezza, no linee <2 px.

#### Sprite Size Budget
Character full 64×64
Node icon 48×48
Token icon 40×40
Puzzle symbol 32×32

#### Visual Forbidden
Multigradient rumorosi, doppi outline, bevel pseudo‑3D, glow >4 px blur, drop shadow colorato.

---

### 3.2 Sonic Identity

#### BPM Segments
Hub 84–92
Puzzle Easy/Medium 110–120
Puzzle Hard 128–136
High Monotony 70–76 + drone
GrowthHigh layer shimmer su 118 (BPM invariato)

#### Strumenti (Allowed)
Soft sine/triangle pads, filtered square arps, sub sine bass, noise bursts brevi, soft click perc, light FM bell/mallet, granular shimmer (growth only)

#### Strumenti Forbidden
Distorted guitar, orchestral hits, cinematic booms, vocal chops

#### Layers
base_pad (sempre)
pulse_arp (solo puzzle)
percussion_light (Medium+; off High Monotony)
drone_monotony (monotony tier ≤3)
shimmer_growth (growth tier ≥6)
fatigue_breath (burnout ≥1)
fragment_chime (one‑shot)

#### Loop Length
Day loop 64 bars @88 BPM ≈174s
Puzzle loop 32 bars @120 BPM ≈64s
Hard variant injection 16 bars

#### SFX Mandatory
sfx_success
sfx_fail
sfx_retry_available
sfx_fragment_gain
sfx_token_gain
sfx_token_use
sfx_reflection_unlock
sfx_hint2_unlock
sfx_palette_up
sfx_palette_down
sfx_burnout_stage1
sfx_burnout_stage2
sfx_burnout_stage3
sfx_pact_offer
sfx_pact_accept
sfx_skip_warning
sfx_day_end
sfx_run_growth_finale
sfx_run_lock_finale
sfx_menu_move
sfx_menu_confirm
sfx_menu_cancel
sfx_monotony_warning

#### Loudness Targets
Music −16 LUFS
SFX peak −6 dBFS (perc. ≈−12 LUFS)
Fade tails <600 ms

---

### 3.3 Concept Art Chiave (8 Tavole)
1 Hub layout (top‑down)
2 Comfort room (tidy/dim)
3 Puzzle frame border (neutral vs extreme)
4 Palette tiers swatch (5 colonne)
5 Token icon silhouettes (6)
6 Character turnaround (front/side)
7 Fragment artifact 3 stati
8 UI HUD wireframe

Flat color + minimal shade.

---

### 3.4 Asset List Prioritizzata

#### Indispensabili VS
player_idle (1)
player_walk_4dir (12) (fallback 1 direzione 4 frame se taglio)
token_icons (6)
node_icons (puzzle, comfort, reflect, skip, pact)
puzzle_symbols_memory (9)
puzzle_symbols_filter_noise (12 noise +7 target)
slider_components (track, knob)
card_faces_risk (5)
comfort_objects (bed, desk, window_light, plant)
fragment_icon (base + glow)
palette_filter_overlays (5)
burnout_indicator (3)
music loops (day_base, puzzle_base)
SFX placeholders (lista)
Icons hi‑res 64 px

#### Differibili (max 8)
player_emotes
comfort_variants_2
window_light_anim
plant_growth_extra
puzzle_symbol_alts
palette_particle_overlay
fragment_rare_variants
pact_visual_corruption

Formats: PNG / OGG / WAV (raw) / TTF|OTF.

---

### 3.5 UI Kit Minimale
Components: Button, ToggleButton, Panel, Modal, ProgressBar (h), TokenSlot, HintIndicator, PaletteTierBadge, BurnoutBadge, DialogPrompt, ScrollableList
States:
- Button: normal / hover / pressed / disabled / alert
- TokenSlot: empty / filled / selected / cooldown (later) / locked
- ProgressBar: normal / warning / success
Spacing unit 8 px (4/8/16 multipli)
Font sizes 14 /16 /18 /22 /28
Icon HUD 24 px / modal 32 px
Corner radius 4 px
Focus ring 2 px accent_primary (+15% lighten)

---

### 3.6 Core Animazioni
puzzle_enter 220ms cubic_out
puzzle_success_flash 180ms cubic_out
puzzle_fail_flash 180ms cubic_out (lower alpha)
token_acquire_pop 260ms back_out
palette_shift_crossfade 400ms cubic_in_out
burnout_warning_pulse 1000ms loop linear
fragment_gain_spin 420ms quart_out
pact_offer_glow 600ms sine_in_out pulsed
Simultanee ≤5 (hard 8: kill oldest)

---

### 3.7 VFX Catalogo Iniziale
success_glow 180ms additive accent_success
fail_dim 180ms fade #222A33
monotony_pulse loop 1.2s darken #2E3A4A
growth_bloom 400ms additive accent_primary lighten
token_spawn 260ms additive token color
pact_surge 600ms additive + distortion pact_pulse
fragment_glint 420ms additive fragment_glow
Forbidden: volumetric, radial blur, heavy bloom, camera shake >2 px, smear shaders.

---

### 3.8 Sistema Ricompense Early-Tier
Puzzle:
- Easy: growth_raw 10, growth_score +1, GC 0, fragment 0%, token_step +1
- Medium: growth_raw 15, growth_score +2, GC 1, fragment 0%, token_step +1
- Hard: growth_raw 20, growth_score +4, GC 1, fragment 20%, token_step +1
Failure growth_raw = 35% (E 3 / M 5 / H 7)
Reflection bonus (success entro 3 slot stesso tipo): +3 growth_raw +1 growth_score
Hard streak: 2 Hard consecutivi → +5 growth_raw secondo; 4 Hard nel giorno → +1 fragment garantito (1 volta)
Fragment cap run VS: 4
Token sequence avanza sempre (fail incluso)

---

### 3.9 Economia First-Pass (Test)
Growth finale target 600
GC primo skill 6 / skill costosa 18
Token fittizi (rename later): Medium+ success =1; Hard fail =1; Easy =0
Conversion token→MC 2:1 (cap giornaliero 6 MC)
Patto penalty: monotony += 15 * iter; next_day_growth_multiplier = 1 −0.10*iter (min 0.6)
Comfort cost hint1=2 / hint2=3
Monotony decrement reflection valida: 3 (max 2/giorno conteggiate)
Palette monotony threshold 30 / 45 / 60 (down)
GrowthScore thresholds 25 (GrowthLow) / 50 (GrowthHigh) hysteresis 5
Depth finale growth: depth ≥400

---

### 3.10 Telemetria Minima
Events: session_start, node_result, puzzle_result, reflection_use, token_use, day_end, run_end
Common fields: run_id, day, slot, timestamp_epoch_ms, build_version
Formato JSON lines, flush immediato, rollover file 256 KB, retention 10 file.

---

### 3.11 Strategia Test
Smoke (giornaliero) pass:
- Avvio senza errori
- Day1 Puzzle→Comfort→Puzzle no crash
- Reflection sblocca hint1
- Skip incrementa monotony
- Save dopo nodo + reload coerente
- Hard gating assente Day1
- Token sequence +1 per 3 puzzle
- Nessun flicker palette singolo skip
Regression (min):
1 Save/Load mid‑day
2 Reflection cap 2
3 Token cap (4)
4 Burnout Stage1 non trigger sub‑soglia
5 Palette shift singolo tier corretto
6 Hard gating Day2 bloccato
7 Fragment pity non precoce
8 Pact non offerto Run1
Severity S1–S4; stop‑ship: S1, FPS hub <55, save corrotto, Hard pre Day3, palette flicker rapido.

---

### 3.12 GDD Indice
1 Core Loop
2 Systems Overview
3 Puzzles (template sheet)
4 Economy
5 Progression
6 Tokens & Pact
7 Monotony & Palette
8 Burnout
9 UX & HUD
10 Audio & VFX
11 Accessibility
12 Telemetry
13 Balancing Tables
14 Glossary
Puzzle sheet fields: goal, input, success, failure, param E/M/H, escalation, downgrade, hint1, hint2, timing, UI sketch ref, reward.
Snapshot settimanale (commit docs: gdd sync).

---

### 3.13 Tech Design Doc
Sezioni: State Model, Data Loading ordine+schema, Event Bus (signals+payload), Save Flow, Performance Budgets+watchdog, Error Handling (assert vs fallback).
Diagrammi: Run/Day state machine, Data flow load→runtime→save.

---

### 3.14 Logging / Event Spec
File: logs/run_<run_id>_<timestamp>.jsonl
Retention 10
No PII / no path esterni / no testo narrativo raw
Schema validation startup yes
Levels: info / warn / error (campo level)

---

### 3.15 Target Framerate Micro Build
Target 60 FPS (fallback 50)
Contenuto: Hub + Memory puzzle + Token cycle + Palette shift sim
Metriche: frame_time_avg, frame_time_p95, frame_time_max, draw_calls_avg, mem_usage_peak, gc_alloc_bytes
Trigger ottimizzazione: frame_time_p95 >18 ms OR draw_calls_avg >400.

---

### 3.16 Additional Locks
No >5 palette pre VS
No VFX oltre lista
Nessuna espansione MC duality finché skill tree non schedulato (se no rimuovere MC)

---

### 3.17 Deliverable Gate Fase 3
Consegna valida quando:
- Palette 5 set applicate runtime
- 1 puzzle fully loop (Memory) + token cycle deterministico
- Reflection con hint1/hint2 funzionanti
- Monotony→palette shift e Growth→palette shift verificati
- Telemetria eventi minimi presenti file rollover
- Save/Load coerente con parametri nuove valute
- Performance micro build dentro budget
- Asset list indispensabile ≥90% presente (placeholder accettati SFX)

(Chiusura Fase 3 = pronto ingresso Vertical Slice polish.)


## Fase 4 – Estensioni Pre-Vertical Slice
*(Completare i criteri slice – obiettivo: pronto a dichiarare Vertical Slice)*

### 1. Animazioni aggiuntive (polish minimo)
Elenco + durata (ms):
- fade_scene 200
- button_hover 120
- node_highlight 160
- fragment_ping 320
- token_slot_pop 220
- palette_shift_flash 400
- burnout_warning_loop 1000 (loop)
- pact_offer_pulse 600 (loop)
Trigger:
- fade_scene: cambio schermata
- button_hover: hover bottone
- node_highlight: nodo selezionabile appare
- fragment_ping: frammento ottenuto
- token_slot_pop: token ricevuto
- palette_shift_flash: cambio tier palette
- burnout_warning_loop: ingresso burnout stage1+
- pact_offer_pulse: patto disponibile
Cap concorrenza: 5 (se >5 ignora nuove non critiche).
Throttle performance: se FPS <55 salta button_hover, node_highlight, palette_shift_flash (fallback cambio secco).

### 2. UI flow completo slice
Sequenza tipica: Title → Hub → Puzzle → Hub → Comfort → Hub → DaySummary → Hub → RunSummary (fine).
Ingresso NodeSelection: Hub caricato + nessun overlay.
Summary (DaySummary) mostra: day_index, puzzles_done, hard_count, skips_today, monotony, growth_total, growth_score, fragments_collected, tokens_used, burnout_stage.
Azioni Summary: continua (next day), apri skill (se presente), apri log (dev), chiudi.
Timeout inattività: nessuno.
Overlay massimo sovrapposti: 2 (es. modal + pause).

### 3. Telemetry validation
Eventi richiesti: session_start, node_result, puzzle_result, reflection_use, token_use, day_end, run_end.
Chiavi obbligatorie ogni evento: event_type, run_id, day, slot, timestamp_ms, build_version.
Extra puzzle_result: puzzle_type, tier, success, time_ms.
Validazione: on emit immediata.
Se campo mancante: warn + scarta evento (no crash).
Budget eventi/run: ≤300.
File rollover: 256 KB (immutato).

### 4. Profiling baseline
Scene test: Hub, MemoryPuzzle (Easy→Hard), ComfortRoom, DaySummary.
Durata campionamento: 120 s.
Metriche: frame_time_avg, frame_time_p95, frame_time_max, draw_calls_avg, draw_calls_max, mem_peak_mb, gc_bytes_frame.
Trigger ottimizzazione immediata: frame_time_avg >16.6 ms.
Warning draw_calls: >400.
Heap peak massimo: 300 MB.

### 5. Build automatica (CI)
Piattaforme export: windows, mac.
Frequenza: ogni push su main.
Pipeline: lint → parse_check (headless) → export_win → export_mac → upload artifact.
Blocca merge: lint fail, parse error, export fail.
Nome artefatto: build_slice_<platform>.zip
Retention artefatti: ultimi 10.

### 6. Pillars validati empiricamente
Metriche + soglie:
- SceltaCostoRitardato: % skip (target medio 10–25%).
- ErosioneSensoriale: palette_tier_changes/run ≥3 (≥1 verso giù o su).
- CrescitaLenta: RMSE growth_total vs curva target ≤12% del target finale.
- ApprendimentoFallimento: retry_immediato_rate ≥40%; hint_usage_rate (quando disponibile) 30–60%.
Pillar fallito: metrica fuori banda per 3 sessioni consecutive → review e possibile tuning parametri prima VS tag.

### 7. MVP onboarding scriptato
Step testuali: 6 (≤90 caratteri ciascuno).
Completamento: 1 puzzle eseguito + visto messaggio reflection + aperto Hub menu.
Skippabile: S (dopo prima run completata).
Metrica successo: % utenti chiudono onboarding <3 min (log tempo in telemetria).

### 8. Performance target hardware minimo
Hardware riferimento: Intel HD 4400 (laptop 2014).
FPS mediano target: 60.
FPS p5 minimo: ≥50.
Transizione scena: ≤200 ms.
Garbage alloc per puzzle: ≤4 KB.
Budget texture caricata: ≤40 MB.
Fallback dinamico: se FPS <50 per 5 s → disattiva shimmer_growth + palette_shift_flash (flag runtime).

### 9. Gate Vertical Slice
Checklist obbligatoria (tutti presenti):
- 3 puzzle (Easy→Hard) funzionanti
- Monotony varia palette
- Reflection + hint1 attivo
- Token ciclo completo
- Day summary operativo
- Save/Load stabile
- Telemetry file generato (eventi minimi)
- FPS target raggiunto su hardware minimo
- Patto disabilitato o stub
- Burnout stage1 avviso presente
Blocco mancanti consentiti: 0.
Content freeze: 2025-11-15.
Tag versione: v0.2.0-vslice.
Criterio rigetto: qualsiasi item mancante O FPS mediano <60 hardware minimo.

### 10. Rischi addizionali Phase 4
- Over‑polish animazioni → Trigger: >5 richieste nuove oltre lista → Mitigazione: lock lista.
- Telemetry rumorosa → Trigger: >300 eventi/run medio → Mitigazione: rimuovere campi non critici / batching.
- Performance degradate shader palette → Trigger: frame_time_p95 >18 ms dopo introduzione → Mitigazione: fallback palette precomputata (modulate).
Esito rischi monitor in retro giornaliera fino al tag VS.

*(Arrivo Fase 4 = pronto dichiarare “Vertical Slice”.)*


## Fase 5 – Pre-Alpha Scaling

- **Progressione** (livelli/missioni/quest/skill—se prevista)
- **Meccaniche secondarie / meta layer**
- **Sistema ricompense avanzato** (rarità multiple, pity/anti-frustrazione)
- **Economia dettagli inflazione** (sink vs fountain numerics)
- **Persistenza estesa** (slot multipli / conflitti)
- **Accessibilità ampliata** (remapping, daltonismo, motion reduction)
- **Pipeline 2D** (PSD → atlas) / **Pipeline 3D** *(se necessario)*
- **Rigging + naming conventions** (complete)
- **Animazioni state machine requirements pieni**
- **VFX budget particelle definito**
- **UI kit completo** (stati, hover, disable, focus)
- **Musica**: loop + stinger + layering prototipo
- **SFX set base** (core feedback)
- **Mix matrix + loudness target** (per evitare re-mix tardivo)
- **Sistema build esteso** (unit test auto + static analysis)
- **Automated test harness** (build validation)
- **Bug taxonomy / reproduction protocol**
- **Asset GUID stability policy**

---

## Fase 6 – Alpha Preparazione

- **Pipeline tool interni** (editor livelli, batch import)
- **Gestione configurazioni avanzata** (feature flags)
- **Sistema salvataggi** (cloud / conflitto risoluzione)
- **Failure states + recovery approfonditi** (edge + roll‑back)
- **Anti-cheat superficie** (entry points documentati)
- **Patch system** (delta vs full)
- **Localization pipeline** (string tables, placeholders)
- **Event design spec ampliato** (funnel retention)
- **Schema proprietà analytics** (tipi, range, privacy)
- **QA: test plan feature-based completo**
- **Memory budget tabellato aggiornato**
- **Garbage collection minimization pass**
- **Occlusion / culling strategie** *(se 3D / costoso)*
- **Streaming assets plan** *(solo se mondo grande)*

---

## Fase 7 – Beta Preparazione

- **Dashboard KPI** (DAU, retention, ARPU ecc.)
- **Cohort analysis definita**
- **Advanced balancing** (curve dettagliate, churn points)
- **Sistemazione reward rare** (loot table final tuning)
- **Security**: offuscazione / checksum / rate limiting
- **Data encryption** (a riposo / in transito se backend)
- **Log auditing**
- **LiveOps tools base** (feature flags runtime)
- **A/B testing framework**
- **Retention levers** (streaks, limited-time modes)
- **Moderazione pipeline** *(se online)*
- **CDN per asset patchabili**
- **Auth / Database / Matchmaking** *(solo se live)*
- **Telemetria ingestion scaling** (batching, queue)
- **Dashboard analytics popolata**

---

## Fase 8 – Beta Completion

- **Contenuto completo** (tutti i capitoli / puzzle finali)
- **Localizzazione integrata completa**
- **Performance target raggiunto** (profiling raffinato)
- **Bilanciamento iterativo continuo**
- **Crash reporting + symbol server robusto**
- **Release notes template attivo**
- **Pricing tiers / monetizzazione** *(solo se F2P)*
- **IAP catalogo / economy sinks bilanciati**

---

## Fase 9 – Launch Readiness

- **Build target matrix finale** (OS, arch)
- **Installer / packaging / anti-tamper** *(se necessario)*
- **Store requirements** (assets grafici, capsule, trailer)
- **Rating PEGI / ESRB**
- **Privacy policy / EULA / open source compliance**
- **Trademark check / licenze third‑party consolidate**
- **Rollback plan testato**
- **CDN warm**
- **Final telemetry validation** (nessun campo mancante)
- **Postmortem template pronto** *(per dopo lancio)*

---

## Fase 10 – Post-Launch / Live
*(Solo se GaaS)*

- **Event calendar vivo**
- **Content cadence pianificata**
- **Feature flags evoluti** (rollout progressivo)
- **Retention levers tuning continuo**
- **LiveOps tool UI interna**
- **Data analyst + community mgmt routine**
- **Extended endings / meta content expansions**
- **A/B test ciclici**
- **Continuous Delivery staging→prod workflow pieno**

---

## Item Trasversali / Inseriti Dove Serve

- **Risk register** *(inizio + aggiornamenti continui)*
- **Scope guard** *(valido da Fase 0 a fine)*
- **Change control process** *(attivo da inizio pre‑prod)*
- **Contingency buffer / capacità** *(aggiorna per milestone)*
- **Ruoli & staffing** *(ridimensioni per vertical slice → beta → live)*
- **Rischi comuni** *(monitor checklist ricorrente)*

---

## Ultimi perché Dipendono da Molto Altro
*(Non iniziare prima)*

- **Pipeline 3D completa** *(se non hai nemmeno deciso stile)*
- **Networking avanzato / matchmaking** *(se non confermato multiplayer)*
- **Scalabilità server / autoscaling**
- **LiveOps + A/B testing + retention levers** *(richiedono telemetria matura)*
- **CDN e patch delta ottimizzati** *(dopo prova export base)*
- **Monetizzazione dettagli** *(dopo validazione retention)*
- **Localization completa** *(dopo testo quasi stabile)*
- **Anti-tamper, offuscazione pesante** *(vicino al launch)*
- **Extended economy sinks complessi** *(post bilanciamento core)*
- **Cohort analysis e dashboards pro** *(dopo avere sample utenti)*

---

## Sintesi “Checkpoint” Milestone
*(Riassunti)*

- **Concept Lock** = (1–7)
- **Pre-Prod Start** = (8–18 + 19–26)
- **Prototype** = (27–34 + 37–39)
- **Vertical Slice** = (fino a 52)
- **Alpha Gate** = (fino a ~84)
- **Beta Gate** = (85–100+)
- **Release Candidate** = (108–117)
- **Post-Launch** = (118+)