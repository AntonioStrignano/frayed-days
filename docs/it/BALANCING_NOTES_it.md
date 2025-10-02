# Note di Bilanciamento
Formule numeriche aggiornate riflettendo overhaul design.

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

### Stage Burnout
**Trigger Slot-Based**:
- Stage 1: 6 puzzle consecutivi → Timer -10%, latenza +30ms
- Stage 2: 9 consecutivi → Stage 1 + ricompensa growth -15%
- Stage 3: 12 consecutivi → Giornata Comfort Forzata, monotonia +10

**Pattern Giornaliero**: 3 giorni ≥70% puzzle + 0 comfort → auto Stage 1 al Giorno 4

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
**Cap Inventario**: 4 token massimo
**Garantito**: 1 token per completamento puzzle (successo o fallimento)

## Formula Depth
`depth = growth - (monotony + debt)`

**Traiettoria Target**: Positiva entro run ~6
**Stati Fallimento**: depth < 0 OPPURE rapporto scorciatoie > 0.7

## Timing Escalation Tier
- **Easy → Medium**: 1 successo consecutivo
- **Medium → Hard**: 2 successi consecutivi in Medium
- **Regressione**: 2 fallimenti consecutivi retrocedono 1 tier
- **Reset Progressione**: Singolo fallimento resetta streak escalation

## Protezione Early Game
- **Giorni 1-2**: Nessun puzzle Hard disponibile
- **Prima Giorno 6**: Max 50% template puzzle Hard
- **Logica Gating**: Previene carico cognitivo schiacciante durante onboarding

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
