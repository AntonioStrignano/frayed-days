# SPEC Core Loop (IT)

Documento derivato dalle sezioni 1–12 della definizione strutturata. Contiene TODO espliciti per punti ancora da validare.

## 1. Core Loop

### 1.1 Fasi Sequenziali (Macro)
1. Avvio run → init variabili giorno 1
2. Stanza introduttiva → contesto / primo focus
3. Selezione nodo successivo (puzzle / comfort / reflect / shop / pact se fine run)
4. Esecuzione nodo → puzzle: input→esito | non‑puzzle: applica effetti istantanei / differiti
5. Aggiornamento stato → growth, monotony, growth_score, streak tier puzzle, token_queue_index, tokens_inventory, palette_tier, burnout_stage, pact trackers
6. Feedback immediato → UI numeri chiave, testo micro, variazione palette/audio (se soglia)
7. Loop selezione fino a room_slot 7
8. Riepilogo fine giornata → conversioni (token→wildcard, consegna accessori), decay growth_score se nessuna reflection, calcolo burnout day pattern
9. Avanzamento giorno → spawn/nodi refresh/gating Hard
10. Verifica condizioni finali (Growth finale / Monotony lock)
11. Conclusione run → finale growth / routine / continua

### 1.2 Stato Aggiornato per Nodo
`day_index, run_index, room_slot, monotony, growth_total, growth_score, depth, puzzle_tiers_per_type, consecutive_puzzle_streak_per_type, fail_streak_per_type, tokens_inventory, token_queue_index, comfort, skips_today, pact_count, pact_decline_streak, burnout_stage, palette_tier, fragments_collected, hints_unlocked, time_in_day, retry_flag`

### 1.3 Condizione Uscita Loop Giorno
`room_slot == 7` AND nodo risolto → trigger EndOfDay.

### 1.4 Condizioni Uscita Loop Run
- Finale Growth: `day_index == 12` AND `growth_total > monotony` AND (facoltativo) `depth >= soglia` → CTA "Guardati indietro".
- Finale Monotony Lock: `day_index ≥ 15` AND `monotony_lock_flag == true` → CTA "Routine".
- Continua: nessuna condizione raggiunta.

### 1.5 Tempo Target Nodo
TARGET: 45–70 s puzzle (Easy <40 s) + 10–15 s decision inter‑nodo. HARD CAP: 90 s senza feedback.
- TODO_DECISION_NODE_TIME

### 1.6 Max Passi Senza Feedback Sostanziale
<=2 azioni o <=5 s.
- TODO_DECISION_MAX_FEEDBACK_GAP

## 2. Meccaniche Primarie

### 2.1 Elenco Irrinunciabili
Navigazione, Selezione Nodo, Progressione Tier Puzzle, Reflection (hint gating), Monotony accrual, Growth accumulation, Token deterministic cycle, Burnout, Palette bipolar tiers, End-of-day summary, Patto.

### 2.2 Scopo Funzionale (Sintesi)
(Vedi `TODO.md` per frasi 1‑riga) — evitare duplicazione.

### 2.3 Meccaniche Raffreddabili
Pact (può essere stub), Burnout (solo tracking senza penalità).

### 2.4 Vincoli Non Fare
No puzzle ambientali, no branching narrativo profondo, no RNG opaco esito puzzle base, no skip puzzle tramite reflection, no decrement monotonia da semplice successo, no random token order, no reset burnout passivo, no salto >1 tier palette per evento, no pact che risulta sempre vantaggioso.

## 3. Failure States + Recovery

### 3.1 Tipi Failure
Puzzle fail; Retrocessione tier; Burnout escalation (St1/2/3); Patto accettato; Skip/rinuncia; Monotony lock.

### 3.2 Sintesi Costi / Recovery
- Puzzle fail: growth residua 35%; recovery = retry immediato o reflection.
- Retrocessione tier: perdita futura; recovery = successi consecutivi.
- Burnout St1/2: malus; recovery = Comfort/Reflect efficaci.
- Burnout St3: giornata comfort forzata (+monotonia); recovery = completarla.
- Patto: monotonia spike + penalty growth Day1 next run; recovery = decline streak.
- Skip: monotonia +; recovery = sequenza riflessione + successi.
- Monotony lock: run termina.

### 3.3 Recovery Burnout (Model)
1 nodo Comfort/Reflect → -1 stage.
- TODO_BURNOUT_RECOVERY_MODEL (validare / alternative?)

### 3.4 Soglia Stallo Puzzle
3 fail consecutivi → suggerire hint / cambiare ritmo.

### 3.5 Feedback Didascalico
Solo Patto proposto esplicitamente.

## 4. Sistema Salvataggi

### 4.1 Frequenza Commit
Dopo ogni nodo + fine giorno + fine run.

### 4.2 Struttura File
Unico `slot_01.json` + checksum / version.

### 4.3 Chiavi Essentials
(elenco coerente con `DATA_MODEL_it.md` + run_metadata)

### 4.4 Compatibilità Versione
Se mismatch schema_version → avviso + invalidazione (rename `.invalid`).

### 4.5 Limite Dimensione
<=32 KB JSON target.
- TODO_CONFIRM_SAVE_SIZE

### 4.6 Telemetria nel Save
Esclusa; canale separato.

## 5. Telemetria (Baseline)
Eventi minimi: NodeChosen, PuzzleResult, ReflectionUsed, Skip, TokenUse, BurnoutStageChange, PaletteTierChange, PattoDecision, DayEnd, RunEnd.
- TODO_TELEMETRIA_SPEC per dettagli campi.

## 6. Sistema Ricompense

### 6.1 Growth Curve Placeholder
Giorni 1..12: [5,12,20,30,40,50,58,65,72,80,90,100]% target.
- TODO_GROWTH_CURVE

### 6.2 Ritmo Frammenti
Fasce: Day3–4 / Day6–7 / Day10–12 (completamento set).

### 6.3 Token Deterministico
Confermato (vedi Token Sequence design).

### 6.4 Differenziale Hard vs Medium
Medium +50%; Hard +100% growth base.

### 6.5 Ricompensa Meta Rara
Definire FRAMMENTO_RARO o SKILL_HIGH_TIER.
- TODO_RARE_REWARD / TODO_PITY_THRESHOLD

### 6.6 Azione Sterile
Decorazione camera (cosmetico) — fine run condizionale.

## 7. Economia

### 7.1 Valute MVP
GC, MC (placeholder), Token fittizi, Monotony (stato), Comfort.

### 7.2 Ruoli Sintetici
GC → skill progression; MC → (da definire, lato monotonia?); Token → micro vantaggi → conversione MC; Monotony → attrito; Comfort → reflection.
- TODO_DEFINE_MC_ROLE / TODO_TOKEN_FONTS / TODO_RATIO_TARGET

### 7.3 Fonti & Sink
Allineate alla sezione Economia futura (`ECONOMIA_it.md`).

## 8. Curve Macro (Placeholder)
- Monotonia target: Day1 5 → Day12 <40. (TODO_MONOTONY_CURVE)
- GrowthScore target: Day1 4 → Day12 50. (TODO_GS_CURVE)
- % Hard puzzle: bands progressive (vedi Progressione).

## 9. Onboarding / First Minute
- ≤20 righe testo primi 60s; prima scelta significativa ~12s; prima Hard: Day4 (gating).
- Loop comprehension criterion: 1 fail + 1 reflection + 1 skip consapevole + 1 success Medium.
- TODO_CONCEPT_PACING / TODO_LOOP_COMPREHENSION_CRITERION

## 10. UX Flow Grezzo
Schermate: Title, SaveSelect, GameHub, PuzzleScene, ComfortRoom, DaySummary, RunSummary, Settings, LogViewer (dev), PauseOverlay.
Profondità stack ≤3 (target 2). HUD persistente: day, slot, monotony, growth, growth_score, token_next, tokens_held, burnout, palette, skips_today.

## 11. Accessibilità (Baseline)
Palette alternative (3) - TODO_CONFIRM_COUNT, scala font 1.0→1.5 rem, feedback combinato (colore+icona+testo) per eventi critici.

## 12. Vincoli Temporali Phase A
Phase A (3 puzzle + loop) ≈5 giorni + monotonia/palette 2 + reflection/hint 2 + slack 30%.
- TODO_PHASEA_DAYS / TODO_SLACK / TODO_CUT_THRESHOLD_CONFIRM

## 13. Elenco TODO Riferiti
```
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
```

## 14. Dipendenze Cross-Documento
- Dettagli numerici: `BALANCING_NOTES_it.md`
- Stato persistente: `DATA_MODEL_it.md`
- Gating & percentuali Hard: `PROGRESSION_it.md`
- Economia ampliata: `ECONOMIA_it.md`
- Telemetria: `TELEMETRIA_it.md`

## 15. Principi di Non Duplicazione
Questo file funge da indice operativo. Numeri finali devono vivere SOLO nei file: Balancing, Data Model, Economia. Qui restano placeholder + TODO.
