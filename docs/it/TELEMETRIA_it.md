# Telemetria (Baseline)

Questo documento definisce l'ossatura MINIMA del sistema di telemetria per il prototipo / Vertical Slice, distinguendo nettamente tra:
- **Telemetria**: eventi strutturati (analitica, tuning, funnel).
- **Logging**: diagnostica locale (debug / QA) – separato, non inviato.

> Obiettivo: raccogliere solo i segnali necessari a validare loop, pacing, difficoltà e metriche pillar. Ogni nuovo evento deve mappare un'ipotesi o una decisione.

## 1. Principi
1. Privacy: nessun dato personale, nessun identificatore hardware stabile → genera `run_id` UUID v4 ad ogni nuova run.
2. Immediatezza: scrittura append JSON Lines (`.jsonl`) su file locale, flush immediato (evita perdita in crash).
3. Robustezza: se un campo obbligatorio manca → evento scartato (WARN), MA il gioco continua.
4. Versioning: ogni riga ha `build_version` + `schema_version` (telemetry).
5. Budget: ≤300 eventi per run media (target <220). Se >300 → log Warnings e aprire TODO ottimizzazione.

## 2. File & Rotazione
- Percorso: `logs/telemetry_run_<run_id>_<timestamp>.jsonl`
- Rollover dimensione: 256 KB → nuovo file con suffisso incrementale `_01`, `_02`, ...
- Retention: max 10 file (FIFO delete). TODO_TELEMETRIA_RETENTION se servono più.

## 3. Struttura Evento Comune
Campi obbligatori (presenti in TUTTI gli eventi):
| Campo | Tipo | Note |
|-------|------|------|
| `event_type` | string | lowercase snake (`session_start`, `puzzle_result` ...) |
| `t` | int | epoch ms (UTC) |
| `run_id` | string | UUID v4 run corrente |
| `day` | int | day_index (1+) |
| `slot` | int | room_slot (1–7) se applicabile, else 0 |
| `build_version` | string | es `v0.2.0-vslice` |
| `schema_version` | int | versione schema telemetria (inizio = 1) |
| `session_seq` | int | contatore monotono eventi (0++) |

Campi opzionali frequenti (inserire solo se rilevanti):
- `depth` (growth_total − monotony)
- `palette_tier`
- `burnout_stage`
- `monotony`
- `growth_total`
- `growth_score`

Regola: no valori null → se sconosciuto, ometti.

## 4. Catalogo Eventi Minimi

### 4.1 `session_start`
Triggered: avvio eseguibile / caricamento menù principale.
Extra campi:
| Campo | Tipo | Note |
|-------|------|------|
| `engine_version` | string | Godot 4.5.* |
| `platform` | string | `windows` / `mac` |
| `locale` | string | `it` / `en` ... |

### 4.2 `run_start`
Quando il giocatore inizia una nuova run (day=1). Campi extra: nessuno (usa comuni). Distinto da sessione.

### 4.3 `node_result`
Per QUALSIASI nodo completato (puzzle o non puzzle). Campi extra:
| Campo | Tipo | Note |
|-------|------|------|
| `node_type` | string | `puzzle` / `comfort` / `reflect` / `pact_offer` / `other` |
| `time_ms` | int | durata nodo completa (ingresso→esito) |
| `skipped` | bool | se skip forzato/applicato |

### 4.4 `puzzle_result`
Solo se `node_type = puzzle`. Campi extra:
| Campo | Tipo | Note |
|-------|------|------|
| `puzzle_archetype` | string | `memory` / `filter` / `timing` / ... |
| `tier` | int | tier corrente prima reward |
| `difficulty_label` | string | `easy` / `medium` / `hard` |
| `success` | bool | esito |
| `time_active_ms` | int | tempo effettivo interazione (pausa esclusa) |
| `fail_count_type` | int | fail consecutivi per questo tipo (post esito) |
| `streak_success_type` | int | success streak (post esito) |
| `token_queue_index` | int | indice token sequence (pre avanzamento) |
| `reward_growth_raw` | int | valore pre moltiplicatori |
| `reward_fragment` | int | 0/1 frammento ottenuto |

### 4.5 `reflection_use`
Quando il giocatore utilizza una reflection (hint / analisi). Extra:
| Campo | Tipo | Note |
|-------|------|------|
| `puzzle_archetype` | string | target |
| `hint_level` | int | 1 o 2 |
| `cost_comfort` | int | comfort speso |
| `monotony_delta` | int | variazione (se riduzione) |

### 4.6 `token_use`
Uso di un token (on apply). Extra:
| Campo | Tipo | Note |
|-------|------|------|
| `token_type` | string | `focus` / `foresight` / `null_debt` / `stabilizer` / `filter_boost` / `wildseed` |
| `inventory_after` | int | quanti di quel tipo restano |

### 4.7 `palette_tier_change`
Cambio tier bipolare. Extra:
| Campo | Tipo | Note |
|-------|------|------|
| `from` | int | tier precedente |
| `to` | int | nuovo tier |
| `trigger` | string | `growth_threshold` / `monotony_threshold` / `other` |

### 4.8 `burnout_stage_change`
Extra:
| Campo | Tipo | Note |
|-------|------|------|
| `from` | int | stage precedente |
| `to` | int | nuovo stage |
| `trigger` | string | causa (puzzle_fail_chain, overplay, forced_rest_end) |

### 4.9 `pact_decision`
Offerta patto mostrata. Extra:
| Campo | Tipo | Note |
|-------|------|------|
| `offered_iter` | int | numero patto (1+) |
| `accepted` | bool | scelta |
| `penalty_growth_next` | float | moltiplicatore risultante se accettato |
| `monotony_delta` | int | incremento immediato |

### 4.10 `day_end`
Fine giornata (room_slot 7). Extra:
| Campo | Tipo | Note |
|-------|------|------|
| `puzzles_done` | int | conteggio |
| `hard_count` | int | numero Hard |
| `skips_today` | int | totale skip |
| `fragments_today` | int | frammenti |
| `burnout_stage` | int | finale giornata |

### 4.11 `run_end`
Conclusione run. Extra:
| Campo | Tipo | Note |
|-------|------|------|
| `ending_type` | string | `growth_finale` / `monotony_lock` / `abandon_internal` / `other` |
| `days_completed` | int | numero giorni |
| `final_growth` | int | growth_total finale |
| `final_monotony` | int | monotony finale |
| `depth` | int | final depth |

## 5. Metriche Derivate (Post-Processing)
Non registrate direttamente, ma calcolate offline:
- `retry_immediato_rate` = puzzle_result con tempo tra fail e retry <15s / total fail.
- `hint_usage_rate` = reflection_use / puzzle_result (dove hint disponibili).
- `hard_uptake_segment` = hard_count / puzzles_done per fasce (Days1–2,3–5,6–8,9–12).
- `growth_rmse` contro curva target.
- `palette_change_per_run` = count palette_tier_change / run.

## 6. Validazioni Runtime
| Regola | Azione |
|--------|--------|
| event_type non riconosciuto | scarta + warn |
| campo obbligatorio mancante | scarta + warn |
| file write error | tenta reopen 1 volta, poi disabilita telemetria session |
| >300 eventi run | emetti evento speciale `telemetry_budget_exceeded` (una volta) |

## 7. Distinzione Logging vs Telemetria
- Logging (diagnostica): può contenere stack trace, parametri interni, NON influisce su metriche.
- Telemetria: schema stabile, senza messaggi liberi, senza enumerazioni non documentate.

## 8. Evoluzione Schema
Incrementare `schema_version` solo se: rimozione campo obbligatorio o modifica semantica. Aggiunta campi opzionali = compatibile.
TODO_TELEMETRIA_SPEC per eventuale payload approfondito (es: granular puzzle action stream) se necessario dopo VS.

## 9. Integrazione con SPEC_CORE_LOOP_it.md
Questo documento soddisfa il blocco Telemetria baseline. Riferimenti TODO incrociati:
- TODO_TELEMETRIA_SPEC (espansione)
- TODO_FINAL_GROWTH_TARGET (dipende da distribuzione growth finale)
- TODO_MONOTONY_CURVE / TODO_GROWTH_CURVE / TODO_GS_CURVE (metriche derivate)

## 10. Implementazione (Contratto Minimo)
Pseudocodice emissione:
```gdscript
func emit(event_type: String, payload: Dictionary):
    if not _validate(event_type, payload):
        push_warning("Telemetry discard: %s" % event_type)
        return
    payload.event_type = event_type
    payload.t = Time.get_ticks_msec()
    payload.run_id = current_run_id
    payload.session_seq = _seq_next()
    payload.build_version = BUILD_VERSION
    payload.schema_version = 1
    _write_line(JSON.stringify(payload))
```

Check di coerenza specifico per `puzzle_result`: se manca `puzzle_archetype` → scarta.

## 11. Aperture / TODO
- TODO_TELEMETRIA_SPEC: definire se servono eventi granulari (es: `puzzle_action`) per tuning micro → post Vertical Slice.
- TODO_FINAL_GROWTH_TARGET: calibrazione target finale basata su telemetria reale prime 30 run test.

## 12. Rischi
| Rischio | Mitigazione |
|---------|-------------|
| Rumore eccessivo (saturazione budget) | Hard cap, analisi diff top 3 eventi voluminosi |
| Divergenza schema vs codice | Test avvio: confronto lista eventi implementati vs doc |
| Perdita file in crash | Flush immediato + chunk piccoli |
| Interpretazione ambigua `success` | Boolean sempre esplicito in `puzzle_result` |

## 13. Prossimi Passi
1. Implementare wrapper `Telemetry.gd` con coda asincrona (opzionale se write blocking irrilevante).
2. Integrare emissione in: start session, start run, end node, end day, end run, token usage, reflection, burnout/palette, pact.
3. Aggiungere test debug: pressing F3 → forza evento fittizio per validare write.

---
Documento pronto per prima implementazione. 🚀
