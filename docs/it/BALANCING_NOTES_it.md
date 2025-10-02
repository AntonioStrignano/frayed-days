# Note di Bilanciamento
Formule numeriche aggiornate riflettendo overhaul design.

## Snapshot v0.1 (Congelato per Scheletro)
Depth = Growth + (FragmentsBank * 0.5) + (MC * 0.3) − Monotony − (PactAccepts * 8)

Monotony Deltas:
- skip: +6
- fail_exit: +4
- hard_repeat_same_type: +2 stacking (max +6)
- comfort_overuse_2: +5
- comfort_overuse_3: +8
- forced_comfort_day: +10
- patto_accept: +15 * N
- reflection_first_day: -3 (cap -6/giorno)

GrowthScore:
- easy +1, medium +2, hard +4 (+1 bonus no skip ultimi 2 slot)
- fail + retry immediato: +0.5
- reflection→success stesso tipo: +1
- decay se nessuna reflection nel giorno: -2

Escalation Tier (aggiornata): Easy→Medium 2 successi; Medium→Hard 3 successi; 2 fail consecutivi stesso tier → retrocede; Easy non retrocede.

Gating Hard Giorni:
- Giorno 1: solo Easy
- Giorni 2–3: Easy + Medium
- Giorni 4–5: Hard abilitato (densità Hard ≤33%)
- Giorno ≥6: Hard densità ≤50%

Burnout Pattern-Day:
- Stage1: 2 giorni consecutivi puzzle_ratio ≥80% e comfort=0 → palette cap tier5
- Stage2: 3 giorni consecutivi puzzle_ratio ≥75% e comfort ≤1 → -15% Growth reward + timer -10%
- Rest Day: dopo Stage2 se persiste puzzle_ratio ≥70% → giorno forced (solo Comfort/Reflection) + Monotony +10 + reset
- Recupero: giorno <70% puzzle + (Comfort/Reflection ≥1) → stage -1

Token Cap Dinamico: base cap 4; Patto attivo cap infinito.

Patto:
- Spike monotony +15*N
- Growth penalty run successiva -15% * N (cap -45%)
- Fragment retention & conversion 2:1 (base 3:1)
- Decline chain: (2) +10% Growth primi 2 puzzle; (3) +1 frammento Hard; (≥4) -5% monotony gain cumulativo (cap -30%)

MC:
- Conversione frammenti base: 3:1
- Conversione sotto Patto: 2:1
- Coefficiente Depth: 0.3 (TUNING)

Evento monotonia nuovo: hard_repeat_same_type (+2 stacking max +6) se stesso puzzle Hard consecutivo ≥2.

Tutti i valori marcati possono essere ritoccati solo dopo telemetria iniziale (tag `TUNING`).

## Curve Placeholder (Macro Progression)
Queste curve sono provvisorie e soggette a validazione telemetria. Marcare cambi con commit `balance:` e aggiornare TODO corrispondente se finalizzate.

### Growth Totale Target (Cumulativo Giorni 1–12)
Valori % vs obiettivo finale (100 = soglia run finale growth).
```
Giorno:   1   2   3   4   5   6   7   8   9  10  11  12
Target%:  5  12  20  30  40  50  58  65  72  80  90 100
```
TODO_GROWTH_CURVE (se differisce post playtest)

### Monotonia Target (Accumulo Controllato)
```
Giorno:      1   2   3   4   5   6   7   8   9  10  11  12
Monotony≈:   5   9  14  18  21  24  26  28  31  33  36  <40
```
TODO_MONOTONY_CURVE

### Growth Score Target
```
Giorno:      1   2   3   4   5   6   7   8   9  10  11  12
GS≈:         4   8  12  15  19  23  26  30  36  42  46  50
```
TODO_GS_CURVE

### % Puzzle Hard per Segmento (Bands)
Segmenti (vincoli duri massimi, obiettivi preferiti tra parentesi):
- Days 1–2: 0% (0%)
- Days 3–5: ≤25% (15–20%)
- Days 6–8: ≤50% (35–45%)
- Days 9–12: ≤70% (55–65%)
Hard gating deve rispettare unlocking progressivo per archetipi.

TODO_FINAL_GROWTH_TARGET (percentuale giocatori che completano finale growth ≤X run)

## Formule Core

### Growth Score (Progressione Palette)
- **Successo Easy**: +1
- **Successo Medium**: +2
- **Successo Hard**: +4 (+1 bonus se nessun skip nei 2 slot precedenti)
- **Fallimento con retry immediato**: +0.5
- **Reflection seguita da successo (stesso tipo)**: +1
- **Decay giornaliero**: -2 se zero reflection eseguite

### Accumulo Monotonia (Skip-Driven)
**Aumenti**:
- Skip puzzle quando offerto: +6
- Uscita dopo fallimento senza retry: +4
- Accettazione patto: +15 × N (N = contatore patti)
- Giornata Comfort Forzata (burnout): +10
- Overuse comfort: seconda visita stesso giorno +5, terza +8

**Diminuzioni**:
- Sequenza supportata da reflection (2 puzzle entro 3 slot): -3 (cap -6/giorno)

**Cap Giornalieri**: Max +3 tier aumento (abuso), max -2 tier diminuzione (gioco positivo)

### Ricompense Tier Puzzle
**Moltiplicatori Growth Base**:
- Easy: 1.0 (GC = 0)
- Medium: 1.5 (GC = 1)
- Hard: 2.1 (GC = 1 + 20% chance frammento extra)

**Ricompensa Fallimento**: 0.35 × TierFactor (arrotondato giù) + accesso reflection

### Tier Palette (7-Tier Bipolare)
**Soglie Monotonia** (pressione verso il basso):
- 30 → Tier 3 (Smorzato)
- 45 → Tier 2 (Sbiadito Pesante)
- 60 → Tier 1 (Totalmente Desaturato)

**Soglie Growth Score** (pressione verso l'alto, richiede monotonia bassa):
- 20 → Tier 5 (Vivido Leggero)
- 40 → Tier 6 (Vivido Pieno)
- 60 → Tier 7 (Ipersaturo)

**Hysteresis**: 10 punti sotto soglia per risalire; crescita cala solo se GrowthScore < soglia-5 E nessun successo Hard oggi.

### Stage Burnout (Pattern-Day v2)
Sostituisce il puro slot streak per ridurre comportamento grind artificiale.
- Stage1 Trigger: 2 giorni consecutivi puzzle_ratio ≥80% e comfort=0 → palette cap tier5
- Stage2 Trigger: 3 giorni consecutivi puzzle_ratio ≥75% e comfort ≤1 → -15% Growth reward + timer -10%
- Rest Day Forzato: persistenza ≥70% puzzle dopo Stage2 → forzatura giorno solo Comfort/Reflection, Monotony +10, reset burnout.
- Recupero: giorno <70% puzzle e ≥1 Comfort/Reflection → stage -1.
*Nota:* Vecchi trigger slot 6/9/12 mantenuti come fallback (disabilitati di default).

### Scaling Patto (Punitivo)
**Penalità Accettazione**:
- Monotonia: +15 × N immediato
- Riduzione growth Giorno 1 prossima run: -10% × N (cap -40%)
- Offerte tentazione mentre monotonia >30: 1 comfort → 1 token (+5 monotonia se accettato)

**Benefici Rifiuto**:
- Streak rifiuto ≥2: +10% growth primi 2 puzzle/giorno
- Streak rifiuto ≥3: +1 frammento garantito primo Hard della run

### Sistema Token
**Sequenza Deterministica**: Focus → Foresight → Null Debt → Stabilizer → Filter Boost → WildSeed → (loop)
**Cap Inventario Base**: 4 token
**Patto Attivo**: cap infinito (nessuna perdita per overflow)
**Garantito**: 1 token per completamento puzzle (successo o fallimento)

## Formula Depth (v0.1)
`Depth = Growth + (FragmentsBank * 0.5) + (MC * 0.3) - Monotony - (PactAccepts * 8)`

**Traiettoria Target**: Depth positiva stabile entro run ~6
**Fail States**: Depth < 0 persistente OPPURE rapporto scorciatoie > 0.7
**Routine Lock**: fissato se entrambe le condizioni persistono 2 giorni consecutivi (TUNING) (TODO_FINAL_GROWTH_TARGET)

## Timing Escalation Tier (Aggiornato)
- Easy → Medium: 2 successi consecutivi
- Medium → Hard: 3 successi consecutivi
- Regressione: 2 fallimenti consecutivi retrocedono 1 tier (Hard→Medium / Medium→Easy)
- Reset: fallimento singolo resetta solo progress verso escalation

## Protezione Early Game (Gating Hard)
- Giorno 1: solo Easy
- Giorni 2–3: Easy + Medium
- Giorni 4–5: Hard ≤33% proposte
- Giorni ≥6: Hard ≤50% proposte
Motivazione: differire picco cognitivo preservando curva di mastery e variabilità.

## Economia Fragment
- **Drop Base**: Puzzle Hard 20% chance
- **Fonti Bonus**: Streak rifiuto patto ≥3 garantisce frammento su primo Hard
- **Uso**: Principalmente per acquisti shop e sblocchi speciali

## Parametri Tuning Aperti
- Sensibilità margine hysteresis (attualmente 10 punti)
- Tasso decay giornaliero Growth Score (attualmente -2)
- Velocità recovery stage burnout (TODO_BURNOUT_RECOVERY_MODEL)
- Frequenza offerte tentazione patto
- Scaling tasso drop fragment per numero run
