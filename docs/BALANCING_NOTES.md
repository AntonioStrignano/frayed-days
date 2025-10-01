# Balancing Notes
Updated numeric formulas reflecting design overhaul.

## Core Formulas

### Growth Score (Palette Progression)
- **Easy success**: +1
- **Medium success**: +2
- **Hard success**: +4 (+1 bonus if no skip in previous 2 slots)
- **Failure with immediate retry**: +0.5
- **Reflection followed by success (same type)**: +1
- **Daily decay**: -2 if zero reflections performed

### Monotony Accumulation (Skip-Driven)
**Increases**:
- Skip puzzle when offered: +6
- Exit after failure without retry: +4
- Pact acceptance: +15 × N (N = pact count)
- Forced Comfort Day (burnout): +10
- Comfort overuse: second visit same day +5, third +8

**Decreases**:
- Reflection-backed success sequence (2 puzzles within 3 slots): -3 (cap -6/day)

**Daily Caps**: Max +3 tiers increase (abuse), max -2 tiers decrease (positive play)

### Puzzle Tier Rewards
**Base Growth Multipliers**:
- Easy: 1.0 (GC = 0)
- Medium: 1.5 (GC = 1)
- Hard: 2.1 (GC = 1 + 20% chance extra fragment)

**Failure Reward**: 0.35 × TierFactor (rounded down) + reflection access

### Palette Tiers (7-Tier Bipolar)
**Monotony Thresholds** (downward pressure):
- 30 → Tier 3 (Muted)
- 45 → Tier 2 (Heavy Faded)
- 60 → Tier 1 (Total Desaturated)

**Growth Score Thresholds** (upward pressure, requires low monotony):
- 20 → Tier 5 (Light Vivid)
- 40 → Tier 6 (Full Vivid)
- 60 → Tier 7 (Hypersaturated)

**Hysteresis**: 10 points below threshold to rise; growth drops only if GrowthScore < threshold-5 AND no Hard success today.

### Burnout Stages
**Slot-Based Triggers**:
- Stage 1: 6 consecutive puzzles → Timer -10%, latency +30ms
- Stage 2: 9 consecutive → Stage 1 + growth reward -15%
- Stage 3: 12 consecutive → Forced Comfort Day, monotony +10

**Day Pattern**: 3 days ≥70% puzzles + 0 comfort → auto Stage 1 on Day 4

### Pact Scaling (Punitive)
**Acceptance Penalties**:
- Monotony: +15 × N immediate
- Growth reduction Day 1 next run: -10% × N (cap -40%)
- Temptation offers while monotony >30: 1 comfort → 1 token (+5 monotony if accepted)

**Decline Benefits**:
- Decline streak ≥2: +10% growth first 2 puzzles/day
- Decline streak ≥3: +1 guaranteed fragment first Hard of run

### Token System
**Deterministic Sequence**: Focus → Foresight → Null Debt → Stabilizer → Filter Boost → WildSeed → (loop)
**Inventory Cap**: 4 tokens maximum
**Guaranteed**: 1 token per puzzle completion (success or failure)

## Depth Formula
`depth = growth - (monotony + debt)`

**Target Trajectory**: Positive by run ~6
**Failure States**: depth < 0 OR shortcut ratio > 0.7

## Tier Escalation Timing
- **Easy → Medium**: 1 consecutive success
- **Medium → Hard**: 2 consecutive successes in Medium
- **Regression**: 2 consecutive failures demote 1 tier
- **Progression Reset**: Single failure resets escalation streak

## Early Game Protection
- **Days 1-2**: No Hard puzzles available
- **Before Day 6**: Max 50% Hard puzzle templates
- **Gating Logic**: Prevents overwhelming cognitive load during onboarding

## Fragment Economy
- **Base Drop**: Hard puzzles 20% chance
- **Bonus Sources**: Pact decline streak ≥3 guarantees fragment on first Hard
- **Usage**: Primarily for shop purchases and special unlocks

## Open Tuning Parameters
- Hysteresis margin sensitivity (currently 10 points)
- Growth Score daily decay rate (currently -2)
- Burnout stage recovery speed
- Pact temptation offer frequency
- Fragment drop rate scaling by run number