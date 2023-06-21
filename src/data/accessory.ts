export const ACCESSORY_SLOTS = 5;

export const VALID_COMBOS = [
  [6, 3],
  [5, 3],
  [4, 3],
  [3, 3],
  [3, 2],
];

// can roll 3/3 or 3/2
export const isLegendary = (combo: number[]) => {
  return combo[0] === 3 && combo[1] >= 2 && combo[1] <= 3;
};

// can roll 5/3, 4/3, or 3/3
export const isRelic = (combo: number[]) => {
  return combo[0] >= 3 && combo[0] <= 5 && combo[1] === 3;
};

// can roll 6/3, 5/3, or 4/3
export const isAncient = (combo: number[]) => {
  return combo[0] >= 4 && combo[0] <= 6 && combo[1] === 3;
};

// calculates all possible useful combos based on accessory, eg. [[1, 6], [1, 5]] -> [[1, 6], [1, 5], [1], [6], [5]]
export const getDerivedCombos = (combos: number[][]) => {
  const derived: number[] = [];
  combos.forEach((combo) => {
    combo.forEach((value) => {
      if (!derived.includes(value)) {
        derived.push(value);
      }
    });
  });
  return [...combos, ...derived.map((value) => [value])];
};

export const MAX_POINTS_PER_ACCESSORY = VALID_COMBOS.reduce(
  (acc, combo) =>
    Math.max(
      acc,
      combo.reduce((acc, item) => acc + item, 0)
    ),
  0
);
