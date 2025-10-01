# Puzzle Archetypes
Each puzzle returns a result dict: `{success, puzzle_type, growth_reward, fragment?, token, hint_used}`.
Every completed puzzle (success or failure) assigns 1 token from deterministic sequence.

## Final 6 Selected Archetypes
Covering perception, semantics, reflexes, risk, resource manipulation, and filtering:

### 1. Memory (Sequence)
**Concept**: Pattern recall under time pressure
- **Easy**: 4 symbols, shown 1.8s, no noise
- **Medium**: 6 symbols, 1.2s, 1 ghost symbol
- **Hard**: 8-9 symbols, 0.9s, 2 ghosts + shuffle post-hide
- **Hint1**: Last symbol remains half-opaque 0.4s extra
- **Hint2**: Shows position map (fade grid) before hide

### 2. Association (Semantic)
**Concept**: Concept/word pair matching with distractors
- **Easy**: 3 pairs, 1 distractor
- **Medium**: 4 pairs, 2 synonymic distractors
- **Hard**: 5 pairs, 3 semantically close distractors
- **Hint1**: Highlights one distractor (grayed)
- **Hint2**: Auto-locks one correct pair

### 3. Timing (Bar)
**Concept**: Precision timing with moving target
- **Easy**: 18% window, linear velocity
- **Medium**: 10% window, curved acceleration
- **Hard**: 6% window, jitter ± random, micro input delay 50ms
- **Hint1**: Window +2%
- **Hint2**: Slows final 0.4s

### 4. Risk (Cards)
**Concept**: Risk assessment with partial information
- **Easy**: 3 cards partial visibility (reward range shown)
- **Medium**: 1 card covers high penalty, reduced hints
- **Hard**: Introduces Bluff card (inverted flip), extreme reward + penalty spread
- **Hint1**: Reveals if severe penalty exists
- **Hint2**: Shows approximate numeric range (±25%) on two cards

### 5. Resource Balance (Interdependent Sliders)
**Concept**: Multi-variable optimization under time pressure
- **Easy**: 3 independent sliders, 20% target zone width, 25s timer
- **Medium**: 3 interlocked sliders (moving one shifts others +10%), 15% target, 20s
- **Hard**: Interlock + passive drift (sliders slowly return), 10% target, 18s
- **Hint1**: Highlights next slider to adjust
- **Hint2**: Immobilizes drift for first 8s

### 6. Signal Filter (Noise Detection)
**Concept**: Target detection in noisy signal stream
- **Easy**: 12 symbols stream, 3 targets, 40% noise ratio
- **Medium**: 18 symbols, 5 targets, 55% noise, 1 false positive
- **Hard**: 24 symbols, 7 targets, 65% noise, 2 dynamic false positives (late color change)
- **Hint1**: Target borders with subtle glow
- **Hint2**: Removes 25% random noise (non-targets) at start

## Difficulty Progression System

### Tier Escalation
- **Easy → Medium**: 1 consecutive success
- **Medium → Hard**: 2 consecutive successes in Medium

### Tier Regression
- **Single failure**: Doesn't alter tier (resets streak toward higher tier)
- **Two consecutive failures**: Demote by 1 tier
  - Hard → Medium
  - Medium → Easy
  - Easy: No demotion below
- **Medium reset rule**: Each failure in Medium resets progress counter toward Hard

### Reward Structure
**Base Growth Multipliers**:
- Easy: 1.0 (GC = 0)
- Medium: 1.5 (GC = 1)
- Hard: 2.1 (GC = 1 + 20% chance extra fragment)

**Failure Reward**: Residual Growth = 0.35 × TierFactor (rounded down)
- Enables reflection access (hint progression)
- Provides meaningful progression even on failure

### Reflection & Hint System
**Failure Tracking**: Each failure increments puzzle_type_failed counter

**Hint Tier Requirements**:
- **Hint1**: ≥1 failure + reflection performed
- **Hint2**: ≥2 total failures + second reflection performed

**Anti-Farming**: Reflecting on puzzle already at Hard+Hint2 produces no extra benefit

**Retry Incentive**: Re-entering puzzle immediately after failure generates no monotony cost

## Token Integration
**Guaranteed Token**: Every puzzle completion (regardless of outcome) provides 1 token from deterministic sequence:
Focus → Foresight → Null Debt → Stabilizer → Filter Boost → WildSeed → (loop)

**Inventory Limit**: Max 4 unspent tokens (must consume before collecting new)

## Removed Archetypes
- **Emotion Interpretation**: Overlapped with Association in linguistic load
- **Odd-One-Out**: Logical redundancy with existing pattern recognition

## Implementation Priority
**Phase A Focus**: Memory, Timing, Risk (diverse cognitive demands)
**Phase B Extension**: Association, Resource Balance, Signal Filter
