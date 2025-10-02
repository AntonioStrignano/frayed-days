# SPEC Core Loop (EN)

Source mirror of `docs/it/SPEC_CORE_LOOP_it.md` focusing on non-duplicated authoritative references.

## 1. Core Loop (Macro)
1. Run start → init day=1
2. Intro space → context
3. Select next node (puzzle / comfort / reflect / shop / pact at run end)
4. Execute node → resolve outcome / apply effects
5. Update state → growth, monotony, growth_score, depth, tier streaks, tokens, palette, burnout, pact trackers
6. Immediate feedback (UI numbers + palette/audio shift if threshold)
7. Repeat until room_slot 7
8. End-of-Day summary → conversions (tokens→wildcard?), decay growth_score (if no reflection), burnout pattern evaluation
9. Advance day → refresh nodes / gating Hard
10. Check end conditions (Growth finale / Monotony lock)
11. Conclude run (finale / routine / continue)

## 2. Immutable Enumerations (Freeze v0.1)
- Puzzle Archetypes (6): memory, association, timing, risk, resource_balance, signal_filter
- Token Sequence (loop): focus, foresight, null_debt, stabilizer, filter_boost, wildseed
- Palette Tiers (1..7): total_desaturated, heavy_faded, muted, neutral, light_vivid, full_vivid, hypersaturated

## 3. Success / Failure Escalation
- Easy→Medium: 2 consecutive successes (UPDATED vs legacy EN doc)
- Medium→Hard: 3 consecutive successes
- Regression: 2 consecutive failures demote 1 tier (Easy cannot demote)

## 4. Hard Gating by Day
- Day1: Easy only
- Day2–3: Easy + Medium
- Day4–5: Hard ≤33% of puzzle slots
- Day≥6: Hard ≤50% of puzzle slots

## 5. Dynamic Token Cap
- Base cap: 4 tokens held simultaneously
- Pact active: cap removed (infinite practical)

## 6. Monotony New Event
- `hard_repeat_same_type`: +2 monotony stacking (max +6) for consecutive Hard of same archetype

## 7. Burnout Pattern-Day Model (v2)
- Stage1 trigger: 2 consecutive days ≥80% puzzle slots AND 0 comfort → palette tier max =5
- Stage2 trigger: 3 consecutive days ≥75% puzzle slots AND comfort ≤1 → -15% Growth + day_timer -10%
- Forced Rest Day: persistence (following day still ≥70% puzzle) → Comfort/Reflection only, +10 monotony, reset pattern
- Recovery: day with <70% puzzle AND ≥1 comfort/reflection → stage -1

## 8. Pact System v0.1
Accept (iteration N):
- Monotony +15 * N immediate
- Remove token cap (infinite)
- Fragment Banking (FragmentsBank accumulates; no auto spending)
- Fragment→MC conversion improved 2:1 (base 3:1)
- Growth penalty Day1 next run: -15% * N (cap -45%)
- Skill tree (Monotony branch) cost reduction -20%

Decline Streak:
- 2: +10% Growth first 2 puzzles of the day
- 3: +1 guaranteed fragment on first Hard success of run
- ≥4: -5% monotony gain cumulative (cap -30%)

## 9. Depth Formula (Snapshot v0.1)
`Depth = Growth + (FragmentsBank * 0.5) + (MC * 0.3) - Monotony - (PactAccepts * 8)`
(Tuning markers: 0.5 / 0.3 / 8 may shift; monotony sign fixed.)

## 10. Fragments & Banking
- Fragments gained under Pact are diverted to FragmentsBank (persistent across days)
- Leaving Pact (design TBD) triggers optional conversion or retention policy (future)

## 11. MC (Monotony Coins)
- Base conversion: 3 fragments → 1 MC
- Under Pact: 2 fragments → 1 MC
- Role: secondary economy to purchase monotony mitigations / alt skill unlocks; Depth coefficient 0.3 (removable if noisy)

## 12. Telemetry Hooks (Reference)
Events to implement first: node_chosen, puzzle_result, reflection_use, skip, token_use, burnout_stage_change, palette_tier_change, pact_decision, day_end, run_end.
Field order freeze see `TELEMETRY.md` (EN mirror of italian ordering).

## 13. Non-Duplication Policy
Numbers authoritative in: BALANCING_NOTES_it.md / BALANCING_NOTES.md (snapshot sections), ECONOMIA_it.md / ECONOMY.md, DATA_MODEL_it.md / DATA_MODEL.md.

## 14. Open TODO (Mirrored)
- TUNING_BAL_GROWTH_VALUES
- TUNING_MONO_SPIKE
- TUNING_CONV_FRAG_MC
- TODO_GS_CURVE
- TODO_MONOTONY_CURVE
- TODO_BURNOUT_RECOVERY_MODEL

---
Addendum intentionally concise; see Italian docs for richer narrative until English expansion completed.
