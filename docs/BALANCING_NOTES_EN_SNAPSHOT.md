# Balancing Notes (EN) – Snapshot v0.1

Mirrors Italian balancing snapshot for parity. Italian remains master for richer commentary until expansion.

## Depth Formula
`Depth = Growth + (FragmentsBank * 0.5) + (MC * 0.3) - Monotony - (PactAccepts * 8)`

## Pact v0.1
Accept (N-th time): monotony +15*N, remove token cap, enable fragment banking (FragmentsBank), fragment→MC 2:1 (base 3:1), growth penalty next run Day1 -15% * N (cap -45%), -20% cost on Monotony branch skills.
Decline streak: 2→ +10% Growth first 2 puzzles; 3→ +1 guaranteed fragment first Hard success; ≥4→ -5% monotony gain cumulative (cap -30%).

## Token Cap
Base 4; infinite while Pact active.

## Burnout Pattern-Day v2
Stage1: 2 consecutive days ≥80% puzzle and 0 comfort → palette cap tier 5.
Stage2: 3 consecutive days ≥75% puzzle and comfort ≤1 → -15% Growth + -10% day timer.
Forced Rest Day: persistence (next day still ≥70% puzzle) → comfort/reflection only, monotony +10, reset.
Recovery: day <70% puzzle AND ≥1 comfort/reflection → stage -1.

## Hard Gating by Day
Day1 Easy only; Day2–3 Easy+Medium; Day4–5 Hard ≤33%; Day≥6 Hard ≤50%.

## Escalation (Updated)
Easy→Medium 2 successes; Medium→Hard 3 successes; 2 fails same tier demote; Easy cannot demote.

## Monotony New Event
`hard_repeat_same_type`: +2 monotony stacking (max +6) for consecutive Hard same archetype.

## Fragments & MC
Fragments under Pact route to banking (FragmentsBank). Conversion 3:1 base, 2:1 Pact. MC coefficient 0.3 in Depth (tunable, removable if noisy signal).

## Open Tuning Flags
TUNING_BAL_GROWTH_VALUES, TUNING_MONO_SPIKE, TUNING_CONV_FRAG_MC, TUNING_MC_SINKS, TODO_GS_CURVE, TODO_MONOTONY_CURVE, TODO_BURNOUT_RECOVERY_MODEL.

---
Source-of-truth alignment complete for this snapshot.
