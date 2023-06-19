import { observable } from "mobx";
import {
  ACCESSORY_SLOTS,
  getDerivedCombos,
  VALID_COMBOS,
  isRelic,
  isAncient,
  MAX_POINTS_PER_ACCESSORY,
  CLASS_ENGRAVINGS,
  CURSES,
  MAX_POINTS_STONE,
} from "../data";
import { EngravingCalculator } from "./EngravingCalculator";
import { AccessorySlot, PartialAccessory } from "./accessory";
import { Engraving } from "./engravings";
import {
  diffEngravings,
  accessoriesToEngravings,
  sumEngravings,
  sumStats,
} from "./utils";

export const getPossibleStones = (
  workers: Worker[],
  goal: Partial<Engraving>[],
  equipped1: Partial<Engraving>,
  equipped2: Partial<Engraving>,
  stone1: Partial<Engraving>,
  stone2: Partial<Engraving>,
  includeAncient: boolean
) => {
  if (!workers.length) {
    throw new Error("No available workers");
  }
  const start = Date.now();

  const finalResult: {
    stones: number[][];
    done: boolean;
  } = observable({
    stones: [],
    done: false,
  });

  interface Request {
    requestId: string;
    requestStone: number[];
    result?: boolean;
  }
  const requests: Request[] = [];
  for (let i = 0; i <= MAX_POINTS_STONE; i++) {
    for (let j = 0; j <= MAX_POINTS_STONE; j++) {
      requests.push({
        requestId: `${Math.random()}`,
        requestStone: [i, j],
      });
    }
  }
  let requestIndex = 0;

  const checkDone = () => {
    if (requests.every((request) => typeof request.result === "boolean")) {
      console.log("getPossibleStones took", Date.now() - start, "ms");
      finalResult.done = true;
    }
  };

  const addJob = (worker: Worker, { requestId, requestStone }: Request) => {
    const args: Parameters<typeof getPossibleStone> = [
      goal,
      equipped1,
      equipped2,
      { name: stone1.name, value: requestStone[0] },
      { name: stone2.name, value: requestStone[1] },
      includeAncient,
    ];
    worker.postMessage(
      JSON.stringify({
        requestId,
        method: "getPossibleStone",
        args,
      })
    );
  };

  const handleMessage = (message: MessageEvent) => {
    const { requestId, result } = JSON.parse(message.data);
    const request = requests.find((request) => request.requestId === requestId);
    if (request) {
      message.stopPropagation();
      console.log("getPossibleStones.onmessage", requestId, result);
      request.result = result;
      // if a stone is viable, a strictly better stone is also viable so it can be ignored
      if (
        result &&
        !finalResult.stones.some(
          ([si, sj]) =>
            si <= request.requestStone[0] && sj <= request.requestStone[1]
        )
      ) {
        finalResult.stones.push(request.requestStone);
        console.log("stones", finalResult.stones);
      }
      while (requestIndex < requests.length) {
        const nextRequest = requests[requestIndex];
        // if a stone is viable, a strictly better stone is also viable so it can be ignored
        if (
          finalResult.stones.some(
            ([si, sj]) =>
              si <= nextRequest.requestStone[0] &&
              sj <= nextRequest.requestStone[1]
          )
        ) {
          nextRequest.result = true;
        } else {
          addJob(message.target as Worker, nextRequest);
        }
        requestIndex++;
      }
      if (requestIndex >= requests.length) {
        checkDone();
      }
    }
  };

  workers.forEach((worker) => {
    worker.addEventListener("message", handleMessage);
  });

  for (let i = 0; i < workers.length && requestIndex < requests.length; i++) {
    addJob(workers[i], requests[requestIndex]);
  }

  return finalResult;
};

export const getPossibleStone = (
  goal: Partial<Engraving>[],
  equipped1: Partial<Engraving>,
  equipped2: Partial<Engraving>,
  stone1: Partial<Engraving>,
  stone2: Partial<Engraving>,
  includeAncient: boolean
) => {
  const calculator = new EngravingCalculator(false);
  calculator.goal = goal;
  calculator.equipped1 = equipped1;
  calculator.equipped2 = equipped2;
  calculator.stone1 = stone1;
  calculator.stone2 = stone2;

  const recommendations = getRecommendationsBase(
    calculator.startingNeeds,
    [],
    includeAncient,
    true
  );
  return recommendations.length > 0;
};

class RecommendationInterrupt extends Error {}

export const getRecommendations = (
  workers: Worker[],
  startingNeeds: Engraving[],
  accessories: PartialAccessory[],
  includeAncient: boolean
) => {
  if (!workers.length) {
    throw new Error("No available workers");
  }
  const requestId = `${Math.random()}`;
  const args: Parameters<typeof getRecommendationsBase> = [
    startingNeeds,
    accessories,
    includeAncient,
  ];
  workers[0].postMessage(
    JSON.stringify({
      requestId,
      method: "getRecommendationsBase",
      args,
    })
  );
  return requestId;
};

// TODO refactor with Engraving instead of number array
export const getRecommendationsBase = (
  startingNeeds: Engraving[],
  accessories: PartialAccessory[],
  includeAncient: boolean,
  firstOnly: boolean = false
) => {
  const needs = diffEngravings(
    startingNeeds,
    accessoriesToEngravings(accessories)
  );

  // there are way too many possible combinations in the general case
  // just do a greedy search for good accessory combos
  const combinations: number[][][] = [];
  const needsArray = needs.reduce((acc, engraving) => {
    acc.push(engraving.value);
    return acc;
  }, [] as number[]);
  const needsPoints = needs.reduce((acc, { value }) => acc + value, 0);

  const minExtra = 2; // prevent overcapping engraving points
  const needsSlots = ACCESSORY_SLOTS - accessories.length;
  // include derived combos and empty to account for all possibilities
  const validCombos = [
    ...getDerivedCombos(
      VALID_COMBOS.filter(
        (combo) => isRelic(combo) || (includeAncient && isAncient(combo))
      )
    ),
    [],
  ];

  // I'm dumb so just do recursion
  const findCombo = (needsArray: number[], slots: number[][]) => {
    if (slots.length === needsSlots) {
      if (needsArray.every((need) => need <= 0)) {
        combinations.push(slots);
        if (firstOnly) {
          throw new RecommendationInterrupt();
        }
      }
      return;
    }
    for (let i = 0; i < validCombos.length; i++) {
      const combo = validCombos[i];
      if (combo.length === 2) {
        const j = needsArray.findIndex((need) => need > 0);
        if (j > -1) {
          for (let k = j + 1; k < needsArray.length; k++) {
            if (
              (needsArray[j] >= combo[0] || needsArray[j] <= minExtra) &&
              (needsArray[k] >= combo[1] || needsArray[k] <= minExtra)
            ) {
              const newNeedsArray = [...needsArray];
              const newSlot = new Array(needsArray.length);
              newNeedsArray[j] = newNeedsArray[j] - combo[0];
              newNeedsArray[k] = newNeedsArray[k] - combo[1];
              newSlot[j] = combo[0];
              newSlot[k] = combo[1];
              findCombo(newNeedsArray, [...slots, newSlot]);
            }
            if (
              (needsArray[j] >= combo[1] || needsArray[j] <= minExtra) &&
              (needsArray[k] >= combo[0] || needsArray[k] <= minExtra)
            ) {
              const newNeedsArray = [...needsArray];
              const newSlot = new Array(needsArray.length);
              newNeedsArray[j] = newNeedsArray[j] - combo[1];
              newNeedsArray[k] = newNeedsArray[k] - combo[0];
              newSlot[j] = combo[1];
              newSlot[k] = combo[0];
              findCombo(newNeedsArray, [...slots, newSlot]);
            }
          }
        }
      } else if (combo.length === 1) {
        const j = needsArray.findIndex((need) => need > 0);
        if (
          j > -1 &&
          (needsArray[j] >= combo[0] || needsArray[j] <= minExtra)
        ) {
          const newNeedsArray = [...needsArray];
          const newSlot = new Array(needsArray.length);
          newNeedsArray[j] = newNeedsArray[j] - combo[0];
          newSlot[j] = combo[0];
          findCombo(newNeedsArray, [...slots, newSlot]);
        }
      } else {
        findCombo(needsArray, [...slots, []]);
      }
    }
  };

  if (
    needsArray.length > 0 &&
    needsPoints <= needsSlots * MAX_POINTS_PER_ACCESSORY
  ) {
    try {
      findCombo(needsArray, []);
    } catch (e) {
      if (!(e instanceof RecommendationInterrupt)) {
        throw e;
      }
    }
  }

  const recommendedCombosSet = new Set();
  combinations.forEach((slots) => {
    slots.forEach((slot) => {
      if (slot.length) {
        recommendedCombosSet.add(slot.join(","));
      }
    });
  });

  const recommendedCombos: Engraving[][] = [];
  const iterator = recommendedCombosSet.values();
  let item = iterator.next();
  while (!item.done) {
    const combo = (item.value as string)
      .split(",")
      .map((value) => (value.length ? parseInt(value) : 0));

    const first = combo.findIndex((value) => value > 0);
    const firstValue = combo[first];
    const recommendedCombo = [{ name: needs[first].name, value: firstValue }];
    combo[first] = 0;
    const second = combo.findIndex((value) => value > 0);
    const secondValue = second > -1 ? combo[second] : 0;
    if (secondValue) {
      recommendedCombo.push({
        name: needs[second].name,
        value: secondValue,
      });
    }

    recommendedCombo.sort((a, b) => b.value - a.value);
    recommendedCombos.push(recommendedCombo);
    item = iterator.next();
  }
  recommendedCombos.sort((a, b) => {
    const aHasClass = a.some(({ name }) => CLASS_ENGRAVINGS.includes(name));
    const bHasClass = b.some(({ name }) => CLASS_ENGRAVINGS.includes(name));
    if (aHasClass !== bHasClass) {
      return (bHasClass ? 1 : 0) - (aHasClass ? 1 : 0);
    }
    let diff =
      b.reduce((acc, item) => acc + item.value, 0) -
      a.reduce((acc, item) => acc + item.value, 0);
    if (diff === 0) {
      if (b[0].name < a[0].name) {
        diff += 1;
      }
      if (b[0].name > a[0].name) {
        diff -= 1;
      }
    }
    if (diff === 0 && b.length !== a.length) {
      diff += b.length - a.length;
    }
    if (diff === 0 && a.length > 1) {
      if (b[1].name < a[1].name) {
        diff += 1;
      }
      if (b[1].name > a[1].name) {
        diff -= 1;
      }
    }
    return diff;
  });
  return recommendedCombos;
};

export const getBuilds = (
  startingSum: Engraving[],
  startingNeeds: Engraving[],
  validAccessories: PartialAccessory[]
) => {
  const start = Date.now();

  const necks = validAccessories.filter(
    (accessory) => accessory.slot === AccessorySlot.Necklace
  );
  const earrings = validAccessories.filter(
    (accessory) => accessory.slot === AccessorySlot.Earring
  );
  const rings = validAccessories.filter(
    (accessory) => accessory.slot === AccessorySlot.Ring
  );

  console.log("builds filtered", necks, earrings, rings);

  const accessoryCombos: PartialAccessory[][] = [];

  const findNecks = () => {
    for (let i = 0; i < necks.length; i++) {
      findEarrings([necks[i]]);
    }
  };
  const findEarrings = (accessories: PartialAccessory[]) => {
    for (let i = 0; i < earrings.length; i++) {
      for (let j = i + 1; j < earrings.length; j++) {
        findRings([...accessories, earrings[i], earrings[j]]);
      }
    }
  };
  const findRings = (accessories: PartialAccessory[]) => {
    for (let i = 0; i < rings.length; i++) {
      for (let j = i + 1; j < rings.length; j++) {
        findCombos([...accessories, rings[i], rings[j]]);
      }
    }
  };
  const findCombos = (accessories: PartialAccessory[]) => {
    console.log("builds findBuilds", accessories);
    const engravings = sumEngravings(accessoriesToEngravings(accessories));
    if (diffEngravings(startingNeeds, engravings).length === 0) {
      accessoryCombos.push(accessories);
    }
  };
  findNecks();

  const builds = accessoryCombos.map((accessories) => {
    const engravings = sumEngravings([
      ...startingSum,
      ...accessoriesToEngravings(accessories),
    ]);
    const curses = engravings.filter(
      (engraving) => CURSES.includes(engraving.name) && engraving.value >= 5
    );
    const stats = sumStats(accessories);
    const price = accessories.reduce(
      (acc, accessory) => acc + (accessory.price || 0),
      0
    );
    return { accessories, stats, engravings, curses, price };
  });

  builds.sort((b, a) => {
    let diff = b.curses.length - a.curses.length;
    if (diff === 0) {
      diff = b.price - a.price;
    }
    return diff;
  });
  console.log("builds done", builds);
  console.log("builds took", Date.now() - start, "ms");
  return builds;
};
