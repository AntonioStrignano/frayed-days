# Sistema Progressione & Gating

## Sintesi Condizioni Fine Run
Condizioni mutuamente esclusive (valutate end-day):
- Finale Growth: day_index == 12 AND growth_total > monotony AND (depth ≥ 400 opzionale) → finale crescita.
- Monotony Lock: day_index ≥ 15 AND monotony_lock_flag true (monotonia eccessiva / depth <0 persistente) → finale routine.
- Continua: nessuna delle precedenti → avanza giorno.
TODO_FINAL_GROWTH_TARGET (percentuale giocatori che raggiungono finale growth ≤ X run)

Limiti strutturali:
- Puzzle totali run target: 4 puzzle/giorno * 12 ≈ 48 (CAP assoluto 54). Oltre implica runaway pacing.
- Soglia depth obiettivo finale: depth ≥400 suggerita (tuning post telemetria).

## Filosofia Progressione Core
I giocatori avanzano attraverso i tier di difficoltà puzzle basandosi sulla competenza dimostrata, con protezione early-game contro picchi di sfida schiaccianti e percorsi di escalation a lungo termine per engagement sostenuto.

## Regole Gating Difficoltà

### Protezione Early Game
**Restrizione Giorni 1-2**: Nessun puzzle tier Hard disponibile
- Previene carico cognitivo schiacciante durante onboarding
- Permette costruzione familiarità con meccaniche base
- Assicura tempo adeguato per apprendimento sistema comfort/reflection

**Limitazione Pre-Giorno 6**: Massimo 50% template puzzle Hard prima del Giorno 6
- Introduzione graduale difficoltà di picco
- Mantiene accessibilità durante progressione iniziale
- Bilancia sfida con curva apprendimento

### Logica Distribuzione Template
```gdscript
func can_offer_hard_puzzle(current_day: int, hard_puzzles_today: int, total_puzzles_today: int) -> bool:
    # Restrizione assoluta Giorni 1-2
    if current_day <= 2:
        return false

    # Cap percentuale prima Giorno 6
    if current_day < 6:
        var hard_percentage = float(hard_puzzles_today) / float(total_puzzles_today)
        return hard_percentage < 0.5

    # Nessuna restrizione Giorno 6+
    return true
```

## Sistema Escalation Tier

### Progressione Basata su Successo
**Easy → Medium**: 1 successo consecutivo
- Barriera bassa per sfida intermedia
- Ricompensa dimostrazione competenza iniziale
- Loop feedback veloce per engagement

**Medium → Hard**: 2 successi consecutivi in Medium
- Barra più alta per accesso difficoltà di picco
- Assicura performance intermedia consistente
- Previene picchi difficoltà prematuri

### Regressione Basata su Fallimento
**Trigger Regressione**:
- Due fallimenti consecutivi nello stesso tier
- Hard → Medium → Easy (ferma a Easy)
- Singoli fallimenti resettano streak escalation ma non retrocedono

**Meccaniche Reset**:
- Qualsiasi fallimento in Medium resetta contatore progresso verso Hard
- Preserva tier corrente ma previene avanzamento prematuro
- Mantiene livello sfida costruendo consistenza

## Considerazioni Progressione Cross-Run

### Continuità Cross-Run
**Persistenza Tier**: I tier puzzle si portano attraverso run nella stessa sessione
- Mantiene investimento progressione
- Previene grinding ripetitivo early-game
- Supporta sviluppo skill a lungo termine

**Trigger Reset**:
- Nuova sessione gioco resetta a tier baseline Easy
- Aggiornamenti major version possono resettare progressione
- Opzione reset player-initiated disponibile

### Gating Basato su Depth
**Requisiti Traiettoria Growth**:
- Completamento run riuscito richiede trend depth positivo
- Accesso puzzle Hard può considerare performance run complessiva
- Routine lock previene progressione se dipendenza scorciatoie >70%

## Integrazione Sistema Hint

### Pipeline Fallimento-a-Hint
**Hint Tier 1**: Sbloccato dopo ≥1 fallimento + reflection
- Fornisce assistenza gentile senza banalizzare sfida
- Incoraggia uso meccanica reflection
- Mantiene integrità puzzle

**Hint Tier 2**: Sbloccato dopo ≥2 fallimenti totali + seconda reflection
- Assistenza più sostanziale per lotte persistenti
- Previene loop fallimento infiniti
- Bilancia accessibilità con soddisfazione achievement

### Protezione Anti-Farming
**Rendimenti Decrescenti**:
- Riflettere su puzzle Hard+Hint2 non fornisce benefici aggiuntivi
- Previene farming tier hint per sfruttamento risorse
- Mantiene gate progressione significativi

## Integrazione Token con Progressione

### Regola Token Garantito
### Regole Gating Difficoltà (Aggiornate v0.1)
**Focus → Foresight → Null Debt → Stabilizer → Filter Boost → WildSeed → (loop)**

### Protezione Early Game & Percentuali Hard
**Giorni 1-2**: Nessun Hard (solo Easy)
**Giorni 2-3**: Easy + Medium (0% Hard)
**Giorni 4-5**: Hard consentiti ma ≤33% degli slot puzzle del giorno
**Giorno ≥6**: Hard ≤50% degli slot puzzle (cap progressivo)

Razionale: introduzione graduale evitando saturazione cognitiva e mantenendo un “ramp” riconoscibile.
- Streak rifiuto ricompensano persistenza attraverso difficoltà

## Gating Monotonia-Driven
func can_offer_hard_puzzle(current_day: int, hard_puzzles_today: int, total_puzzles_today: int) -> bool:
    if current_day <= 3:
        return false
    var hard_percentage = float(hard_puzzles_today) / max(1.0, float(total_puzzles_today))
    if current_day <= 5:
        return hard_percentage < 0.33
    return hard_percentage < 0.50

### Percorsi Recovery
## Sistema Escalation Tier (Aggiornato v0.1)
- Sequenze successo supportate da reflection: -3 monotonia (cap -6/giorno)
- Completamento puzzle Hard con skip minimi
**Easy → Medium**: 2 successi consecutivi (maggiore stabilità prima del salto)
**Medium → Hard**: 3 successi consecutivi (riduce accesso prematuro Hard)
**Razionale**: rallentare la scalata iniziale offre finestra di adattamento e produce distribuzione Hard più controllata nei primi giorni run.
### Run 4-7: Sviluppo Competenza
- Accesso regolare tier Hard
- Apprendimento gestione burnout
**Trigger Regressione**:
- Due fallimenti consecutivi nello stesso tier → retrocede di 1
- Easy non retrocede
- Singolo fallimento azzera solo la streak di salita
- Mantenimento depth positivo consistente
- Achievement tier palette avanzati
- Approccio risoluzione Growth vs. Routine

## Note Implementazione

### Requisiti Tracking Dati
```gdscript
# Track per decisioni gating
consecutive_successes_per_tier: Dictionary
days_since_first_hard: int
hard_puzzle_count_today: int
total_puzzle_count_today: int
```

### Integrazione Configurazione
Regole progressione si collegano a:
- `puzzles_config.json`: Soglie sblocco tier
- `node_pools.json`: Disponibilità template per giorno
- `degradation_config.json`: Impatto monotonia su accessibilità

### Considerazioni Bilanciamento
- Tensione protezione early vs. agency player
- Calibrazione ripidità curva difficoltà
- Decisioni persistenza progressione cross-run
- Bilanciamento anti-frustrazione vs. soddisfazione achievement

## Cross-Link
Vedi anche:
- `BALANCING_NOTES_it.md` per curve macro e % Hard
- `ECONOMIA_it.md` per reward differite
- `SPEC_CORE_LOOP_it.md` per sequenza macro e condizioni finali