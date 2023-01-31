import { makeAutoObservable, reaction } from "mobx";
import {
  ACCESSORY_SLOTS,
  CURSES,
  MAX_POINTS_PER_ACCESSORY,
  VALID_COMBOS,
} from "../data";
import {
  AccessorySlot,
  Engraving,
  isEngraving,
  PartialAccessory,
  Stat,
  StatValue,
} from ".";
import {
  accessoriesToEngravings,
  diffEngravings,
  sumEngravings,
  sumStats,
} from "./utils";

const SAVE_KEY = "calculatorSave";

const newAccessory = (): PartialAccessory => ({
  stat1: {},
  stat2: {},
  engraving1: {},
  engraving2: {},
  engraving3: {},
});

export class EngravingCalculator {
  goal: Partial<Engraving>[] = [
    { value: 15 },
    { value: 15 },
    { value: 15 },
    { value: 15 },
    { value: 15 },
  ];
  equipped1: Partial<Engraving> = { value: 12 };
  equipped2: Partial<Engraving> = { value: 12 };
  stone1: Partial<Engraving> = {};
  stone2: Partial<Engraving> = {};
  stone3: Partial<Engraving> = {};

  accessories: PartialAccessory[] = [newAccessory()];

  shouldSave = false;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.saveData,
      () => {
        this.shouldSave = true;
      }
    );
  }

  addGoal = () => {
    this.goal.push({ value: 5 });
  };

  addAccessory = () => {
    this.accessories.push(newAccessory());
  };

  removeAccessory = (index: number) => {
    this.accessories.splice(index, 1);
  };

  updateAccessory = (
    accessory: PartialAccessory,
    {
      slot,
      price,
      owned,
    }: { slot?: string; price?: number | null; owned?: boolean }
  ) => {
    if (typeof slot !== "undefined") {
      accessory.slot = slot as AccessorySlot;
    }
    if (typeof price !== "undefined") {
      accessory.price = price !== null ? price : undefined;
    }
    if (typeof owned !== "undefined") {
      accessory.owned = owned;
    }
  };

  updateStat = (
    stat: Partial<StatValue>,
    { name, value }: { name?: string; value?: number | null }
  ) => {
    if (typeof name !== "undefined") {
      stat.name = name as Stat;
    }
    if (typeof value !== "undefined") {
      stat.value = value || undefined;
    }
  };

  updateEngraving = (
    engraving: Partial<Engraving>,
    { name, value }: { name?: string | null; value?: number }
  ) => {
    if (typeof name !== "undefined") {
      engraving.name = name || undefined;
    }
    if (typeof value !== "undefined") {
      engraving.value = value;
    }
  };

  get validAccessories() {
    return this.accessories.filter((accessory) => accessory.slot);
  }

  get ownedAccessories() {
    return this.validAccessories.filter(({ owned }) => owned);
  }

  get startingSum() {
    const engravings = [
      this.equipped1,
      this.equipped2,
      this.stone1,
      this.stone2,
      this.stone3,
    ].filter(isEngraving);
    return sumEngravings(engravings);
  }

  get startingNeeds() {
    const goal = this.goal.filter((engraving) => engraving.name) as Engraving[];
    // const goal = sumEngravings(this.goal as Engraving[]);
    return diffEngravings(goal, this.startingSum);
  }

  // TODO refactor with Engraving instead of number array
  get recommendations() {
    const start = Date.now();
    const startingNeeds = this.startingNeeds;
    const ownedAccessories = this.ownedAccessories;
    const accessories = [
      ...ownedAccessories
        .filter((accessory) => accessory.slot === AccessorySlot.Necklace)
        .slice(0, 1),
      ...ownedAccessories
        .filter((accessory) => accessory.slot === AccessorySlot.Earring)
        .slice(0, 2),
      ...ownedAccessories
        .filter((accessory) => accessory.slot === AccessorySlot.Ring)
        .slice(0, 2),
    ];
    console.log("recommendations worn accessories", accessories);
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
    const needsPoints = needsArray.reduce((acc, item) => acc + item, 0);

    const minExtra = 2; // prevent overcapping engraving points
    const needsSlots = ACCESSORY_SLOTS - accessories.length;
    const validCombos = VALID_COMBOS.filter(
      (combo) => combo.length < 2 || (combo[0] >= 3 && combo[1] >= 3)
    ); // filter out legendary
    // I'm dumb so just do recursion
    const findCombo = (needsArray: number[], slots: number[][]) => {
      if (slots.length === needsSlots) {
        if (needsArray.every((need) => need <= 0)) {
          combinations.push(slots);
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
      findCombo(needsArray, []);
    }
    console.log("recommendations combinations", combinations);

    const recommendedCombosSet = new Set();
    combinations.forEach((slots) => {
      slots.forEach((slot) => {
        if (slot.length) {
          recommendedCombosSet.add(slot.join(","));
        }
      });
    });
    console.log("recommendations recommendedCombosSet", recommendedCombosSet);

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
      if (diff === 0) {
        if (b[1].name < a[1].name) {
          diff += 1;
        }
        if (b[1].name > a[1].name) {
          diff -= 1;
        }
      }
      return diff;
    });
    console.log("recommendations recommendedCombos", recommendedCombos);
    console.log("recommendations took", Date.now() - start, "ms");
    return recommendedCombos;
  }

  get builds() {
    const start = Date.now();

    const startingSum = this.startingSum;
    const startingNeeds = this.startingNeeds;
    const validAccessories = this.validAccessories;
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
  }

  get saveData() {
    return JSON.stringify({
      goal: this.goal,
      equipped1: this.equipped1,
      equipped2: this.equipped2,
      stone1: this.stone1,
      stone2: this.stone2,
      stone3: this.stone3,
      accessories: this.accessories,
    });
  }

  set saveData(data: string) {
    const payload = JSON.parse(data);
    this.goal = payload.goal;
    this.equipped1 = payload.equipped1;
    this.equipped2 = payload.equipped2;
    this.stone1 = payload.stone1;
    this.stone2 = payload.stone2;
    this.stone3 = payload.stone3;
    this.accessories = payload.accessories;
  }

  save = () => {
    if (this.shouldSave) {
      console.log("Save");
      localStorage.setItem(SAVE_KEY, this.saveData);
      this.shouldSave = false;
    }
  };

  load = () => {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
      this.saveData = data;
    }
  };
}
