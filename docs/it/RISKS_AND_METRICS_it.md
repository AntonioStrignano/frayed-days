# Rischi & Metriche
(Documento vivo; aggiornare dopo le prime simulazioni.)

## 1. Progressione / Pacing
- Rischio: Monotony scala troppo veloce e blocca Depth prima che il giocatore percepisca crescita.
  - Metrica: monotony medio al Giorno 5 (< 45 target) / differenza growth - monotony.
  - Mitigazione: ridurre monotony baseline challenge da 3 a 2; inserire support node gratuito se media > soglia.
- Rischio: Growth cresce linearmente e non crea tensione. 
  - Metrica: varianza growth/day (target coefficiente variazione > 0.25).
  - Mitigazione: introdurre piccolo range ricompense per challenge base.

## 2. Burnout / Affliction
- Rischio: Burnout appare troppo spesso → giocatore spamma comfort.
  - Metrica: percentuale giorni con burnout attivo (< 25% early run).
  - Mitigazione: alzare threshold +1 oppure decay automatico dopo un fail.
- Rischio: Burnout troppo raro → meccanica invisibile.
  - Metrica: run senza burnout (target < 30%).
  - Mitigazione: abbassare threshold o aumentare incentive catena challenge.

## 3. Degradazione Sensoriale
- Rischio: Passaggio di tier troppo improvviso.
  - Metrica: giorni tra Tier1 e Tier2 (target ≥ 2).
  - Mitigazione: smoothing (buffer monotony finestra) o threshold interpolati.
- Rischio: Giocatore ignora feedback (non abbastanza impattante).
  - Metrica: retention uso nodi comfort dopo arrivo Tier2.
  - Mitigazione: aggiungere lieve crescita penalty ai colori sterili.

## 4. Economia (Shop / Tokens / Accessori)
- Rischio: Scorciatoie forniscono troppi shortcut_coins → shop spam.
  - Metrica: acquisti medi/giorno (>1.2 indica eccesso).
  - Mitigazione: gating costi progressivi o soft cap giornaliero.
- Rischio: Token inutilizzati sempre convertiti → wildcard_points inflazionati.
  - Metrica: conversione media tokens->wildcard (target < 60%).
  - Mitigazione: scadenza parziale o bonus uso in-run.

## 5. Hint / Reflection
- Rischio: Costo reflection non giustificato percepito.
  - Metrica: ratio riflessioni / fallimenti (target ~0.5 tier1).
  - Mitigazione: mostrare preview beneficio hint.
- Rischio: Tier2 troppo facile da raggiungere.
  - Metrica: giorni medi al primo Tier2 per puzzle tipo (target ≥ 3).
  - Mitigazione: aumentare costo tier2 o richiedere 3 fail.

## 6. Fragments / Collezioni
- Rischio: Drop troppo raro → sistema invisibile.
  - Metrica: frammenti raccolti entro fine run 3 (target 2–3).
  - Mitigazione: garantire primo drop success memory.
- Rischio: Drop troppo comune → perde valore.
  - Metrica: frammenti medi per run > 6.
  - Mitigazione: soglia soft (diminishing probability).

## 7. Depth / Endings
- Rischio: Routine lock prematuro.
  - Metrica: run terminate per routine lock prima del giorno 6 (<10% target).
  - Mitigazione: protezione early-run (cap monotony penalità prime 2 run).
- Rischio: Growth ending troppo distante.
  - Metrica: run medie per raggiungere depth target (target 8–10).
  - Mitigazione: scaling reward intermedio dopo run 5.

## 8. Variabilità Run
- Rischio: Pattern nodi ripetitivo.
  - Metrica: entropia categoria nodi per giorno (target > 1.5 bits early).
  - Mitigazione: bias selezione verso categorie meno usate.

## 9. Tecnico / Manutenibilità
- Rischio: Effetti accessori sparsi in più script.
  - Metrica: punti di tocco per aggiungere un effetto (target = 1 resolver).
  - Mitigazione: introdurre `AccessoryEffectResolver` centralizzato.
- Rischio: Crescita dimensioni GameState gonfiata.
  - Metrica: linee GameState > 400 (attuale ok).
  - Mitigazione: estrarre moduli persistenti.

## 10. Telemetria / Logging
- Rischio: Log eccessivamente verboso pesa su I/O.
  - Metrica: dimensione file per run (target < 200KB).
  - Mitigazione: livello logging configurabile.
- Rischio: Mancano metriche aggregate.
  - Metrica: tempo analisi manuale > 5 min.
  - Mitigazione: script summarizer (fase polish).

## Metriche di Base da Calcolare Subito
- growth/day medio, monotony/day medio
- rapporto scorciatoie = shortcut_count / total_nodes
- burnout_triggers per run
- depth finale per run
- frammenti raccolti per run

## Strumenti Futuri
- SimulationRunner per generare dataset JSON.
- Summarizer per creare CSV (pandas eventuale, fuori engine) – rimandato.
