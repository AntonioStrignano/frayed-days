# Panoramica Architettura

## Core Autoload
`GameState.gd` contiene tutto lo stato mutabile di run/giorno e cache config. Fornisce start/end run/day, applicazione delta, stub persistenza.

## Flow Controllers
- `DayController.gd`: Orquestra gli slot giornalieri, esegue nodi via `NodeExecutor`, gestisce l'ordine challenge e attiva logging.

## Componenti Pure / Logiche
- `NodeExecutor.gd`: Calcola i delta risultato per categoria nodo.
- `ReflectionManager.gd`: Potenzia hint tiers basandosi sui fallimenti quando scelta reflection.
- `DegradationManager.gd`: Calcola tier visivo/audio/testo da monotony & ratio scorciatoie.
- `ShopManager.gd`: Mette in coda acquisti box; consegna accessori il giorno dopo.
- `TokenManager.gd`: Gestisce tokens effimeri, penalità pact carry, conversione wildcard.
- `PuzzleManager.gd`: Dispatch verso scene/stub dei puzzle.
- `Logger.gd`: Colleziona eventi strutturati; può salvare JSON per analisi.

## Dati (Guidati da JSON)
- `degradation_config.json`: Tiers e layer presentazione.
- `node_pools.json`: Template nodi e conteggi.
- `accessories.json`: Box gacha & effetti accessori (non ancora applicati del tutto).
- `puzzles_config.json`: Parametri tiers puzzle, burnout settings, hint costs.

## Ordine Aggiornamento (Challenge Node)
1. Decremento tempo
2. Esecuzione puzzle
3. Delta calcolati (adjust burnout)
4. Registrazione fallimento
5. Opportunità reflection (se scelta)
6. Logging

## Punti di Estensione
- Nuovo archetipo puzzle: estendere match in `PuzzleManager.run_puzzle` e JSON config.
- Applicazione effetti accessori: creare resolver nella pipeline delta (TODO backlog).
- Salvataggio persistente: implementare serializzazione usando `GameState.save_state()`.

## Applicazione Degradazione (Layer Visivi Futuri)
`DegradationManager.compute_tier` usato dalla UI per adattare palette/audio/ricchezza testo. Threshold centrali evitano duplicazioni.

## Terminazione Run
Depth calcolata in `GameState.end_run()`. Routine lock se depth <0 o shortcut pattern ratio >0.7.

## Non-Obiettivi (Per Specifica)
Combattimento, fisica complessa, AI pathfinding, inventari, skill tree (placeholder), generazione procedurale.
