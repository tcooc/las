export const ACCESSORY_SLOTS = 5;

export const VALID_COMBOS = [
  [5, 3],
  [4, 3],
  [5],
  [4],
  [3, 3],
  [3, 2],
  [3],
  [2],
  [],
];

export const MAX_POINTS_PER_ACCESSORY = VALID_COMBOS.reduce(
  (acc, combo) =>
    Math.max(
      acc,
      combo.reduce((acc, item) => acc + item, 0)
    ),
  0
);
