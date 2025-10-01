# Architecture Overview

## Core Autoload
`GameState.gd` holds all mutable run/day state and config caches. Provides start/end run/day, delta application, persistence stub.

## Flow Controllers
- `DayController.gd`: Orchestrates daily node slots, executes nodes via `NodeExecutor`, handles challenge order steps and triggers logging.

## Pure / Logic Components
- `NodeExecutor.gd`: Computes result deltas for node categories.
- `ReflectionManager.gd`: Upgrades hint tiers based on failures when reflection chosen.
- `DegradationManager.gd`: Computes visual/audio/text tier from monotony & shortcut ratio.
- `ShopManager.gd`: Queues box purchases; delivers accessories next day.
- `TokenManager.gd`: Manages ephemeral tokens, pact carry penalty, wildcard conversion.
- `PuzzleManager.gd`: Dispatches to individual puzzle scenes/stubs.
- `Logger.gd`: Collects structured events; can flush to JSON for analysis.

## Data (JSON Driven)
- `degradation_config.json`: Tiers & presentation layers.
- `node_pools.json`: Node templates & counts.
- `accessories.json`: Gacha boxes & accessory effects (not fully applied yet).
- `puzzles_config.json`: Puzzle parameter tiers, burnout settings, hint costs.

## Update Order (Challenge Node)
1. Time decrement
2. Puzzle executes
3. Deltas computed (burnout adjustments)
4. Failure registration
5. Reflection opportunity (if user selects)
6. Logging

## Extensibility Points
- Add new puzzle archetype: extend `PuzzleManager.run_puzzle` match and config JSON.
- Accessory effect application: create effect resolver hooking into delta pipeline (TODO backlog).
- Persistent save: implement serialization using `GameState.save_state()`.

## Degradation Application (Future Visual Layer)
`DegradationManager.compute_tier` consumed by UI to adjust palette/audio/text richness. Central thresholds avoid duplication.

## Run Termination
Depth computed at `GameState.end_run()`. Routine lock flagged if depth <0 or shortcut pattern ratio >0.7.

## Non-Goals (Per Spec)
Combat, complex physics, AI pathfinding, inventories, skill tree (placeholder), procedural generation.
