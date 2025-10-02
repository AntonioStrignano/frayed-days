# Telemetry (EN Baseline)

Mirror of `docs/it/TELEMETRIA_it.md` (v0.1) with minimized narrative.

## 1. Principles
1. Privacy: no personal data; generate `run_id` UUIDv4 per run.
2. Append-only JSON Lines (`.jsonl`); flush each write.
3. Required-field validation; discard invalid events.
4. Version fields: `build_version`, `schema_version`.
5. Budget: target <220 events/run (hard warn at 300).

## 2. Common Fields
`event_type, t (epoch ms), run_id, day, slot, build_version, schema_version, session_seq`
Optional: `depth, palette_tier, burnout_stage, monotony, growth_total, growth_score`.

## 3. Event Catalog (v0.1)
- node_chosen(node_type)
- puzzle_result(puzzle_archetype, tier, difficulty_label, success, time_active_ms, fail_count_type, streak_success_type, token_queue_index, reward_growth_raw, reward_fragment, hard_repeat_flag, monotony_delta, depth_snapshot)
- reflection_use(puzzle_archetype, hint_level, cost_comfort, monotony_delta)
- skip(reason_code)
- token_use(token_type, inventory_after)
- burnout_stage_change(from, to, trigger, pattern_days_window)
- palette_tier_change(from, to, trigger)
- pact_decision(offered_iter, accepted, accept_count_total, decline_streak, penalty_growth_next, monotony_delta)
- day_end(puzzles_done, hard_count, skips_today, fragments_today, fragments_bank, mc_gained, burnout_stage, depth_day_end)
- run_end(ending_type, days_completed, final_growth, final_monotony, final_depth, pact_accepts, fragments_bank_final, mc_total)

## 4. Field Order Freeze
Maintain deterministic key order when serializing (append new keys at end only).

puzzle_result: [event_type, t, run_id, day, slot, puzzle_archetype, tier, difficulty_label, success, time_active_ms, fail_count_type, streak_success_type, token_queue_index, reward_growth_raw, reward_fragment, hard_repeat_flag, monotony_delta, depth_snapshot]

pact_decision: [event_type, t, run_id, day, slot, offered_iter, accepted, accept_count_total, decline_streak, penalty_growth_next, monotony_delta]

day_end: [event_type, t, run_id, day, puzzles_done, hard_count, skips_today, fragments_today, fragments_bank, mc_gained, burnout_stage, depth_day_end]

run_end: [event_type, t, run_id, day, ending_type, days_completed, final_growth, final_monotony, final_depth, pact_accepts, fragments_bank_final, mc_total]

## 5. Derived Metrics (Offline)
- retry_immediate_rate
- hint_usage_rate
- hard_uptake_segment
- growth_rmse
- palette_change_per_run

## 6. Validation Rules
- Unknown event_type → discard warn
- Missing required field → discard warn
- >300 events → emit `telemetry_budget_exceeded` once

## 7. Implementation Sketch
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

## 8. Open TODO
- TODO_TELEMETRY_SPEC (granular puzzle action stream?)
- TUNING event budget thresholds

---
Authoritative numeric tuning remains in balancing docs; this file freezes structure.
