# Specifica Modello Dati (Aggiornata v0.1)

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
debt: float = 0.0           # Placeholder erosione
growth: float = 0.0              # (Persist) Valuta progressione principale
monotony: float = 0.0            # (Persist) Accumulatore degradazione
comfort: float = 20.0            # (Volatile Giorno) Reset parziale ogni giorno
debt: float = 0.0                # (Persist / potenziale rimozione futura)

# Progressione palette
growth_score: float = 0.0        # (Persist Giorno) driver palette
palette_tier: int = 4            # (Derivato) da growth_score/monotony + hysteresis

# Valute secondarie
fragments: int = 0               # (Persist) Drop rari
fragments_bank: int = 0          # (Persist) Accumulo Patto (FragmentsBank)
mc: int = 0                      # (Persist) Monotony Coins
tokens_discarded: int = 0        # (Telemetry aux) conteggio scarti (post VS)
wildcard_points: int = 0         # (Persist) Conversione post-run
shortcut_coins: int = 0          # (DEPREC) → rimuovere dopo refactor
growth_coins: int = 0            # (DEPREC) sostituito da growth
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
Pact:
pact_accepts: int = 0                  # (Persist) conteggio accettazioni
pact_decline_streak: int = 0           # (Persist) rifiuti consecutivi
pact_growth_penalty_mult: float = 1.0  # (Derivato) moltiplicatore growth prossimo Giorno1 run
pact_token_cap_removed: bool = false   # (Derivato) se true cap inventario disabilitato
pact_active: bool = false              # (Persist) flag stato attivo (se definito multi-day)
pact_monotony_spike_last: int = 0      # (Volatile) ultima applicazione per telemetria

# Cronologia patto per calcolo buff resolve
pact_runs_without: int = 0             # (Persist) run senza patto consecutive
```

### Sistema Burnout
```gdscript
# Pattern-day model
burnout_stage: int = 0                 # (Persist Giorno) 0/1/2
burnout_pattern_days: Array[int] = []  # (Persist breve) % puzzle giorni recenti (rolling window 3)
burnout_forced_rest_next: bool = false # (Derivato) giornata comfort forzata in arrivo
burnout_palette_cap_active: bool = false # (Derivato) se Stage1 limita palette tier
burnout_penalty_active: bool = false   # (Derivato) Stage2 penalità growth/time
```

### Tracking Eventi Monotonia
```gdscript
# Tracking cambi monotonia giornalieri
monotony_events_today: Array[Dictionary] = []
# Ogni entry: {event_type: String, monotony_change: float, slot: int}

# Tipi evento per monotonia (aggiornato):
# "skip_puzzle": +6
# "exit_after_fail": +4
# "pact_accepted": +15*N
# "forced_comfort_day": +10
# "comfort_overuse": +5 (seconda), +8 (terza)
# "hard_repeat_same_type": +2 stacking (max +6)
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
# Proprietà computata (nuova formula v0.1)
func get_depth()-> float:
    return growth + (fragments_bank * 0.5) + (mc * 0.3) - monotony - (pact_accepts * 8)

# Soglie vittoria/sconfitta
ROUTINE_LOCK_DEPTH: float = 0.0
SHORTCUT_RATIO_LOCK: float = 0.7  # (TODO valutare se mantenere shortcut ratio)
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

### Formule Scaling Patto (Aggiornate)
```gdscript
# Spike monotonia
func get_pact_monotony_spike()->int:
    return 15 * pact_accepts

# Penalità growth Giorno1 run successiva
func get_pact_growth_penalty_mult()->float:
    var penalty = 1.0 - min(0.45, 0.15 * pact_accepts)
    return penalty

# Decline streak benefit
func get_resolve_growth_bonus()->float:
    return 0.10 if pact_decline_streak >= 2 else 0.0

func has_resolve_fragment_bonus()->bool:
    return pact_decline_streak >= 3

func get_resolve_monotony_mitigation_mult()->float:
    # -5% gain cumulativo (cap -30%)
    var streak = max(0, pact_decline_streak - 3)
    return 1.0 - min(0.30, 0.05 * streak)
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
        "run_progress": {...},              # Persist
        "resources": {...},                 # Persist (exclude derivati: depth, palette_tier)
        "puzzle_progression": {...},        # Persist
        "token_system": {...},              # Persist
        "pact_system": {...},               # Persist
        "burnout_system": {...},            # Persist (exclude derivati flags)
        "monotony_tracking": {...},         # Persist (solo eventi se necessario compress)
        "palette_state": {...},             # Persist (solo per recovery hysteresis se diff)
        "accessories": {...}                # Persist
    }

func load_state(data: Dictionary):
    # Ripristina tutto lo stato dai dati save
    # Valida integrità dati
    # Gestisce migrazioni versione se necessario
```

## Dipendenze Configurazione
Il modello dati si collega ai file configurazione JSON:
- `palette.json`: Soglie palette e hysteresis
- `puzzles.json`: Parametri escalation tier
- `burnout.json`: Soglie pattern-day e penalità stage
- `progression.json`: Gating Hard per giorno (% limiti)
- `pact.json`: Coefficienti monotony spike, growth penalty, decline streak benefits
- `monotony.json`: Increments base eventi + caps
- `tokens.json`: Sequenza deterministica e cap base
- `economy.json`: Conversioni frammenti→MC e coefficienti Depth
- `accessories.json`: Effetti accessori e regole consegna

## Appendice: Classificazione Campi
| Campo | Persist | Derivato | Volatile Giorno | Note |
|-------|--------|---------|-----------------|------|
| growth | sì | no | no | |
| monotony | sì | no | no | |
| comfort | no | no | sì | Reset parziale |
| growth_score | sì | no | parz | Decay giornaliero |
| palette_tier | no | sì | n/a | Ricostruibile |
| fragments | sì | no | no | |
| fragments_bank | sì | no | no | Patto |
| mc | sì | no | no | |
| pact_accepts | sì | no | no | |
| pact_decline_streak | sì | no | no | |
| pact_growth_penalty_mult | no | sì | n/a | Calcolato runtime |
| burnout_stage | sì | no | giorno | Persist per feedback |
| burnout_pattern_days | sì | no | n/a | Rolling window |
| burnout_forced_rest_next | no | sì | n/a | |
| tokens_inventory | sì | no | no | |
| token_queue_index | sì | no | no | |
| depth | no | sì | n/a | Computato get_depth |
| hard_repeat_streak (per tipo) | sì | no | giorno | Per evento monotonia |
| monotony_events_today | opz | no | sì | Compressibile |

NOTE: Campi derivati NON salvati → ricostruiti all’avvio. Se in futuro servono migrazioni, aggiungere `schema_version` nel blocco root.