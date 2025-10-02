# Economia di Gioco (MVP / Vertical Slice)

Obiettivo: definire flussi minimi di valute e risorse per sostenere motivazione, pacing e decisioni micro senza introdurre inflazione o complessità prematura.

> Linea guida: ogni nuova valuta deve avere (a) fonte chiara, (b) sink significativo, (c) ruolo distinto non replicabile da un'altra. In assenza → rimuovere.

## 1. Elenco Valute / Risorse
| Codice | Nome | Tipo | Stato Persistente | Ruolo Primario | NOTE |
|--------|------|------|-------------------|----------------|------|
| GC | Growth Coin | Soft Currency | Run (giorno→giorno) | Sblocco skill / meta | Consegna differita end-day |
| MC | Monotony Coin | (Soft?) Currency Ibrida | Run | Contrappeso / gating (DA CHIARIRE) | POTENZIA monotony decisions (TODO_DEFINE_MC_ROLE) |
| TOKF | Token Fittizi | Risorsa Temporanea | Giorno (parziale) | Convertibili in MC / micro scelte | Nome provvisorio (rename) |
| MONO | Monotony | Stato (scalare) | Run | Pressione / rischio lock | Non è valuta spendibile |
| COMF | Comfort | Risorsa Consumo | Giorno | Alimenta Reflection / hint | Buffer recupero cognitivo |
| FRAG | Fragment | Collezionabile Raro | Run (limit) | Milestone / gating extra | Pity dopo 4 Hard chain |
| TOK# | Token (6 tipi) | Carica Attiva | Run (inventario) | Potenziamenti puzzle deterministic cycle | Non scambiabili |

## 2. Differenziazione Sintetica
- GC = progresso deliberato (output puzzle) → alimenta skill tree.
- MC = eco delle scelte orientate alla monotonia / scorciatoie (ibrido). Se il ruolo non si distingue nettamente entro VS → rimuoverla.
- TOKF = ponte decisionale → conversione ponderata vs accumulo eccesso.
- COMF = attrito speso per ottenere conoscenza (hint) e ridurre marginalmente monotonia.
- MONO = spinta negativa sistemica; non può essere spesa, solo mitigata indirettamente.
- FRAG = progress marker scarso, evita saturazione GC.

## 3. Fonti & Sink
### 3.1 Schema Flussi (ASCII)
```
Puzzle Success --> (growth_raw) --> GC (differita end-day)
Puzzle Success (Medium/Hard) --> TOKF --> Conversione --> MC
Skip/Patto/OverComfort --> MONO ↑
Reflection --> COMF ↓ e (potenziale) MONO ↓
Hard Success Chain --> FRAG ↑
Token Cycle Avanzamento --> TOK# Generati (ordine deterministico)
```

### 3.2 Fonti Dettaglio
| Risorsa | Fonti | Quantità Placeholder | Note |
|---------|-------|----------------------|------|
| GC | growth_raw convertito a fine giornata (scalato) | (E 10 / M 15 / H 20) → differita | Delivery differita consente tuning retention |
| MC | Conversione TOKF (ratio) | 2 TOKF → 1 MC (cap 6/giorno) | TODO_RATIO_TARGET se riequilibrio |
| TOKF | Success Medium+, Hard Fail | 1 per evento | Nome definitivo TBD (TODO_TOKEN_FONTS) |
| COMF | Nodo Comfort, successi puzzle (piccola quota) | Comfort node +X, puzzle +1 (cap giornaliero) | Evitare hoarding infinito |
| FRAG | Hard success (20%) + pity chain | 0.2 chance / chain definita | Cap 4 VS |
| TOK# | Avanzamento sequenza deterministica | 1 step per puzzle completato (fail incluso) | Coda ciclica (6) |

### 3.3 Sink Dettaglio
| Risorsa | Sink | Costo Placeholder | Note |
|---------|------|-------------------|------|
| GC | Skill unlock | 6 / 12 / 18 | Tier scaling semplice iniziale |
| MC | Skill gating alternativa / trade (??) | TBD | Se non chiaro → rimuovere (TODO_DEFINE_MC_ROLE) |
| TOKF | Conversione in MC | 2:1 | Altrimenti scarto a fine giorno |
| COMF | Reflection (hint1/hint2) | 2 / 3 | Monotony -3 reflection valida (max2) |
| MONO | (Indiretto) Reflection / gating palette | — | Non un sink esplicito |
| FRAG | (Nessuno nel VS) | — | Solo conteggio milestone |
| TOK# | Consumo on use (effetto puzzle) | 1 | Si rigenerano via ciclo |

## 4. Sequenza Token Deterministica
Ordine base ciclico (cap inventario 4):
1. focus
2. foresight
3. null_debt
4. stabilizer
5. filter_boost
6. wildseed

Regole:
- Avanzamento: ogni puzzle completato (success o fail) incrementa `token_queue_index`.
- Se token dello slot già posseduto e inventario <4 → aggiungi. Se pieno → scarta (telemetry `token_discard` se implementato future).
- No randomizzazione (design anticipazione strategica).

## 5. Formule Placeholder
| Concetto | Formula / Regola | TODO |
|----------|------------------|------|
| growth_raw (success) | Easy 10 / Medium 15 / Hard 20 | Bilanciamento dinamico dopo telemetria |
| growth_raw (failure) | floor(success_value * 0.35) | Confermato (E3/M5/H7) |
| growth_score | +1/+2/+4 (E/M/H success) | TODO_GS_CURVE per macro pacing |
| monotony_increment | skip=+X, patto=+15*iter, burnout_stage3 day comfort=+Y | TODO_MONOTONY_CURVE |
| monotony_reflection_reduction | −3 (max 2/giorno conteggiati) | Regola smoothing |
| token_conversion_rate | TOKF:MC = 2:1 | TODO_RATIO_TARGET se cambia |
| depth | growth_total − monotony | Soglia finale depth ≥400 |

## 6. Metriche Pacing Chiave
| Metrica | Target Iniziale | Uso |
|---------|-----------------|-----|
| GC medio / giorno | 40–55 | Progressione skill percepita costante |
| MC medio / giorno | 0–6 (se rimane) | Se piatto o inutile → rimuovere |
| Frammenti run VS | 2–3 | Rara ma presente |
| Token overflow scartati | <5% generazioni | Se >15% → rivedi cap o ordine |
| Comfort speso / generato | 70–85% | Evitare stockpiling |

## 7. Scenari Edge / Rischi
| Rischio | Segnale | Mitigazione |
|---------|---------|-------------|
| MC ridondante | Telemetry: utilizzo 0 skill MC | Tagliare entro VS |
| Token perceived RNG | Feedback utenti / forum tester | UI preview prossimi 2 token |
| Frammenti troppo rari | <1 medio/run test | Aumentare pity early |
| Comfort hoard | stock finale >70% giornaliero | Aumentare costi hint |
| Growth plateau | RMSE >15% curva target | Ritoccare base growth_raw |

## 8. Dipendenze Altri Sistemi
- Skill Tree (non completo in VS) → definisce sink GC.
- Telemetria (`puzzle_result`, `token_use`, `day_end`, `run_end`) → validazione flussi.
- Palette / Monotony: gating soft percezione progressione visiva.
- Pact & Burnout: modificano crescita effettiva (moltiplicatori, monotony spikes).

## 9. Telemetria Necessaria (Cross-Ref)
Eventi usati per analisi economia:
| Obiettivo | Eventi |
|-----------|--------|
| Conversion rate TOKF→MC | `day_end` (aggiungere campi se necessario) |
| Distribuzione growth_raw | `puzzle_result` |
| Comfort utilizzo vs generato | `reflection_use`, `day_end` |
| Token overflow | (futuro) `token_discard` (NON VS) |
| Frammenti ottenuti | `puzzle_result` (reward_fragment) + `day_end` |

## 10. Aperture / TODO
- TODO_DEFINE_MC_ROLE (hard deadline prima freeze VS) → se non distinto tagliare MC e TOKF redenominare → "Focus Shard" (solo conversione comfort?).
- TODO_TOKEN_FONTS (rename TOKF) → proposta: "spur" / "impulse" / "echo".
- TODO_RATIO_TARGET (validare 2:1 o dinamico day-based).
- TODO_GROWTH_CURVE / TODO_MONOTONY_CURVE / TODO_GS_CURVE → dipendono da telemetria reale.

## 11. Decisioni Potenziali di Taglio
| Tag | Condizione |
|-----|------------|
| CUT_MC | Ruolo non definito / poco usato entro 10 run test |
| CUT_FRAGMENT_PITY | Complessità eccessiva early se frammenti ancora troppo casuali |
| CUT_CONVERSION_CAP | Se giocatori frustrati da spreco TOKF <10% overflow |

## 12. Implementazione (Contratto Minimo)
Strutture dati (indicativo):
```gdscript
class_name EconomyManager
var gc:int = 0
var mc:int = 0
var comfort:int = 0
var token_fictive:int = 0
var fragments:int = 0

func apply_puzzle_reward(kind:String, difficulty:String, success:bool, base_growth:int, fragment:int):
    # growth differito → accumula in buffer giornaliero
    daily_growth_buffer += base_growth
    if fragment == 1:
        fragments += 1
```

Persistenza Save: { gc, mc, comfort, token_fictive, fragments, tokens_inventory, token_queue_index }.

## 13. Checklist Ready per VS
- [ ] GC loop (accumulo puzzle → consegna end-day)
- [ ] Comfort decremento su hint & riflessi
- [ ] Token sequence deterministica attiva
- [ ] Conversione TOKF→MC (se MC confermata)
- [ ] Frammento reward Hard (20%) + pity chain (implementabile post base)
- [ ] Telemetria growth_raw & fragment & token_queue_index
- [ ] Soglie depth finale calcolate

## 14. Revisioni Future (Post VS)
- Skill multipliers / skill tree branching
- MC trasformata in "Dissonance" con effetti passivi se mantenuta
- Token forging / crafting (unione due token in uno potenziato)
- Economia narrativa (frammenti → lore unlock)

---
Documento pronto per integrazione. TODO aperti contrassegnati.
