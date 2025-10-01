# Design Document - Frayed Days

## Tagline
**"Restare consuma quanto andare"**

## High Concept
A 2D Godot 4 narrative day-loop exploring the tension between immediate shortcuts (time saved now, future monotony cost) and deliberate growth (puzzle effort, delayed payoff). Over ~10-12 runs, players either reach a Growth resolution or fall into a Routine hard lock.

## Core Mechanics

### Puzzle Progression (6 Final Archetypes)

**Selected Puzzles** (covering perception, semantics, reflexes, risk, resource manipulation, filtering):
1. **Memory** (Sequence) - Visual pattern recall
2. **Association** (Semantic) - Concept matching
3. **Timing** (Bar) - Precision timing challenges
4. **Risk** (Cards) - Risk assessment and choice
5. **Resource Balance** (Interdependent Sliders) - Multi-variable optimization
6. **Signal Filter** (Noise Filtering) - Signal detection in noise

**Removed**: Emotion (overlapped with Association in linguistic load), Odd-One-Out (logical redundancy).

### Difficulty Tiers & Escalation

**Tier Progression**: Easy → Medium → Hard

**Escalation Rules**:
- Easy → Medium: 1 consecutive success
- Medium → Hard: 2 consecutive successes in Medium

**Failure & Regression**:
- Single failure doesn't alter tier (only resets streak toward higher tier)
- Two consecutive failures in same tier demote by 1 tier (Hard→Medium, Medium→Easy)
- Easy doesn't demote below
- Reset medium progress: each failure in Medium resets counter toward Hard

**Base Reward Multipliers** (Growth factor):
- Easy: 1.0 (GC = 0)
- Medium: 1.5 (GC = 1)
- Hard: 2.1 (GC = 1 + 20% chance extra fragment)

**Failure Reward**: Residual Growth = 0.35 × TierFactor (rounded down), enables reflection (hint access).

### Monotony System (Revised Logic)

**Monotony DOES NOT increase on puzzle failure.**

**Monotony increases on**:
- Skipping (not entering puzzle when offered): +6
- Refusing to retry immediately after failure (exiting frame without reattempt): +4
- Excessive consecutive comfort usage: second visit same day +5, third +8
- Pact acceptance: +15 × N (N = iteration count)
- Forced Comfort Day (burnout consequence): +10

**Monotony decreases on**:
- Successful sequence of 2 puzzles with reflection applied within 3 slots: -3 (cap -6/day)
- Day with ≥1 Hard completed and ≤1 skip

**Daily Capping**: No more than 2 tier reduction per day; maximum 3 tier increase if abuse pattern (skip+pact+burnout).

### Palette / Visual State (7-Tier Bipolar)

**Direction**: 1 = Extreme Monotony (B/W), 4 = Neutral, 7 = Extreme Growth (vivid)

**Tiers** (internal names):
1. **Total Desaturated** (monochrome, amputated text)
2. **Heavy Faded**
3. **Muted**
4. **Neutral**
5. **Light Vivid**
6. **Full Vivid**
7. **Hypersaturated** (minimal pulsing accents + subtle extra audio layer)

**Transition Logic**:
- Monotony > threshold pushes toward 1
- Positive stabilized Depth + Hard successes push toward 7

**Thresholds** (initial parameters):
- **Monotony push down**: 30 (→3), 45 (→2), 60 (→1)
- **Growth push up** (requires monotony < corresponding): GrowthScore 20 (→5), 40 (→6), 60 (→7)

**Hysteresis**: Must drop monotony 10 points below threshold to rise; growth only drops if GrowthScore < threshold-5 AND missing Hard success in day.

**Transition Rate**: Never skip more than 1 tier per event (smooth progression).

### Burnout System (Multi-Stage)

**Tracking**: Based on slots (not entire days) and daily patterns.

**Stages**:
- **Stage 1**: 6 consecutive puzzles (no Support/Comfort) → Timer -10%, input latency +30ms, audio "breathing" layer
- **Stage 2**: 9 consecutive → Stage 1 malus + growth reward reduction -15%
- **Stage 3 Trigger**: 12 consecutive → Forced Comfort Day (only reflection and comfort), monotony +10

**Day Pattern Burn**: 3 consecutive days with ≥70% puzzle slots and 0 comfort nodes → auto Stage 1 at start of Day 4.

**Stage Reset**: Each effective Comfort or Reflect consumption -1 stage (minimum 0).

### Token System (Deterministic)

**Guaranteed Token Rule**: Every completed puzzle (success or failure) assigns 1 baseline token from deterministic sequence:
**Focus → Foresight → Null Debt → Stabilizer → Filter Boost → WildSeed → (loop)**

**WildSeed**: Choose one of the previous tokens and immediately apply.

**Limits**:
- Max 4 unspent tokens at once (collect new → must consume one first)
- Pact influences only unspent tokens

### Pact System (Extremely Punitive)

**Offer Trigger**: End of run if possessing ≥2 unspent tokens OR Depth < Growth threshold.

**If Accept** (Pact N, N = times accepted):
- Keep up to 3 tokens (your choice)
- Monotony +15 × N immediate
- Reduces growth rewards for Day 1 puzzles next run: -10% × N (cap -40%)
- Adds "Temptation" overlay: start of each day while monotony >30, offers trade 1 comfort → 1 extra token (accepting increases monotony +5)

**If Decline** (Decline streak D):
- From second consecutive decline, gain "Resolve" buff: +10% growth on first 2 puzzles/day
- D≥3: +1 guaranteed fragment on first Hard of run
- Declining resets any growth penalty from previous pacts after 2 runs without pact

**Design Intent**: Pact should appear appealing only if player is short on hints/tokens for bridging but already heading toward sterile state—centered on conscious choice.

### Growth Score (For Palette Progression)

**Growth Score Accumulation**:
- Easy success: +1
- Medium success: +2
- Hard success: +4 (+1 extra if no skip in previous 2 slots)
- Failure with immediate retry: +0.5
- Active reflection followed by success of same type: +1

**Daily Decay**: -2 at end of day if zero reflections performed.

### Reflection & Hints

**Failure Tracking**: Each failure marks puzzle_type_failed += 1

**Retry Incentive**: Re-entering puzzle immediately after failure generates no monotony cost

**Hint Tiers**:
- **Hint1**: Requires ≥1 failure and reflection
- **Hint2**: Requires ≥2 total failures and second reflection
- **Limitation**: Reflecting on puzzle already at Hard+Hint2 produces no extra benefit (prevents farming)

## Resource Economy

### Core Resources
- **Growth**: Primary progression currency
- **Monotony**: Friction/degradation accumulator
- **Comfort**: Spent on reflections and recovery
- **Debt**: Erosion placeholder
- **Fragments**: Rare puzzle drops
- **Tokens**: Deterministic cycle rewards
- **Growth Score**: Palette progression metric
- **Wildcard Points**: Post-run conversion currency

### Depth Formula
`depth = growth - (monotony + debt)`

**Win Condition**: Depth trending positive by run ~6
**Lose Condition**: Depth < 0 OR shortcut pattern ratio > 0.7

## End States

**Growth Ending**: Achieved through consistent positive depth and diverse play patterns
**Routine Lock**: Triggered by excessive monotony or shortcut dependency, blocks further progression

## Design Pillars

1. **Tension Management**: Every choice has immediate benefit and delayed cost
2. **Behavioral Reflection**: System responds to play patterns, not just outcomes
3. **Meaningful Recovery**: Failure provides pathways to improvement, not just penalty
4. **Visual Cohesion**: Monotony and growth directly manifest in presentation layer
5. **Deterministic Fairness**: Core rewards follow predictable rules while maintaining emotional impact