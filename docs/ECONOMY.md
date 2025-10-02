# Economy (EN) – v0.1 Snapshot

Mirrors Italian `ECONOMIA_it.md` core mechanics (concise form).

## 1. Currencies / Resources
| Code | Name | Type | Persistence | Role | Notes |
|------|------|------|-------------|------|-------|
| GC | Growth Coin | Soft | Run | Skill / meta progression | Delivered end-of-day |
| MC | Monotony Coin | Branch | Run | Monotony mitigation / alt skills | From fragments (3:1 / 2:1 Pact) |
| FGB | FragmentsBank | Protected buffer | Run | Holds fragments while Pact active | Converts later |
| FRAG | Fragment | Rare collectible | Run | Milestone / gating | Bank redirect if Pact |
| TOK# | Token (6 types) | Active charge | Run | Deterministic boosts | Sequence fixed |
| MONO | Monotony | Pressure scalar | Run | Loss / lock driver | Not spendable |
| COMF | Comfort | Consumable | Day | Reflection / burnout recovery | Cap daily |

## 2. Differentiation
- MC derives only via fragments; Pact amplifies conversion rate.
- FGB enables strategic deferral of fragment spending.
- MONO applies friction; cannot be spent directly.
- Tokens supply predictable agency, not economic RNG.

## 3. Sources (v0.1)
| Resource | Source | Placeholder Qty | Notes |
|----------|--------|-----------------|-------|
| GC | growth_raw buffer → end-day | E/M/H base 10/15/20 | Tuning central |
| MC | Fragment conversion | 3:1 base / 2:1 Pact | Bank optional |
| FRAG | Hard success 20% + pity chain | Cap 4 VS | Redirect → FGB under Pact |
| FGB | Pact accepted (redirect FRAG) | 1:1 FRAG | Persists |
| TOK# | Puzzle completion (success/fail) | 1 each | Deterministic order |
| COMF | Comfort node / small puzzle drip | +X / +1 | Anti-hoard cap |
| MONO | Skip / Pact / Hard repeat / Burnout events | variable | See balancing |

## 4. Sinks (v0.1)
| Resource | Sink | Cost (Placeholder) | Notes |
|----------|------|--------------------|-------|
| GC | Skill unlock | 6 / 12 / 18 | Simple scaling |
| MC | Monotony mitigation / reroll / alt skill | TBD bundle | TUNING_MC_SINKS |
| FRAG | (Off-Pact) Conversion to MC | 3:1 | Or reserved design gating |
| FGB | (On-Pact) Conversion to MC | 2:1 | Player triggered |
| TOK# | Puzzle power application | 1 | Regenerates via cycle |
| COMF | Reflection hints | 2 / 3 | Monotony -3 (cap 2/day) |

## 5. Formulas (Updated)
| Concept | Formula | Note |
|---------|---------|------|
| Growth failure reward | floor(success_value * 0.35) | E3/M5/H7 |
| Pact monotony spike | +15 * pact_accept_count | Linear |
| Hard repeat monotony | +2 stacking (max +6) | New event |
| Fragment→MC | 3:1 (2:1 Pact) | Bank aware |
| Depth | Growth + (FGB *0.5) + (MC *0.3) - Monotony - (PactAccepts *8) | Coeffs tunable |
| Burnout Stage2 penalty | -15% Growth & -10% day timer | Placeholder |

## 6. Depth Impact Considerations
- MC coefficient low to avoid over-weighting alternative economy.
- FGB weighting (0.5) incentivizes strategic Pact but penalized by monotony spike and future growth penalty.

## 7. Pact Economic Effects
- Infinite token cap (indirect value from faster token cycling if consumption prompt).
- Banking fosters accumulation before optimal conversion.
- Growth penalty ensures diminishing marginal return across successive accepts.

## 8. Telemetry Fields Needed
Refer to `TELEMETRY.md`: puzzle_result, pact_decision, day_end, run_end must expose fragments, bank, MC deltas.

## 9. Open TODO
- TUNING_CONV_FRAG_MC
- TUNING_MC_SINKS (define list)
- Evaluate MC removal if low utilization across 10+ test runs.

---
Authoritative numbers still sourced from balancing notes; this file describes structural relations.
