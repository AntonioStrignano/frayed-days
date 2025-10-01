# Archetipi Puzzle
Ogni puzzle restituisce un dict risultato: `{success, puzzle_type, growth_reward, fragment?, token?, hint_used}`.
Il livello di hint influenza il grado di assist (implementazione TBD per gli stub).

## Memory Sequence
- Parametri: sequence_length per tier.
- Fallimento: 2 errori -> fail.
- Hints: Tier1 rivela prime 2; Tier2 overlay fantasma.

## Association Match
- Matching coppie su piccola griglia.
- Hints: Tier1 mostra una coppia corretta; Tier2 riduce scelte.

## Timing Bar
- Indicatore mobile; premere dentro la finestra.
- Finestra si restringe con tier più alto.
- Hints: Tier1 mostra cambio velocità imminente; Tier2 allarga leggermente la finestra.

## Risk Choice (3 Cards)
- Seleziona una carta: range ricompensa growth; fallimento abbassa ricompensa ma resta parziale.
- Hints: Tier1 rivela una carta bassa; Tier2 rivela due carte (posizioni rimescolate dopo?).

## Emotion Interpretation
- Scegli etichetta che corrisponde a volto o scena astratta.
- Hints: Tier1 elimina una errata; Tier2 fornisce indizio semantico.

## Burnout Affliction
- Quando superata soglia, applica growth_reward * penalty_mult.
- Overlay visivo / effetto UI sottile.

## Future Scaling (Rimandato)
- Selezione tier adattiva usando streak di successi recente.
- Peso drop frammenti per tipo puzzle.
