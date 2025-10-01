# Roadmap Prossimi Passi
(Mantieni lo scope stretto; implementa per fette verticali.)

## Fase 1 – Simulazione & Baseline
1. SimulationRunner headless (N giorni, M run) usando gli stub attuali.
2. Raccogli metriche aggregate: growth/giorno medio, monotony/giorno, shortcut ratio, trigger burnout.
3. Aggiusta i numeri placeholder prima di investire in polish UI.

## Fase 2 – Core Feel
1. Implementare puzzle Memory reale (tier base) con logica hint.
2. Placeholder visivo degradazione (palette swap o color mod).
3. Meccanica giorno di comfort forzato dopo burnout sostenuto (es. burnout 2 giorni consecutivi).

## Fase 3 – Profondità Sistemi
1. Resolver effetti accessori (hook post-delta) – applica growth mult, monotony reduction, bonus burnout threshold.
2. Persistenza (save/load JSON) a fine giorno e trigger manuale.
3. Branch ending Depth (routine lock vs progress).

## Fase 4 – Espansione Puzzle
1. Aggiungere puzzle Timing reale.
2. Ampliare Memory a tier intermedio (sequenza più lunga) + visuals hint tier.
3. Introdurre risk puzzle con UI partial success.

## Fase 5 – Economia & Feedback
1. Varietà effetti token (utilità non-growth).
2. Mini-progresso set frammenti (linee narrative milestone).
3. Sink wildcard points (conversione a reroll frammento o accessory reroll).

## Fase 6 – Polish & QA
1. Hook gating ricchezza testo (monotony tier -> filtro aggettivi).
2. Stub layering audio per degradazione.
3. Export analytics da Logger a CSV/JSON summary.

## Principi Guida
- Rilascia slice verticali; niente feature larga a metà.
- Ogni puzzle aggiunto deve evidenziare tensione growth vs monotony.
- Evita nuove risorse senza review design.
