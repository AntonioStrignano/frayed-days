# Next Steps Roadmap (English)
(Keep scope tight; implement in slices.)

## Phase 1 – Simulation & Baseline
1. Headless SimulationRunner (N days, M runs) using current stubs.
2. Collect aggregate metrics: avg growth/day, monotony/day, shortcut ratio, burnout triggers.
3. Adjust placeholder numbers before investing in UI polish.

## Phase 2 – Core Feel
1. Implement real Memory puzzle (base tier) with hint logic.
2. Degradation visual placeholder (palette swap or color mod).
3. Forced comfort day mechanic after sustained burnout (e.g., burnout 2 consecutive days).

## Phase 3 – Systems Depth
1. Accessory effect resolver (post-delta hook) – apply growth mult, monotony reduction, burnout threshold bonus.
2. Persistence (save/load JSON) at end-day and manual trigger.
3. Depth ending branch gating (routine lock vs progress).

## Phase 4 – Puzzle Expansion
1. Add Timing puzzle real interaction.
2. Expand Memory to intermediate tier (longer sequence) + hint tier visuals.
3. Introduce risk puzzle with partial success UI.

## Phase 5 – Economy & Feedback
1. Token effect variety (non-growth utility).
2. Fragment set mini-progression (milestone narrative lines).
3. Wildcard points sink (convert to fragment reroll or accessory reroll).

## Phase 6 – Polish & QA
1. Text richness gating hooks (monotony tier -> adjectives filter).
2. Audio layering stubs for degradation.
3. Analytics export from Logger to CSV/JSON summary.

## Guiding Principles
- Ship vertical slices; no broad feature half-finished.
- Every puzzle added must surface growth vs monotony tension clearly.
- Avoid adding new resource types unless a design review approves.
