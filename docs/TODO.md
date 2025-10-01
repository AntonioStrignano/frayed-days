# TODO List

## Fase 0 – Fondamenta Cognitivo/Strategiche
*(Obbligatorie prima di qualunque produzione)*

- **Visione sintetica** (elevator pitch)
- **Genere + loop centrale**
- **Unique selling points**
- **Ambito / scope** (cosa entra / cosa resta fuori)
- **Profilo giocatore** (motivazioni, session length, skill ceiling)
- **Target piattaforme** (impatta input, performance, packaging)
- **Pillars** (3–5 principi non negoziabili)
    *(Questi definiscono il perimetro: se mancano, ogni scelta dopo rischia rework.)*

### Fondamenta Design Coerente (Aggiornamento)
- **Conferma puzzle lineup finale (6 archetipi)**
- **Integra nuovo sistema monotonia (skip-driven)**
- **Stesura tabella tier palette bipolare (7) + hysteresis**
- **Definizione token sequence deterministica + cap 4**
- **Definizione Patto punitivo scaling (formula)**
- **Definizione Burnout soglie 6/9/12 + day pattern trigger**
- **GrowthScore + Monotonia base formulas centralizzate in DATA_MODEL.md**
- **Aggiornare DESIGN.md sezioni: Puzzle Progression, Monotony, Palette, Burnout, Tokens, Pact**
- **Puntatore implementazione Phase A (Memory / Timing / Risk) con nuova economia (failure reward + token guaranteed)**

---

## Fase 1 – Struttura di Gioco di Base
*(Design logico prima del contenuto)*

- **Core loop** (diagramma input → sistema → feedback → progressione)
- **Meccaniche primarie** (quelle senza cui il loop non gira)
- **Failure states + recovery** (serve per bilanciamento early)
- **Sistema salvataggi** (baseline: locale + formato)
- **Telemetria desiderata** (quali eventi traccerai – definizione preliminare)
- **Sistema ricompense** (pattern intervalli e filosofia rarità – in bozza)
- **Economia** (valute + sink/fountain ad alto livello)
- **Bilanciamento – curve macro** (solo ipotesi iniziale: pacing atteso)
- **Onboarding / first minute** (macro flusso: “cosa vede al minuto 0–5”)
- **UX flow grezzo** (mappa delle schermate principali)
- **Accessibilità – principi minimi** (palette sicura, font scaling baseline)

---

## Fase 2 – Tecnologia & Processo Minimi
*(Per poter iterare velocemente)*

- **Motore scelto** (e motivazione)
- **Versione motore congelata** *(nota: impegnarsi a non cambiare ogni settimana)*
- **Linguaggi + standard codice** (naming, formattazione)
- **Controllo versione** (model: trunk-based vs GitFlow)
- **Naming conventions** (file, cartelle, asset)
- **Directory / architettura modulare high-level** (componenti + responsabilità)
- **Script/gestione configurazioni** (JSON / data tables scelte)
- **Sistema build minimo** (CI semplice: lint + build)
- **Performance budget provvisorio** (target framerate + memory cap iniziale)
- **Profiling toolset scelto** (come misurerai)
- **Risk register bozza + scope guard** (come blocchi creep)

---

## Fase 3 – Contenuto Nucleare per Vertical Slice
*(Prototipazione concreta)*

- **Style guide embrionale** (palette + silhouette direction)
- **Sonic identity** (tono musicale e timbri)
- **Concept art chiave** (solo per elementi indispensabili al slice)
- **Asset list priorizzata** (MVP vs nice-to-have)
- **UI kit minimale** (componenti base: bottone, pannello, icon slot)
- **Core animazioni necessarie** (stati imprescindibili)
- **VFX catalogo iniziale** (segna solo effetti critici)
- **Sistema ricompense dettagliato** (tabella concreta early-tier)
- **Economia raffinata first-pass** (numeri di test)
- **Telemetria minima implementabile** (session_start, node_result, fail)
- **Strategia test**: smoke + prima lista regression minima
- **Game Design Document indice** (struttura modulare, non tutto pieno)
- **Tech Design Document** *(se serve chiarire pattern critici)*
- **Logging / event design spec** (chiavi, formati)
- **Target framerate confermato** con micro build di prova

---

## Fase 4 – Estensioni Pre-Vertical Slice
*(Completare i criteri slice)*

- **Animazioni aggiuntive** (transition polish)
- **UI flow completo slice** (node selection, summary screen)
- **Telemetry validation** (verifica campi coerenti)
- **Profiling baseline** (misura frame time reale)
- **Build automatica affidabile** (CI esegue export)
- **Pillars validati empiricamente** (checklist vs prototipo)
- **MVP onboarding scriptato**
- **Performance accettabile target hardware** (prima ottimizzazione leggera)

*(Arrivi qui = “Vertical Slice” pronto.)*

---

## Fase 5 – Pre-Alpha Scaling

- **Progressione** (livelli/missioni/quest/skill—se prevista)
- **Meccaniche secondarie / meta layer**
- **Sistema ricompense avanzato** (rarità multiple, pity/anti-frustrazione)
- **Economia dettagli inflazione** (sink vs fountain numerics)
- **Persistenza estesa** (slot multipli / conflitti)
- **Accessibilità ampliata** (remapping, daltonismo, motion reduction)
- **Pipeline 2D** (PSD → atlas) / **Pipeline 3D** *(se necessario)*
- **Rigging + naming conventions** (complete)
- **Animazioni state machine requirements pieni**
- **VFX budget particelle definito**
- **UI kit completo** (stati, hover, disable, focus)
- **Musica**: loop + stinger + layering prototipo
- **SFX set base** (core feedback)
- **Mix matrix + loudness target** (per evitare re-mix tardivo)
- **Sistema build esteso** (unit test auto + static analysis)
- **Automated test harness** (build validation)
- **Bug taxonomy / reproduction protocol**
- **Asset GUID stability policy**

---

## Fase 6 – Alpha Preparazione

- **Pipeline tool interni** (editor livelli, batch import)
- **Gestione configurazioni avanzata** (feature flags)
- **Sistema salvataggi** (cloud / conflitto risoluzione)
- **Failure states + recovery approfonditi** (edge + roll‑back)
- **Anti-cheat superficie** (entry points documentati)
- **Patch system** (delta vs full)
- **Localization pipeline** (string tables, placeholders)
- **Event design spec ampliato** (funnel retention)
- **Schema proprietà analytics** (tipi, range, privacy)
- **QA: test plan feature-based completo**
- **Memory budget tabellato aggiornato**
- **Garbage collection minimization pass**
- **Occlusion / culling strategie** *(se 3D / costoso)*
- **Streaming assets plan** *(solo se mondo grande)*

---

## Fase 7 – Beta Preparazione

- **Dashboard KPI** (DAU, retention, ARPU ecc.)
- **Cohort analysis definita**
- **Advanced balancing** (curve dettagliate, churn points)
- **Sistemazione reward rare** (loot table final tuning)
- **Security**: offuscazione / checksum / rate limiting
- **Data encryption** (a riposo / in transito se backend)
- **Log auditing**
- **LiveOps tools base** (feature flags runtime)
- **A/B testing framework**
- **Retention levers** (streaks, limited-time modes)
- **Moderazione pipeline** *(se online)*
- **CDN per asset patchabili**
- **Auth / Database / Matchmaking** *(solo se live)*
- **Telemetria ingestion scaling** (batching, queue)
- **Dashboard analytics popolata**

---

## Fase 8 – Beta Completion

- **Contenuto completo** (tutti i capitoli / puzzle finali)
- **Localizzazione integrata completa**
- **Performance target raggiunto** (profiling raffinato)
- **Bilanciamento iterativo continuo**
- **Crash reporting + symbol server robusto**
- **Release notes template attivo**
- **Pricing tiers / monetizzazione** *(solo se F2P)*
- **IAP catalogo / economy sinks bilanciati**

---

## Fase 9 – Launch Readiness

- **Build target matrix finale** (OS, arch)
- **Installer / packaging / anti-tamper** *(se necessario)*
- **Store requirements** (assets grafici, capsule, trailer)
- **Rating PEGI / ESRB**
- **Privacy policy / EULA / open source compliance**
- **Trademark check / licenze third‑party consolidate**
- **Rollback plan testato**
- **CDN warm**
- **Final telemetry validation** (nessun campo mancante)
- **Postmortem template pronto** *(per dopo lancio)*

---

## Fase 10 – Post-Launch / Live
*(Solo se GaaS)*

- **Event calendar vivo**
- **Content cadence pianificata**
- **Feature flags evoluti** (rollout progressivo)
- **Retention levers tuning continuo**
- **LiveOps tool UI interna**
- **Data analyst + community mgmt routine**
- **Extended endings / meta content expansions**
- **A/B test ciclici**
- **Continuous Delivery staging→prod workflow pieno**

---

## Item Trasversali / Inseriti Dove Serve

- **Risk register** *(inizio + aggiornamenti continui)*
- **Scope guard** *(valido da Fase 0 a fine)*
- **Change control process** *(attivo da inizio pre‑prod)*
- **Contingency buffer / capacità** *(aggiorna per milestone)*
- **Ruoli & staffing** *(ridimensioni per vertical slice → beta → live)*
- **Rischi comuni** *(monitor checklist ricorrente)*

---

## Ultimi perché Dipendono da Molto Altro
*(Non iniziare prima)*

- **Pipeline 3D completa** *(se non hai nemmeno deciso stile)*
- **Networking avanzato / matchmaking** *(se non confermato multiplayer)*
- **Scalabilità server / autoscaling**
- **LiveOps + A/B testing + retention levers** *(richiedono telemetria matura)*
- **CDN e patch delta ottimizzati** *(dopo prova export base)*
- **Monetizzazione dettagli** *(dopo validazione retention)*
- **Localization completa** *(dopo testo quasi stabile)*
- **Anti-tamper, offuscazione pesante** *(vicino al launch)*
- **Extended economy sinks complessi** *(post bilanciamento core)*
- **Cohort analysis e dashboards pro** *(dopo avere sample utenti)*

---

## Sintesi “Checkpoint” Milestone
*(Riassunti)*

- **Concept Lock** = (1–7)
- **Pre-Prod Start** = (8–18 + 19–26)
- **Prototype** = (27–34 + 37–39)
- **Vertical Slice** = (fino a 52)
- **Alpha Gate** = (fino a ~84)
- **Beta Gate** = (85–100+)
- **Release Candidate** = (108–117)
- **Post-Launch** = (118+)