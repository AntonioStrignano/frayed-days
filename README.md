# frayed-days
**"Restare consuma quanto andare"**

Life-loop micro narrative: shortcuts give time now, cost color later.

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

## Depth & End Conditions
Depth = growth - (monotony + debt). Routine lock if depth < 0 OR shortcut pattern ratio > 0.7. Growth ending logic not yet implemented (placeholder for narrative branch).

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
- `data/degradation_config.json`: Monotony + shortcut ratio thresholds & presentation layer arrays.
- `data/node_pools.json`: Base node templates (expandable) & slot range.
- `data/accessories.json`: Box definitions + accessory effect placeholders.
- `data/puzzles_config.json`: Puzzle parameter tiers, burnout settings, hint costs.

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

## Balancing & Design Docs
See `docs/` folder:
- `PUZZLES.md` puzzle archetype notes
- `BALANCING_NOTES.md` initial numeric targets
- `IDEAS.md` parking lot (scope guarded)
- `TODO_BACKLOG.md` enhancements / tech debt
- `OPEN_QUESTIONS.md` unresolved design decisions
- `ARCHITECTURE.md` extended overview

## Next Steps (Planned)
- Implement real interactive puzzle scenes replacing RNG stubs.
- Visual/audio degradation feedback pass (palette & text richness variants).
- Accessory effect application into delta pipeline (growth multipliers, monotony modifiers).
- Forced comfort day trigger when burnout persists beyond threshold.
- Depth-based ending branching logic + narrative surfaces.
- Persist saves to disk (serialize `GameState.save_state()`).

## Anti-Feature Creep Guardrails
If a proposed addition introduces: new resource type, combat loop, complex physics, or procedural content—reject or re-scope before implementation.

## License / Credits
(TBD) Provide license before content distribution.