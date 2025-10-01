# frayed-days
**"Restare consuma quanto andare"**

Micro narrativa a loop di giornate: le scorciatoie ti danno tempo ora, ma consumano colore dopo.

## High Concept
Loop narrativo 2D (Godot 4) sul compromesso tra scorciatoie immediate (tempo risparmiato ora, monotonia futura) e crescita intenzionale (sforzo nei puzzle, ricompensa differita). In ~10–12 run il giocatore raggiunge una risoluzione di Crescita oppure cade nel blocco di Routine.

## Stato di Implementazione (Core Slice)
- Loop giornaliero: 6–9 slot variabili eseguiti da `DayController`.
- Categorie nodo: Shortcut / Challenge / Support / Comfort / Reflect / Shop (logica base dei delta in `NodeExecutor`).
- Risorse tracciate: growth, monotony, comfort, debt, shortcut_coins (SC), growth_coins (GC placeholder), fragments, tokens (effimeri), wildcard_points (post-run), accessories (in arrivo/posseduti).
- Puzzle: 6 archetipi finali (memory, association, timing, risk, resource balance, signal filter) instradati via `PuzzleManager` con risultati strutturati.
- Reflection / hint tiers: `ReflectionManager` incrementa i livelli di hint dopo fallimenti quando si sceglie un nodo di reflection.
- Burnout: contatore di successi consecutivi nelle challenge induce affliction (moltiplicatore penalizzante sulla ricompensa growth) da config.
- Degradation: calcolo tier tramite `DegradationManager` da monotony + rapporto di scorciatoie (thresholds centralizzati JSON).
- Shop: acquisti mettono in coda accessori consegnati il giorno successivo (`ShopManager`).
- Tokens: memorizzati; se inutilizzati convertono in wildcard points a fine run; penalità per pact di trasporto (`TokenManager`).
- Logging: strutturato per nodo, giorno, run (`Logger`).

## Depth & Condizioni di Fine
Depth = growth - (monotony + debt). Routine lock se depth < 0 OPPURE rapporto scorciatoie > 0.7. Logica finale Crescita non ancora implementata (placeholder).

## Mappa File (Script Chiave)
- `autoload/GameState.gd`: Stato run/giorno, cache config, start/end run/day.
- `managers/DayController.gd`: Sequenza slot giornalieri + ordine di aggiornamento challenge.
- `managers/NodeExecutor.gd`: Calcolo puro dei delta dei nodi.
- `managers/PuzzleManager.gd`: Dispatch + stub puzzle, ritorna `{success, puzzle_type, growth_reward, ...}`.
- `managers/ReflectionManager.gd`: Progressione livelli hint.
- `managers/DegradationManager.gd`: Calcola tier e indici palette/audio/testo.
- `managers/ShopManager.gd`: Coda acquisti gacha & consegna giorno dopo.
- `managers/TokenManager.gd`: Ciclo di vita tokens effimeri & pact.
- `managers/Logger.gd`: Accumulo eventi & flush JSON.

## Config Dati (JSON)
- `data/degradation_config.json`: Threshold monotony + ratio scorciatoie & strati presentazione.
- `data/node_pools.json`: Template base nodi (espandibile) & range slot.
- `data/accessories.json`: Definizioni box + effetti accessori placeholder.
- `data/puzzles_config.json`: Parametri tiers puzzle, burnout settings, hint costs.

## Ordine Aggiornamento Challenge (Forzato)
1. Decremento tempo
2. Esecuzione puzzle -> result dict
3. Computo delta (applica modificatori burnout)
4. Registrazione fallimento se miss
5. Opportunità reflection (costo / upgrade hint tier)
6. Logging (evento nodo)

## Estendibilità
Nuovo puzzle: aggiungi sezione archetype nel JSON e estendi il match in `PuzzleManager.run_puzzle`. Mantieni stabile la struttura del result dict. Evita di duplicare thresholds: usa JSON + manager centrali.

## Esecuzione (Scheletro Dev)
Imposta questi script come autoload in Godot (Project Settings -> AutoLoad):
- `autoload/GameState.gd` come `GameState`.
- Opzionalmente una scena che istanzia: `DayController`, `NodeExecutor`, `PuzzleManager`, `ReflectionManager`, `DegradationManager`, `ShopManager`, `TokenManager`, `Logger` e chiama `inject_dependencies` su `DayController`.
Simula manualmente la progressione dei nodi chiamando `DayController.process_next(node_dict)` con voci modellate come in `data/node_pools.json` più un campo `category`.

Esempio pseudo-sequenza (in uno script di test):
```gdscript
var pools = JSON.parse_string(FileAccess.open("res://data/node_pools.json", FileAccess.READ).get_as_text())
var base_challenge = pools.base_pool.challenge[0]
base_challenge.category = "challenge"
DayController.process_next(base_challenge)
```

## Bilanciamento & Documenti Design
Vedi cartella `docs/`:
- `PUZZLES.md` note archetipi puzzle
- `BALANCING_NOTES.md` target numerici iniziali
- `IDEAS.md` backlog idee (scope guard)
- `TODO_BACKLOG.md` miglioramenti / tech debt
- `OPEN_QUESTIONS.md` decisioni aperte
- `ARCHITECTURE.md` overview estesa

## Prossimi Passi (Pianificati)
- Implementare scene puzzle interattive reali al posto degli stub RNG.
- Pass di feedback visivo/audio degradazione (palette & varianti testo).
- Applicazione effetti accessori nella pipeline dei delta (moltiplicatori growth, modificatori monotony).
- Trigger giorno di comfort forzato se burnout persiste oltre soglia.
- Logica rami finali basata su depth + superfici narrative.
- Persistenza su disco (serializzare `GameState.save_state()`).

## Guardrail Anti-Scope Creep
Se una proposta introduce: nuovo tipo di risorsa, loop di combattimento, fisica complessa o contenuto procedurale—respingere o ridimensionare prima.

## License / Credits
(TBD) Definire licenza prima della distribuzione contenuti.
