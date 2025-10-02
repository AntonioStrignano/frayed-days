extends Node

# Carica e valida i file JSON di configurazione del gioco.
# Autoload suggerito: Name = ConfigManager

const DATA_PATH := "res://data/"
const FILES := [
	{"key":"puzzles", "file":"puzzles.json"},
	{"key":"monotony", "file":"monotony.json"},
	{"key":"burnout", "file":"burnout.json"},
	{"key":"pact", "file":"pact.json"},
	{"key":"tokens", "file":"tokens.json"},
	{"key":"palette", "file":"palette.json"},
	{"key":"progression", "file":"progression.json"}
]

var _configs: Dictionary = {}
var _errors: Array = []
var _warnings: Array = []
var _version_hash: String = ""

func _ready():
	load_all()

func load_all():
	_configs.clear()
	_errors.clear()
	_warnings.clear()
	for entry in FILES:
		_load_section(entry.key, DATA_PATH + entry.file)
	_run_validation()
	_compute_version_hash()
	if _errors.size() > 0:
		push_error("[ConfigManager] ERRORI CONFIG: \n" + "\n".join(_errors))
	if _warnings.size() > 0:
		print_rich("[ConfigManager] [color=yellow]AVVISI CONFIG:\n" + "\n".join(_warnings) + "[/color]")
	print("[ConfigManager] Loaded sections:", _configs.keys(), "version_hash=", _version_hash)

func reload():
	load_all()

func _load_section(key: String, path: String):
	var file = FileAccess.open(path, FileAccess.READ)
	if file == null:
		_errors.append("Manca file: " + path)
		_configs[key] = {}
		return
	var txt := file.get_as_text()
	var data = JSON.parse_string(txt)
	if typeof(data) != TYPE_DICTIONARY:
		_errors.append("Parse fallito: " + path)
		_configs[key] = {}
		return
	_configs[key] = data

func get_section(key: String) -> Dictionary:
	if _configs.has(key):
		# Ritorna shallow copy per evitare mutazioni accidentali
		return _configs[key].duplicate(true)
	return {}

func require(key: String, path: String):
	# path tipo "growth.easy"
	var section = _configs.get(key, null)
	if section == null:
		push_error("Config section mancante: " + key)
		return null
	var parts = path.split(".")
	var current = section
	for p in parts:
		if typeof(current) == TYPE_DICTIONARY and current.has(p):
			current = current[p]
		else:
			push_error("Chiave mancante: " + key + "." + path)
			return null
	return current

func get_version_hash() -> String:
	return _version_hash

func _compute_version_hash():
	# Semplice concatenazione di version + schema per tutte le sezioni
	var acc := []
	for k in _configs.keys():
		var meta = _configs[k].get("meta", {})
		acc.append(str(k) + ":" + str(meta.get("version", "?")) + ":" + str(meta.get("schema", "?")))
	_version_hash = String.hash(acc.join("|"))

# ---------------- Validation -----------------

func _run_validation():
	_validate_presence()
	if _errors.size() > 0:
		return # abort altre validazioni
	_validate_puzzles()
	_validate_monotony()
	_validate_burnout()
	_validate_pact()
	_validate_tokens()
	_validate_palette()
	_validate_progression()
	_validate_cross()

func _validate_presence():
	for entry in FILES:
		if not _configs.has(entry.key):
			_errors.append("Manca sezione: " + entry.key)

func _validate_puzzles():
	var s = _configs.get("puzzles", {})
	var esc = s.get("escalation", {})
	var growth = s.get("growth", {})
	var required_esc = ["easy_to_medium", "medium_to_hard", "demote_after_consecutive_fails"]
	for k in required_esc:
		if not esc.has(k):
			_errors.append("puzzles.escalation manca chiave: " + k)
	var required_growth = ["easy", "medium", "hard", "failure_factor"]
	for k in required_growth:
		if not growth.has(k):
			_errors.append("puzzles.growth manca chiave: " + k)
	var failure_factor = growth.get("failure_factor", 0.0)
	if failure_factor <= 0 or failure_factor >= 1:
		_warnings.append("puzzles.growth.failure_factor fuori range consigliato (0-1): " + str(failure_factor))

func _validate_monotony():
	var s = _configs.get("monotony", {})
	var ev = s.get("events", {})
	var red = s.get("reductions", {})
	var caps = s.get("caps", {})
	var required_events = ["skip_puzzle", "exit_after_fail", "pact_accept_per_stack", "hard_repeat_same_type"]
	for k in required_events:
		if not ev.has(k):
			_warnings.append("monotony.events manca suggerita: " + k)
	if not red.has("reflection_single"):
		_warnings.append("monotony.reductions.reflection_single mancante")
	if not caps.has("reflection_total_abs_per_day"):
		_warnings.append("monotony.caps.reflection_total_abs_per_day mancante")

func _validate_burnout():
	var s = _configs.get("burnout", {})
	var pattern = s.get("pattern_day_model", {})
	if not pattern.has("stage1_trigger"):
		_warnings.append("burnout.pattern_day_model.stage1_trigger mancante")
	if not pattern.has("recovery_condition"):
		_warnings.append("burnout.pattern_day_model.recovery_condition mancante")

func _validate_pact():
	var s = _configs.get("pact", {})
	if not s.has("monotony_spike_per_accept"):
		_warnings.append("pact.monotony_spike_per_accept mancante")
	var depthc = s.get("depth_coefficients", {})
	for k in ["fragments_bank", "mc", "pact_accept_penalty"]:
		if not depthc.has(k):
			_errors.append("pact.depth_coefficients manca chiave: " + k)

func _validate_tokens():
	var s = _configs.get("tokens", {})
	if not s.has("sequence") or typeof(s.sequence) != TYPE_ARRAY or s.sequence.size() == 0:
		_errors.append("tokens.sequence mancante o vuota")
	if not s.has("base_cap"):
		_warnings.append("tokens.base_cap mancante")

func _validate_palette():
	var s = _configs.get("palette", {})
	var mono = s.get("monotony_thresholds", [])
	var grow = s.get("growth_thresholds", [])
	if mono.size() == 0 or grow.size() == 0:
		_errors.append("palette thresholds mancanti")
	if not _is_strictly_ascending(mono):
		_warnings.append("palette.monotony_thresholds non crescenti")
	if not _is_strictly_ascending(grow):
		_warnings.append("palette.growth_thresholds non crescenti")

func _validate_progression():
	var s = _configs.get("progression", {})
	var gating = s.get("hard_gating", [])
	if gating.size() == 0:
		_warnings.append("progression.hard_gating vuoto")
	# Check day uniqueness
	var seen := {}
	for block in gating:
		if typeof(block) != TYPE_DICTIONARY: continue
		var days = block.get("days", [])
		for d in days:
			if seen.has(d):
				_warnings.append("progression.hard_gating giorno duplicato: " + str(d))
			seen[d] = true

func _validate_cross():
	# Escalation reference deve combaciare con puzzles.escalation
	var p_esc = _configs.get("puzzles", {}).get("escalation", {})
	var ref_esc = _configs.get("progression", {}).get("escalation_reference", {})
	if p_esc.keys().size() > 0 and ref_esc.keys().size() > 0:
		for k in ["easy_to_medium", "medium_to_hard", "demote_after_consecutive_fails"]:
			if p_esc.get(k, null) != ref_esc.get(k, null):
				_warnings.append("Escalation mismatch puzzles vs progression per chiave: " + k)

func _is_strictly_ascending(arr: Array) -> bool:
	var last = null
	for v in arr:
		if last == null:
			last = v
			continue
		if v <= last:
			return false
		last = v
	return true

func get_errors() -> Array:
	return _errors.duplicate()

func get_warnings() -> Array:
	return _warnings.duplicate()
