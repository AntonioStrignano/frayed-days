# Puzzle Archetypes
Each puzzle returns a result dict: `{success, puzzle_type, growth_reward, fragment?, token?, hint_used}`.
Hint tier influences assist level (implementation TBD for stubs).

## Memory Sequence
- Params: sequence_length per tier.
- Fail conditions: 2 mistakes -> fail.
- Hints: Tier1 reveal first 2; Tier2 reveal ghost overlay.

## Association Match
- Pair matching small grid.
- Hints: Tier1 show one correct pair; Tier2 reduce choices.

## Timing Bar
- Moving marker; press inside window.
- Window shrinks with higher tier.
- Hints: Tier1 show upcoming speed change; Tier2 widen window slightly.

## Risk Choice (3 Cards)
- Select one: growth reward range; failure lowers reward but still partial.
- Hints: Tier1 reveal one low card; Tier2 reveal two cards (positions shuffled after?).

## Emotion Interpretation
- Choose label matching abstract face or scene.
- Hints: Tier1 eliminate one wrong; Tier2 give semantic clue.

## Burnout Affliction
- When threshold reached, apply growth_reward * penalty_mult.
- Visual overlay / subtle UI effect.

## Future Scaling (Deferred)
- Adaptive tier selection using recent success streak.
- Fragment drop weighting by puzzle type.
