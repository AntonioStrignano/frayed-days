# frayed-days
**"Restare consuma quanto andare"** / *Shortcuts give time now, cost colour later.*

> Questo README è l'unica fonte autorevole di orientamento (bilingue). Le vecchie varianti `README_IT.md` sono deprecate e mantengono solo un redirect.

## Developer Context / Working Mode
Solo-dev (background principale: musicista; skill grafiche limitate; programmazione in apprendimento progressivo) supportato da assistenza IA per colmare gap architettura, refactor e documentazione. Linee guida personali:
- Iterazioni corte: prima scheletro funzionante, poi tuning dati.
- Nessun nuovo sistema se uno esistente è instabile.
- Tutto il bilanciamento esterno in JSON (evitare magic numbers nello script).
- Telemetria minima prima di "sentire" il bilanciamento.
- Commit frequenti e granulari (<= 1 concetto per commit).
- Se complessità visiva > capacità attuale → placeholder minimale + TODO visual.
- Ogni feature: motivo chiaro legato a un pillar oppure scartata.

Promemoria motivazionale: imparare facendo > perfezionare a vuoto. Refactor guidato da misure (profiling / telemetria), non da ansia estetica del codice.

## High Concept
A 2D Godot 4 narrative day-loop about the trade-off between immediate shortcuts (time saved now, future monotony) and deliberate growth (puzzle effort, delayed payoff). Across ~10–12 runs the player either reaches a Growth resolution or falls into a Routine hard lock.

## Current Implementation Status (Core Slice)
- Day loop: variable 6–9 slots executed via `DayController`.
- Node categories: Shortcut / Challenge / Support / Comfort / Reflect / Shop (basic delta logic in `NodeExecutor`).
- Resources tracked: growth, monotony, comfort, debt, shortcut_coins (SC), growth_coins (GC placeholder), fragments, tokens (ephemeral), wildcard_points (post-run), accessories (pending/owned).
- Puzzles: 6 final archetypes (memory, association, timing, risk, resource balance, signal filter) routed through `PuzzleManager` returning structured results.
- Reflection / hint tiers: `ReflectionManager` upgrades tiers after failures when reflection node chosen.
- Burnout: consecutive challenge success counter induces affliction (growth reward penalty multiplier) per config.
- Degradation: tier computed by `DegradationManager` from monotony + shortcut pattern ratio (central JSON thresholds).
- Shop: purchases queue accessories for next-day delivery (`ShopManager`).
- Tokens: stored, unused convert to wildcard points at run end; pact carry penalty scaffolded (`TokenManager`).
- Logging: structured per-node, per-day, per-run (`Logger`).

## Depth & End Conditions (Updated v0.1)
New formula: `Depth = Growth + (FragmentsBank * 0.5) + (MC * 0.3) - Monotony - (PactAccepts * 8)`

Legacy `growth - (monotony + debt)` replaced (debt parked). Routine lock if depth < 0 OR shortcut pattern ratio > 0.7 (ratio subject to revalidation). Growth finale triggers when depth stays positive and monotony below lock threshold in target window (see balancing notes).

## File Map (Key Scripts)
- `autoload/GameState.gd`: Run/day mutable state, config cache, start/end run/day logic.
- `managers/DayController.gd`: Daily slot sequencing and challenge state update order enforcement.
- `managers/NodeExecutor.gd`: Pure delta calculators for node resolution.
- `managers/PuzzleManager.gd`: Dispatch + puzzle stubs returning `{success, puzzle_type, growth_reward, ...}`.
- `managers/ReflectionManager.gd`: Hint tier progression.
- `managers/DegradationManager.gd`: Computes degradation tier and palette/audio/text indices.
- `managers/ShopManager.gd`: Gacha box purchase queuing & next-day delivery.
- `managers/TokenManager.gd`: Ephemeral token lifecycle & pact flag.
- `managers/Logger.gd`: Event accumulation & JSON file flush.

## Data Config (JSON)
Authoritative tuning surfaces (v0.1). All numbers should move here instead of hardcoding in scripts.

| File | Purpose (EN/IT) |
|------|-----------------|
| `data/puzzles.json` | Escalation (2→3 successes), base growth values, fragment drop, hard repeat monotony |
| `data/monotony.json` | Monotony increments, reflection reduction caps |
| `data/burnout.json` | Pattern-day triggers & stage effects |
| `data/pact.json` | Pact spikes, penalties, decline streak benefits, depth coefficients |
| `data/tokens.json` | Deterministic sequence & base cap |
| `data/palette.json` | Palette thresholds & hysteresis margins |
| `data/progression.json` | Hard gating by day (%) + escalation reference |
| (legacy) `data/degradation_config.json` | Superseded by `palette.json` (migrate then remove) |
| (legacy) `data/puzzles_config.json` | Superseded by `puzzles.json` (migrate then remove) |

## Challenge Node Update Order (Enforced)
1. Time decrement
2. Puzzle execution -> result dict
3. Delta computation (burnout modifiers applied)
4. Failure registration on miss
5. Reflection opportunity (cost/hint tier upgrade)
6. Logging (node event appended)

## Extensibility
Add a new puzzle: augment JSON archetype section and extend `PuzzleManager.run_puzzle` match. Keep result dict structure stable. Avoid embedding thresholds in multiple scripts—use JSON + central managers.

## Running (Dev Skeleton)
Add these scripts as autoloads in Godot (Project Settings -> AutoLoad):
- `autoload/GameState.gd` as `GameState`.
- Optionally a scene that instantiates: `DayController`, `NodeExecutor`, `PuzzleManager`, `ReflectionManager`, `DegradationManager`, `ShopManager`, `TokenManager`, `Logger` and calls `inject_dependencies` on `DayController`.
Manually simulate node progression by calling `DayController.process_next(node_dict)` with entries shaped like those in `data/node_pools.json` plus a `category` field.

Example pseudo-call sequence (inside a test script):
```gdscript
var pools = JSON.parse_string(FileAccess.open("res://data/node_pools.json", FileAccess.READ).get_as_text())
var base_challenge = pools.base_pool.challenge[0]
base_challenge.category = "challenge"
DayController.process_next(base_challenge)
```

## Documentation Index (Authoritative)
IT (master detail) / EN (synced snapshot):

| Area | IT | EN |
|------|----|----|
| Core Loop | `docs/it/SPEC_CORE_LOOP_it.md` | `docs/SPEC_CORE_LOOP.md` |
| Design Overview | `docs/it/DESIGN_it.md` | `docs/DESIGN.md` (Addendum v0.1) |
| Balancing Snapshot | `docs/it/BALANCING_NOTES_it.md` | `docs/BALANCING_NOTES_EN_SNAPSHOT.md` |
| Economy | `docs/it/ECONOMIA_it.md` | `docs/ECONOMY.md` |
| Telemetry | `docs/it/TELEMETRIA_it.md` | `docs/TELEMETRY.md` |
| Data Model | `docs/it/DATA_MODEL_it.md` | (EN pending if needed) |
| Progression | `docs/it/PROGRESSION_it.md` | (mirror pending) |
| Puzzles | `docs/it/PUZZLES_it.md` | (EN backlog) |

Support / meta:
`IDEAS_it.md`, `OPEN_QUESTIONS_it.md`, `TODO_BACKLOG_it.md` (Italian master) + English legacy where present.

## Next Steps (Implementation Queue)
1. Config loader + validation (migrate legacy JSON names to new set)
2. Implement updated escalation (2/3 successes) & gating (33% / 50% Hard) in `PuzzleManager` / `DayController`
3. Pact rework (token cap removal, fragments banking, penalties)
4. Burnout pattern-day evaluator (windowed % puzzle tracking)
5. Depth formula switch + derived field (don’t persist)
6. Telemetry emission per updated schema ordering
7. Removal of deprecated JSON (`degradation_config.json`, `puzzles_config.json`) once parity confirmed

## Guardrails / Anti-Creep (EN/IT)
Reject or re-scope if a proposal adds: new resource type (non-justified), combat loop, heavy physics, wide procedural generation. Validate each feature against pillars + telemetry hypothesis.

## License / Credits
(TBD) Provide license before content distribution.