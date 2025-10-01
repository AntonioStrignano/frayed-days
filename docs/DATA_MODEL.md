# Data Model Specification

## Core Game State Structure

### Run & Day Tracking
```gdscript
# Basic progression
current_run: int = 0
current_day: int = 0
current_slot: int = 0
total_runs_completed: int = 0

# Day pattern history for burnout detection
day_pattern_history: Array[Dictionary] = []
# Each entry: {day: int, puzzle_slot_count: int, comfort_slot_count: int, total_slots: int}
```

### Resource System
```gdscript
# Primary resources
growth: float = 0.0          # Main progression currency
monotony: float = 0.0        # Degradation accumulator (skip-driven)
comfort: float = 20.0        # Reflection/recovery currency
debt: float = 0.0           # Erosion placeholder

# Palette progression
growth_score: float = 0.0    # Separate from growth; drives palette upward
palette_tier: int = 4        # Current visual tier (1-7, 4=neutral)

# Secondary currencies
fragments: int = 0           # Rare drops from puzzles
shortcut_coins: int = 0      # SC from shortcuts
growth_coins: int = 0        # GC placeholder
wildcard_points: int = 0     # Post-run conversion from unused tokens
```

### Puzzle Progression Tracking
```gdscript
# Tier progression per puzzle type
puzzle_tiers: Dictionary = {
    "memory": "easy",        # easy/medium/hard
    "association": "easy",
    "timing": "easy",
    "risk": "easy",
    "resource_balance": "easy",
    "signal_filter": "easy"
}

# Success streaks for tier escalation
consecutive_puzzle_streak: Dictionary = {
    "memory": 0,
    "association": 0,
    "timing": 0,
    "risk": 0,
    "resource_balance": 0,
    "signal_filter": 0
}

# Failure tracking for hint access
puzzle_type_failed: Dictionary = {
    "memory": 0,
    "association": 0,
    "timing": 0,
    "risk": 0,
    "resource_balance": 0,
    "signal_filter": 0
}

# Hint tier progression
hint_tiers: Dictionary = {
    "memory": 0,        # 0/1/2
    "association": 0,
    "timing": 0,
    "risk": 0,
    "resource_balance": 0,
    "signal_filter": 0
}
```

### Token System (Deterministic)
```gdscript
# Deterministic sequence position
token_queue_index: int = 0   # Current position in cycle

# Token sequence definition
TOKEN_SEQUENCE: Array[String] = [
    "focus",         # 0
    "foresight",     # 1
    "null_debt",     # 2
    "stabilizer",    # 3
    "filter_boost",  # 4
    "wildseed"       # 5
]

# Current inventory (max 4)
tokens_inventory: Array[String] = []

# Tokens pending delivery (from previous runs via pact)
tokens_pending: Array[String] = []
```

### Pact System
```gdscript
# Pact tracking
pact_count: int = 0                    # Total pacts accepted
pact_decline_streak: int = 0           # Consecutive declines
pact_growth_penalty: float = 0.0       # Current growth reduction (%)
pact_temptation_active: bool = false   # Temptation overlay enabled

# Pact history for resolve buff calculation
pact_runs_without: int = 0            # Runs since last pact (for penalty reset)
```

### Burnout System
```gdscript
# Slot-based burnout tracking
consecutive_puzzle_slots: int = 0      # Consecutive non-comfort/support slots
burnout_stage: int = 0                # 0/1/2/3 current burnout level

# Day pattern burnout (3 days ≥70% puzzle, 0 comfort)
burnout_day_pattern_count: int = 0    # Consecutive qualifying days
```

### Monotony Event Tracking
```gdscript
# Daily monotony change tracking
monotony_events_today: Array[Dictionary] = []
# Each entry: {event_type: String, monotony_change: float, slot: int}

# Event types for monotony:
# "skip_puzzle": +6
# "exit_after_fail": +4
# "pact_accepted": +15*N
# "forced_comfort_day": +10
# "comfort_overuse": +5 (second), +8 (third)
# "reflection_performed": -3 (cap -6/day)
```

### Palette State & Hysteresis
```gdscript
# Current palette influence factors
monotony_palette_push: int = 0         # Downward pressure (1-3, higher = more down)
growth_palette_push: int = 0           # Upward pressure (1-3, higher = more up)

# Hysteresis thresholds
MONOTONY_THRESHOLDS: Array[int] = [30, 45, 60]    # Push to tiers 3,2,1
GROWTH_THRESHOLDS: Array[int] = [20, 40, 60]      # Push to tiers 5,6,7
HYSTERESIS_MARGIN: int = 10                        # Points below threshold to rise
GROWTH_DROP_MARGIN: int = 5                        # GrowthScore below threshold-5 to drop
```

### Accessory System (Existing)
```gdscript
# Owned accessories (delivered)
accessories_owned: Array[Dictionary] = []
# Each: {type: String, effect: Dictionary, obtained_run: int}

# Pending accessories (purchased, not delivered)
accessories_pending: Array[Dictionary] = []
# Delivered at start of next day
```

### Depth Calculation
```gdscript
# Computed property
func get_depth() -> float:
    return growth - (monotony + debt)

# Win/lose thresholds
ROUTINE_LOCK_DEPTH: float = 0.0
SHORTCUT_RATIO_LOCK: float = 0.7
```

## Derived Calculations

### Growth Score Accumulation
```gdscript
# Daily growth score events
func add_growth_score(amount: float, reason: String):
    growth_score += amount
    # Log event for tracking

# Sources:
# - Easy success: +1
# - Medium success: +2
# - Hard success: +4 (+1 bonus if no skip in previous 2 slots)
# - Failure with immediate retry: +0.5
# - Reflection + success same type: +1
# - Daily decay: -2 if no reflections performed
```

### Monotony Daily Limits
```gdscript
# Capping rules
MAX_MONOTONY_REDUCTION_PER_DAY: float = 6.0   # From reflections
MAX_MONOTONY_TIERS_UP_PER_DAY: int = 3        # From abuse patterns
MAX_MONOTONY_TIERS_DOWN_PER_DAY: int = 2      # From positive play
```

### Token Queue Progression
```gdscript
func get_next_token() -> String:
    var token = TOKEN_SEQUENCE[token_queue_index]
    token_queue_index = (token_queue_index + 1) % TOKEN_SEQUENCE.size()
    return token

func add_token_to_inventory(token: String) -> bool:
    if tokens_inventory.size() >= 4:
        return false  # Must consume token first
    tokens_inventory.append(token)
    return true
```

### Pact Scaling Formulas
```gdscript
# Pact acceptance penalties
func get_pact_monotony_penalty() -> float:
    return 15.0 * pact_count

func get_pact_growth_penalty() -> float:
    return min(0.4, 0.1 * pact_count)  # Cap at -40%

# Resolve buff from declining
func get_resolve_growth_bonus() -> float:
    return 0.1 if pact_decline_streak >= 2 else 0.0

func get_resolve_fragment_bonus() -> bool:
    return pact_decline_streak >= 3
```

### Burnout Stage Effects
```gdscript
# Stage effect multipliers
BURNOUT_EFFECTS = {
    0: {"timer_mult": 1.0, "latency_add": 0, "growth_mult": 1.0},
    1: {"timer_mult": 0.9, "latency_add": 30, "growth_mult": 1.0},
    2: {"timer_mult": 0.9, "latency_add": 30, "growth_mult": 0.85},
    3: {"timer_mult": 1.0, "latency_add": 0, "growth_mult": 1.0}  # Forced comfort day
}
```

## Save/Load Structure
```gdscript
func save_state() -> Dictionary:
    return {
        "run_progress": {...},
        "resources": {...},
        "puzzle_progression": {...},
        "token_system": {...},
        "pact_system": {...},
        "burnout_system": {...},
        "monotony_tracking": {...},
        "palette_state": {...},
        "accessories": {...}
    }

func load_state(data: Dictionary):
    # Restore all state from save data
    # Validate data integrity
    # Handle version migrations if needed
```

## Configuration Dependencies
Data model connects to JSON configuration files:
- `degradation_config.json`: Palette thresholds and hysteresis values
- `puzzles_config.json`: Tier parameters and burnout stage thresholds
- `node_pools.json`: Node availability and slot constraints
- `accessories.json`: Accessory effects and delivery rules