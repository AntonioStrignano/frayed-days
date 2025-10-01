extends Node

var run_index:int = 0
var day:int = 1
var resources := {
    "growth": 0,
    "monotony": 0,
    "comfort": 0,
    "debt": 0,
    "shortcut_coins": 0,
    "growth_coins": 0,
    "fragments": {},
    "tokens": [],
    "wildcard_points": 0,
    "accessories_owned": [],
    "accessories_pending": []
}
var routine_lock: bool = false

func _ready():
    print("GameState ready (stub)")

func start_run():
    run_index += 1
    day = 1
    routine_lock = false

func start_day():
    pass

func end_day():
    pass

func end_run():
    var depth = resources.growth - (resources.monotony + resources.debt)
    return depth