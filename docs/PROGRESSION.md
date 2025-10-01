# Progression & Gating System

## Core Progression Philosophy
Players advance through puzzle difficulty tiers based on demonstrated competency, with early-game protection against overwhelming challenge spikes and long-term escalation paths for sustained engagement.

## Difficulty Gating Rules

### Early Game Protection
**Days 1-2 Restriction**: No Hard tier puzzles available
- Prevents overwhelming cognitive load during onboarding
- Allows familiarity building with basic mechanics
- Ensures adequate time for comfort/reflection system learning

**Pre-Day 6 Limitation**: Maximum 50% Hard puzzle templates before Day 6
- Gradual introduction of peak difficulty
- Maintains accessibility during initial progression
- Balances challenge with learning curve

### Template Distribution Logic
```gdscript
func can_offer_hard_puzzle(current_day: int, hard_puzzles_today: int, total_puzzles_today: int) -> bool:
    # Absolute restriction Days 1-2
    if current_day <= 2:
        return false

    # Percentage cap before Day 6
    if current_day < 6:
        var hard_percentage = float(hard_puzzles_today) / float(total_puzzles_today)
        return hard_percentage < 0.5

    # No restrictions Day 6+
    return true
```

## Tier Escalation System

### Success-Based Progression
**Easy → Medium**: 1 consecutive success
- Low barrier to intermediate challenge
- Rewards initial competency demonstration
- Quick feedback loop for engagement

**Medium → Hard**: 2 consecutive successes in Medium
- Higher bar for peak difficulty access
- Ensures consistent intermediate performance
- Prevents premature difficulty spikes

### Failure-Based Regression
**Regression Triggers**:
- Two consecutive failures in same tier
- Hard → Medium → Easy (bottoms out at Easy)
- Single failures reset escalation streak but don't demote

**Reset Mechanics**:
- Any failure in Medium resets progress counter toward Hard
- Preserves current tier but prevents premature advancement
- Maintains challenge level while building consistency

## Run-Based Progression Considerations

### Cross-Run Continuity
**Tier Persistence**: Puzzle tiers carry across runs within same session
- Maintains progression investment
- Prevents repetitive early-game grinding
- Supports longer-term skill development

**Reset Triggers**:
- New game session resets to baseline Easy tiers
- Major version updates may reset progression
- Player-initiated reset option available

### Depth-Based Gating
**Growth Trajectory Requirements**:
- Successful run completion requires positive depth trend
- Hard puzzle access may consider overall run performance
- Routine lock prevents progression if shortcut dependency >70%

## Hint System Integration

### Failure-to-Hint Pipeline
**Hint Tier 1**: Unlocked after ≥1 failure + reflection
- Provides gentle assistance without trivializing challenge
- Encourages reflection mechanic usage
- Maintains puzzle integrity

**Hint Tier 2**: Unlocked after ≥2 total failures + second reflection
- More substantial assistance for persistent struggles
- Prevents infinite failure loops
- Balances accessibility with achievement satisfaction

### Anti-Farming Protection
**Diminishing Returns**:
- Reflecting on Hard+Hint2 puzzles provides no additional benefit
- Prevents hint tier farming for resource exploitation
- Maintains meaningful progression gates

## Token Integration with Progression

### Guaranteed Token Rule
Every puzzle completion (success or failure) provides token from deterministic sequence:
**Focus → Foresight → Null Debt → Stabilizer → Filter Boost → WildSeed → (loop)**

**Progression Impact**:
- Tokens provide bridge resources during difficulty transitions
- WildSeed choice creates strategic decision points
- 4-token inventory cap forces regular consumption

### Pact System Pressure
**Difficulty Spike Management**:
- Pacts become tempting during challenging progression walls
- Punitive scaling discourages repeated pact usage
- Decline streaks reward persistence through difficulty

## Monotony-Driven Gating

### Skip Behavior Consequences
**Monotony Accumulation**:
- Skipping puzzles: +6 monotony
- Avoiding retries after failure: +4 monotony
- Creates pressure to engage with appropriate difficulty

**Palette Degradation**:
- High monotony pushes toward desaturated visual tiers
- Visual feedback reinforces behavioral consequences
- Provides clear progression state communication

### Recovery Pathways
**Monotony Reduction**:
- Reflection-backed success sequences: -3 monotony (cap -6/day)
- Hard puzzle completion with minimal skips
- Encourages diverse, challenging play patterns

## Long-Term Progression Arc

### Run 1-3: Foundation Building
- Easy/Medium tier exploration
- Reflection system familiarity
- Basic token economy understanding

### Run 4-7: Competency Development
- Regular Hard tier access
- Burnout management learning
- Pact decision sophistication

### Run 8-12: Mastery Demonstration
- Consistent positive depth maintenance
- Advanced palette tier achievement
- Growth vs. Routine resolution approach

## Implementation Notes

### Data Tracking Requirements
```gdscript
# Track for gating decisions
consecutive_successes_per_tier: Dictionary
days_since_first_hard: int
hard_puzzle_count_today: int
total_puzzle_count_today: int
```

### Configuration Integration
Progression rules connect to:
- `puzzles_config.json`: Tier unlock thresholds
- `node_pools.json`: Template availability by day
- `degradation_config.json`: Monotony impact on accessibility

### Balancing Considerations
- Early protection vs. player agency tension
- Difficulty curve steepness calibration
- Cross-run progression persistence decisions
- Anti-frustration vs. achievement satisfaction balance