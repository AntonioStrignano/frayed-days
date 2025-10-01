# Specifica Modello Dati

## Struttura Stato Core del Gioco

### Tracking Run & Giorni
```gdscript
# Progressione base
current_run: int = 0
current_day: int = 0
current_slot: int = 0
total_runs_completed: int = 0

# Cronologia pattern giorni per rilevamento burnout
day_pattern_history: Array[Dictionary] = []
# Ogni entry: {day: int, puzzle_slot_count: int, comfort_slot_count: int, total_slots: int}
```

### Sistema Risorse
```gdscript
# Risorse primarie
growth: float = 0.0          # Valuta progressione principale
monotony: float = 0.0        # Accumulatore degradazione (skip-driven)
comfort: float = 20.0        # Valuta reflection/recovery
debt: float = 0.0           # Placeholder erosione

# Progressione palette
growth_score: float = 0.0    # Separato da growth; guida palette verso l'alto
palette_tier: int = 4        # Tier visuale corrente (1-7, 4=neutro)

# Valute secondarie
fragments: int = 0           # Drop rari da puzzle
shortcut_coins: int = 0      # SC da scorciatoie
growth_coins: int = 0        # GC placeholder
wildcard_points: int = 0     # Conversione post-run da token inutilizzati
```

### Tracking Progressione Puzzle
```gdscript
# Progressione tier per tipo puzzle
puzzle_tiers: Dictionary = {
    "memory": "easy",        # easy/medium/hard
    "association": "easy",
    "timing": "easy",
    "risk": "easy",
    "resource_balance": "easy",
    "signal_filter": "easy"
}

# Streak successi per escalation tier
consecutive_puzzle_streak: Dictionary = {
    "memory": 0,
    "association": 0,
    "timing": 0,
    "risk": 0,
    "resource_balance": 0,
    "signal_filter": 0
}

# Tracking fallimenti per accesso hint
puzzle_type_failed: Dictionary = {
    "memory": 0,
    "association": 0,
    "timing": 0,
    "risk": 0,
    "resource_balance": 0,
    "signal_filter": 0
}

# Progressione tier hint
hint_tiers: Dictionary = {
    "memory": 0,        # 0/1/2
    "association": 0,
    "timing": 0,
    "risk": 0,
    "resource_balance": 0,
    "signal_filter": 0
}
```

### Sistema Token (Deterministico)
```gdscript
# Posizione sequenza deterministica
token_queue_index: int = 0   # Posizione corrente nel ciclo

# Definizione sequenza token
TOKEN_SEQUENCE: Array[String] = [
    "focus",         # 0
    "foresight",     # 1
    "null_debt",     # 2
    "stabilizer",    # 3
    "filter_boost",  # 4
    "wildseed"       # 5
]

# Inventario corrente (max 4)
tokens_inventory: Array[String] = []

# Token in attesa consegna (da run precedenti via patto)
tokens_pending: Array[String] = []
```

### Sistema Patto
```gdscript
# Tracking patto
pact_count: int = 0                    # Patti totali accettati
pact_decline_streak: int = 0           # Rifiuti consecutivi
pact_growth_penalty: float = 0.0       # Riduzione growth corrente (%)
pact_temptation_active: bool = false   # Overlay tentazione abilitato

# Cronologia patto per calcolo buff resolve
pact_runs_without: int = 0            # Run dall'ultimo patto (per reset penalità)
```

### Sistema Burnout
```gdscript
# Tracking burnout slot-based
consecutive_puzzle_slots: int = 0      # Slot consecutivi non-comfort/support
burnout_stage: int = 0                # 0/1/2/3 livello burnout corrente

# Burnout pattern giornaliero (3 giorni ≥70% puzzle, 0 comfort)
burnout_day_pattern_count: int = 0    # Giorni qualificanti consecutivi
```

### Tracking Eventi Monotonia
```gdscript
# Tracking cambi monotonia giornalieri
monotony_events_today: Array[Dictionary] = []
# Ogni entry: {event_type: String, monotony_change: float, slot: int}

# Tipi evento per monotonia:
# "skip_puzzle": +6
# "exit_after_fail": +4
# "pact_accepted": +15*N
# "forced_comfort_day": +10
# "comfort_overuse": +5 (seconda), +8 (terza)
# "reflection_performed": -3 (cap -6/giorno)
```

### Stato Palette & Hysteresis
```gdscript
# Fattori influenza palette correnti
monotony_palette_push: int = 0         # Pressione verso il basso (1-3, più alto = più giù)
growth_palette_push: int = 0           # Pressione verso l'alto (1-3, più alto = più su)

# Soglie hysteresis
MONOTONY_THRESHOLDS: Array[int] = [30, 45, 60]    # Spinta a tier 3,2,1
GROWTH_THRESHOLDS: Array[int] = [20, 40, 60]      # Spinta a tier 5,6,7
HYSTERESIS_MARGIN: int = 10                        # Punti sotto soglia per risalire
GROWTH_DROP_MARGIN: int = 5                        # GrowthScore sotto soglia-5 per calare
```

### Sistema Accessori (Esistente)
```gdscript
# Accessori posseduti (consegnati)
accessories_owned: Array[Dictionary] = []
# Ogni: {type: String, effect: Dictionary, obtained_run: int}

# Accessori in attesa (acquistati, non consegnati)
accessories_pending: Array[Dictionary] = []
# Consegnati all'inizio giorno successivo
```

### Calcolo Depth
```gdscript
# Proprietà computata
func get_depth() -> float:
    return growth - (monotony + debt)

# Soglie vittoria/sconfitta
ROUTINE_LOCK_DEPTH: float = 0.0
SHORTCUT_RATIO_LOCK: float = 0.7
```

## Calcoli Derivati

### Accumulo Growth Score
```gdscript
# Eventi growth score giornalieri
func add_growth_score(amount: float, reason: String):
    growth_score += amount
    # Log evento per tracking

# Fonti:
# - Successo Easy: +1
# - Successo Medium: +2
# - Successo Hard: +4 (+1 bonus se nessun skip nei 2 slot precedenti)
# - Fallimento con retry immediato: +0.5
# - Reflection + successo stesso tipo: +1
# - Decay giornaliero: -2 se nessuna reflection eseguita
```

### Limiti Giornalieri Monotonia
```gdscript
# Regole capping
MAX_MONOTONY_REDUCTION_PER_DAY: float = 6.0   # Da reflection
MAX_MONOTONY_TIERS_UP_PER_DAY: int = 3        # Da pattern abuso
MAX_MONOTONY_TIERS_DOWN_PER_DAY: int = 2      # Da gioco positivo
```

### Progressione Coda Token
```gdscript
func get_next_token() -> String:
    var token = TOKEN_SEQUENCE[token_queue_index]
    token_queue_index = (token_queue_index + 1) % TOKEN_SEQUENCE.size()
    return token

func add_token_to_inventory(token: String) -> bool:
    if tokens_inventory.size() >= 4:
        return false  # Devi consumare token prima
    tokens_inventory.append(token)
    return true
```

### Formule Scaling Patto
```gdscript
# Penalità accettazione patto
func get_pact_monotony_penalty() -> float:
    return 15.0 * pact_count

func get_pact_growth_penalty() -> float:
    return min(0.4, 0.1 * pact_count)  # Cap a -40%

# Buff resolve da rifiuto
func get_resolve_growth_bonus() -> float:
    return 0.1 if pact_decline_streak >= 2 else 0.0

func get_resolve_fragment_bonus() -> bool:
    return pact_decline_streak >= 3
```

### Effetti Stage Burnout
```gdscript
# Moltiplicatori effetto stage
BURNOUT_EFFECTS = {
    0: {"timer_mult": 1.0, "latency_add": 0, "growth_mult": 1.0},
    1: {"timer_mult": 0.9, "latency_add": 30, "growth_mult": 1.0},
    2: {"timer_mult": 0.9, "latency_add": 30, "growth_mult": 0.85},
    3: {"timer_mult": 1.0, "latency_add": 0, "growth_mult": 1.0}  # Giornata comfort forzata
}
```

## Struttura Save/Load
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
    # Ripristina tutto lo stato dai dati save
    # Valida integrità dati
    # Gestisce migrazioni versione se necessario
```

## Dipendenze Configurazione
Il modello dati si collega ai file configurazione JSON:
- `degradation_config.json`: Soglie palette e valori hysteresis
- `puzzles_config.json`: Parametri tier e soglie stage burnout
- `node_pools.json`: Disponibilità nodi e vincoli slot
- `accessories.json`: Effetti accessori e regole consegna