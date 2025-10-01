# Documento Design - Frayed Days

## Tagline
**"Restare consuma quanto andare"**

## High Concept
Loop narrativo 2D (Godot 4) che esplora la tensione tra scorciatoie immediate (tempo risparmiato ora, costo monotonia futuro) e crescita deliberata (sforzo puzzle, ricompensa differita). In ~10-12 run, i giocatori raggiungono una risoluzione di Crescita o cadono nel blocco di Routine.

## Meccaniche Core

### Progressione Puzzle (6 Archetipi Finali)

**Puzzle Selezionati** (coprono percezione, semantica, riflessi, rischio, manipolazione risorse, filtraggio):
1. **Memory** (Sequenza) - Richiamo pattern visivo
2. **Association** (Semantica) - Matching concetti
3. **Timing** (Barra) - Sfide di timing di precisione
4. **Risk** (Carte) - Valutazione rischio e scelta
5. **Resource Balance** (Slider Interdipendenti) - Ottimizzazione multi-variabile
6. **Signal Filter** (Filtraggio Rumore) - Rilevamento segnale nel rumore

**Rimossi**: Emotion (sovrapposizione con Association nel carico linguistico), Odd-One-Out (ridondanza logica).

### Tier Difficoltà & Escalation

**Progressione Tier**: Easy → Medium → Hard

**Regole Escalation**:
- Easy → Medium: 1 successo consecutivo
- Medium → Hard: 2 successi consecutivi in Medium

**Fallimento & Regressione**:
- Singolo fallimento non altera tier (solo resetta streak verso tier superiore)
- Due fallimenti consecutivi nello stesso tier retrocedono di 1 tier (Hard→Medium, Medium→Easy)
- Easy non retrocede sotto
- Reset progresso medium: ogni fallimento in Medium resetta contatore verso Hard

**Moltiplicatori Ricompensa Base** (fattore Growth):
- Easy: 1.0 (GC = 0)
- Medium: 1.5 (GC = 1)
- Hard: 2.1 (GC = 1 + 20% chance frammento extra)

**Ricompensa Fallimento**: Growth Residua = 0.35 × TierFactor (arrotondato giù), abilita reflection (accesso hint).

### Sistema Monotonia (Logica Rivista)

**La monotonia NON aumenta sul fallimento puzzle.**

**La monotonia aumenta su**:
- Skipping (non entrare nel puzzle quando offerto): +6
- Rifiuto retry immediato dopo fallimento (uscita frame senza reattempt): +4
- Uso eccessivo comfort consecutivo: seconda visita stesso giorno +5, terza +8
- Accettazione Patto: +15 × N (N = numero iterazioni)
- Giornata Comfort Forzata (conseguenza burnout): +10

**La monotonia diminuisce su**:
- Sequenza riuscita di 2 puzzle con reflection applicata entro 3 slot: -3 (cap -6/giorno)
- Giorno con ≥1 Hard completato e ≤1 skip

**Capping Giornaliero**: Non più di 2 tier di riduzione al giorno; massimo 3 tier di aumento se pattern abuso (skip+patto+burnout).

### Palette / Stato Visivo (7-Tier Bipolare)

**Direzione**: 1 = Monotonia Estrema (B/W), 4 = Neutro, 7 = Crescita Estrema (vivido)

**Tier** (nomi interni):
1. **Totalmente Desaturato** (monocromatico, testo amputato)
2. **Sbiadito Pesante**
3. **Smorzato**
4. **Neutro**
5. **Vivido Leggero**
6. **Vivido Pieno**
7. **Ipersaturo** (accenti pulsanti minimi + layer audio extra sottile)

**Logica Transizione**:
- Monotonia > soglia spinge verso 1
- Depth positiva stabilizzata + successi Hard spingono verso 7

**Soglie** (parametri iniziali):
- **Spinta monotonia giù**: 30 (→3), 45 (→2), 60 (→1)
- **Spinta crescita su** (richiede monotonia < corrispondente): GrowthScore 20 (→5), 40 (→6), 60 (→7)

**Hysteresis**: Deve calare monotonia 10 punti sotto soglia per risalire; crescita cala solo se GrowthScore < soglia-5 E mancano successi Hard nel giorno.

**Velocità Transizione**: Mai saltare più di 1 tier per evento (progressione smooth).

### Sistema Burnout (Multi-Stage)

**Tracking**: Basato su slot (non giorni interi) e pattern giornalieri.

**Stage**:
- **Stage 1**: 6 puzzle consecutivi (no Support/Comfort) → Timer -10%, latenza input +30ms, layer audio "respiro"
- **Stage 2**: 9 consecutivi → malus Stage 1 + riduzione ricompensa growth -15%
- **Stage 3 Trigger**: 12 consecutivi → Giornata Comfort Forzata (solo reflection e comfort), monotonia +10

**Burnout Pattern Giornaliero**: 3 giorni consecutivi con ≥70% slot puzzle e 0 nodi comfort → auto Stage 1 all'inizio Giorno 4.

**Reset Stage**: Ogni consumo efficace Comfort o Reflect -1 stage (minimo 0).

### Sistema Token (Deterministico)

**Regola Token Garantito**: Ogni puzzle completato (successo o fallimento) assegna 1 token baseline dalla sequenza deterministica:
**Focus → Foresight → Null Debt → Stabilizer → Filter Boost → WildSeed → (loop)**

**WildSeed**: Scegli uno dei token precedenti e applica immediatamente.

**Limiti**:
- Max 4 token non spesi alla volta (raccolgi nuovo → devi consumarne uno prima)
- Il Patto influenza solo token non spesi

### Sistema Patto (Estremamente Punitivo)

**Trigger Offerta**: Fine run se possiedi ≥2 token non spesi OPPURE Depth < soglia Crescita.

**Se Accetti** (Patto N, N = volte accettato):
- Conservi fino a 3 token (a tua scelta)
- Monotonia +15 × N immediato
- Riduce ricompense growth puzzle Giorno 1 prossima run: -10% × N (cap -40%)
- Aggiunge overlay "Tentazione": inizio ogni giorno finché monotonia >30, offre scambio 1 comfort → 1 token extra (accettare aumenta monotonia +5)

**Se Rifiuti** (Streak decline D):
- Dalla seconda rifiutata consecutiva, ottieni buff "Resolve": +10% growth sui primi 2 puzzle/giorno
- D≥3: +1 frammento garantito primo Hard della run
- Rifiutare resetta eventuali penalità growth da patti precedenti dopo 2 run senza patto

**Intento Design**: Il Patto dovrebbe apparire appetibile solo se il giocatore è a corto di hint/token per bridging ma già incamminato verso stato sterile—centrato su scelta consapevole.

### Growth Score (Per Progressione Palette)

**Accumulo Growth Score**:
- Successo Easy: +1
- Successo Medium: +2
- Successo Hard: +4 (+1 extra se nessun skip nei 2 slot precedenti)
- Fallimento con retry immediato: +0.5
- Reflection attiva seguita da successo stesso tipo: +1

**Decay Giornaliero**: -2 a fine giorno se zero reflection eseguite.

### Reflection & Hint

**Tracking Fallimenti**: Ogni fallimento marca puzzle_type_failed += 1

**Incentivo Retry**: Rientrare nel puzzle immediatamente dopo fallimento non genera costo monotonia

**Tier Hint**:
- **Hint1**: Richiede ≥1 fallimento e reflection
- **Hint2**: Richiede ≥2 fallimenti totali e seconda reflection
- **Limitazione**: Riflettere su puzzle già a Hard+Hint2 non produce benefici extra (previene farming)

## Economia Risorse

### Risorse Core
- **Growth**: Valuta progressione primaria
- **Monotonia**: Accumulatore attrito/degradazione
- **Comfort**: Speso su reflection e recovery
- **Debt**: Placeholder erosione
- **Fragments**: Drop rari puzzle
- **Tokens**: Ricompense ciclo deterministico
- **Growth Score**: Metrica progressione palette
- **Wildcard Points**: Valuta conversione post-run

### Formula Depth
`depth = growth - (monotony + debt)`

**Condizione Vittoria**: Depth tendente positivo entro run ~6
**Condizione Sconfitta**: Depth < 0 OPPURE rapporto pattern scorciatoie > 0.7

## Stati Finali

**Finale Crescita**: Raggiunto tramite depth positivo consistente e pattern di gioco diversificati
**Blocco Routine**: Innescato da monotonia eccessiva o dipendenza scorciatoie, blocca progressione ulteriore

## Pilastri Design

1. **Gestione Tensione**: Ogni scelta ha beneficio immediato e costo differito
2. **Riflessione Comportamentale**: Il sistema risponde ai pattern di gioco, non solo ai risultati
3. **Recovery Significativo**: Il fallimento fornisce percorsi di miglioramento, non solo penalità
4. **Coesione Visiva**: Monotonia e crescita si manifestano direttamente nel layer di presentazione
5. **Equità Deterministica**: Le ricompense core seguono regole prevedibili mantenendo impatto emotivo