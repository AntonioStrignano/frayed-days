# Archetipi Puzzle
Ogni puzzle restituisce un dict risultato: `{success, puzzle_type, growth_reward, fragment?, token, hint_used}`.
Ogni puzzle completato (successo o fallimento) assegna 1 token dalla sequenza deterministica.

## 6 Archetipi Finali Selezionati
Coprono percezione, semantica, riflessi, rischio, manipolazione risorse e filtraggio:

### 1. Memory (Sequenza)
**Concetto**: Richiamo pattern sotto pressione temporale
- **Easy**: 4 simboli, mostrati 1.8s, nessun rumore
- **Medium**: 6 simboli, 1.2s, 1 simbolo fantasma
- **Hard**: 8-9 simboli, 0.9s, 2 fantasmi + mescolamento post-nascondimento
- **Hint1**: L'ultimo simbolo rimane semi-opaco 0.4s extra
- **Hint2**: Mostra mappa posizioni (griglia fade) prima del nascondimento

### 2. Association (Semantica)
**Concetto**: Matching coppie concetto/parola con distrattori
- **Easy**: 3 coppie, 1 distrattore
- **Medium**: 4 coppie, 2 distrattori sinonimici
- **Hard**: 5 coppie, 3 distrattori semanticamente vicini
- **Hint1**: Evidenzia un distrattore (grigio)
- **Hint2**: Auto-blocca una coppia corretta

### 3. Timing (Barra)
**Concetto**: Timing di precisione con bersaglio mobile
- **Easy**: Finestra 18%, velocità lineare
- **Medium**: Finestra 10%, accelerazione curva
- **Hard**: Finestra 6%, jitter ± casuale, micro ritardo input 50ms
- **Hint1**: Finestra +2%
- **Hint2**: Rallenta ultimi 0.4s

### 4. Risk (Carte)
**Concetto**: Valutazione rischio con informazioni parziali
- **Easy**: 3 carte visibilità parziale (range ricompensa mostrato)
- **Medium**: 1 carta copre penalità alta, hint ridotti
- **Hard**: Introduce carta Bluff (flip invertito), spread estremo ricompensa + penalità
- **Hint1**: Rivela se esiste penalità severa
- **Hint2**: Mostra range numerico approssimato (±25%) su due carte

### 5. Resource Balance (Slider Interdipendenti)
**Concetto**: Ottimizzazione multi-variabile sotto pressione temporale
- **Easy**: 3 slider indipendenti, zona target 20%, timer 25s
- **Medium**: 3 slider interblocco (muoverne uno sposta gli altri +10%), target 15%, 20s
- **Hard**: Interblocco + deriva passiva (slider tornano lentamente), target 10%, 18s
- **Hint1**: Evidenzia prossimo slider da regolare
- **Hint2**: Immobilizza deriva per primi 8s

### 6. Signal Filter (Rilevamento Rumore)
**Concetto**: Rilevamento target in flusso di segnale rumoroso
- **Easy**: Flusso 12 simboli, 3 target, rapporto rumore 40%
- **Medium**: 18 simboli, 5 target, rumore 55%, 1 falso positivo
- **Hard**: 24 simboli, 7 target, rumore 65%, 2 falsi positivi dinamici (cambio colore tardivo)
- **Hint1**: Bordi target con bagliore sottile
- **Hint2**: Rimuove 25% rumore casuale (non-target) all'inizio

## Sistema Progressione Difficoltà

### Escalation Tier
- **Easy → Medium**: 1 successo consecutivo
- **Medium → Hard**: 2 successi consecutivi in Medium

### Regressione Tier
- **Singolo fallimento**: Non altera tier (resetta streak verso tier superiore)
- **Due fallimenti consecutivi**: Retrocede di 1 tier
  - Hard → Medium
  - Medium → Easy
  - Easy: Nessuna retrocessione sotto
- **Regola reset Medium**: Ogni fallimento in Medium resetta contatore progresso verso Hard

### Struttura Ricompense
**Moltiplicatori Growth Base**:
- Easy: 1.0 (GC = 0)
- Medium: 1.5 (GC = 1)
- Hard: 2.1 (GC = 1 + 20% chance frammento extra)

**Ricompensa Fallimento**: Growth Residua = 0.35 × TierFactor (arrotondato giù)
- Abilita accesso reflection (progressione hint)
- Fornisce progressione significativa anche su fallimento

### Sistema Reflection & Hint
**Tracking Fallimenti**: Ogni fallimento incrementa contatore puzzle_type_failed

**Requisiti Tier Hint**:
- **Hint1**: ≥1 fallimento + reflection eseguita
- **Hint2**: ≥2 fallimenti totali + seconda reflection eseguita

**Anti-Farming**: Riflettere su puzzle già a Hard+Hint2 non produce benefici extra

**Incentivo Retry**: Rientrare nel puzzle immediatamente dopo fallimento non genera costo monotonia

## Integrazione Token
**Token Garantito**: Ogni completamento puzzle (indipendentemente dall'esito) fornisce 1 token dalla sequenza deterministica:
Focus → Foresight → Null Debt → Stabilizer → Filter Boost → WildSeed → (loop)

**Limite Inventario**: Max 4 token non spesi (devi consumare prima di raccogliere nuovo)

## Archetipi Rimossi
- **Emotion Interpretation**: Sovrapposizione con Association nel carico linguistico
- **Odd-One-Out**: Ridondanza logica con riconoscimento pattern esistente

## Priorità Implementazione
**Focus Fase A**: Memory, Timing, Risk (richieste cognitive diverse)
**Estensione Fase B**: Association, Resource Balance, Signal Filter
