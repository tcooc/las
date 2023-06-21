import { autorun, makeAutoObservable, reaction, runInAction } from "mobx";
import {
  AccessorySlot,
  CalculatorCache,
  Engraving,
  isEngraving,
  PartialAccessory,
  Stat,
  StatValue,
} from ".";
import { diffEngravings, sumEngravings } from "./utils";
import { getBuilds, getPossibleStones, getRecommendations } from "./helpers";

export const SAVE_KEY = "calculatorSave";
export const ACCOUNT_STATS_KEY = "accountStats";

export interface SaveData {
  goal: EngravingCalculator["goal"];
  equipped1: EngravingCalculator["equipped1"];
  equipped2: EngravingCalculator["equipped2"];
  stone1: EngravingCalculator["stone1"];
  stone2: EngravingCalculator["stone2"];
  stone3: EngravingCalculator["stone3"];
  accessories: EngravingCalculator["accessories"];
}

const newAccessory = (): PartialAccessory => ({
  stat1: {},
  stat2: {},
  engraving1: {},
  engraving2: {},
  engraving3: {},
});

export class EngravingCalculator {
  // saved to calculator
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

  // saved to user
  private _accountStats = {
    [Stat.Crit]: 0,
    [Stat.Spec]: 0,
    [Stat.Swift]: 0,
  };

  // not saved
  shouldSave = false;
  includeAncient = true;

  recommendationCache = new CalculatorCache<
    {
      startingNeeds: Engraving[];
      accessories: PartialAccessory[];
      includeAncient: boolean;
      firstOnly: boolean;
    },
    Engraving[][]
  >();

  workers: Worker[] = [];
  recommendationsRequest: Partial<{
    requestId: string;
    cacheKey: any; // todo type
    result: Engraving[][];
  }> = {};

  constructor(observable: boolean = true) {
    if (observable) {
      makeAutoObservable(this);
      autorun(() => {
        const cacheKey = {
          startingNeeds: this.startingNeeds,
          accessories: this.equippedAccessories,
          includeAncient: this.includeAncient,
          firstOnly: false,
        };
        const cachedResult = this.recommendationCache.get(cacheKey);
        if (cachedResult) {
          this.recommendationsRequest.result = cachedResult;
        } else if (
          !this.recommendationCache.equals(
            cacheKey,
            this.recommendationsRequest.cacheKey
          )
        ) {
          this.recommendationsRequest.requestId = getRecommendations(
            this.workers,
            this.startingNeeds,
            this.equippedAccessories,
            this.includeAncient
          );
          this.recommendationsRequest.cacheKey = cacheKey;
          this.recommendationsRequest.result = undefined;
        }
      });
      reaction(
        () => this.saveData,
        () => {
          this.shouldSave = true;
        }
      );
    }
  }

  addGoal = () => {
    this.goal.push({ value: 5 });
  };

  addAccessory = (accessory?: Partial<PartialAccessory>) => {
    this.accessories.push({ ...newAccessory(), ...accessory });
  };

  removeAccessory = (index: number) => {
    this.accessories.splice(index, 1);
  };

  updateAccessory = (
    accessory: PartialAccessory,
    {
      slot,
      price,
      equipped,
    }: { slot?: string; price?: number | null; equipped?: boolean }
  ) => {
    if (typeof slot !== "undefined") {
      accessory.slot = slot as AccessorySlot;
    }
    if (typeof price !== "undefined") {
      accessory.price = price !== null ? price : undefined;
    }
    if (typeof equipped !== "undefined") {
      accessory.equipped = equipped;
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
    return this.accessories.filter(({ slot }) => slot);
  }

  get equippedAccessories() {
    return this.accessories.filter(({ equipped }) => equipped);
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

  get possibleStones() {
    return getPossibleStones(
      this.workers,
      this.goal,
      this.equipped1,
      this.equipped2,
      this.stone1,
      this.stone2,
      this.includeAncient
    );
  }

  get builds() {
    return getBuilds(
      this.startingSum,
      this.startingNeeds,
      this.validAccessories
    );
  }

  get saveData() {
    const save: SaveData = {
      goal: this.goal,
      equipped1: this.equipped1,
      equipped2: this.equipped2,
      stone1: this.stone1,
      stone2: this.stone2,
      stone3: this.stone3,
      accessories: this.accessories,
    };
    return JSON.stringify(save);
  }

  set saveData(data: string) {
    const payload: SaveData = JSON.parse(data);
    this.goal = payload.goal.filter(({ name }) => name);
    this.equipped1 = payload.equipped1;
    this.equipped2 = payload.equipped2;
    this.stone1 = payload.stone1;
    this.stone2 = payload.stone2;
    this.stone3 = payload.stone3;
    this.accessories = payload.accessories;
  }

  save = (saveKey?: string, force?: boolean) => {
    if (this.shouldSave || force) {
      console.log("Save");
      localStorage.setItem(saveKey || SAVE_KEY, this.saveData);
      this.shouldSave = false;
    }
  };

  load = (saveKey?: string) => {
    return localStorage.getItem(saveKey || SAVE_KEY);
  };

  get accountStats() {
    return this._accountStats;
  }

  set accountStats(accountStats: EngravingCalculator["_accountStats"]) {
    this._accountStats = accountStats;
    localStorage.setItem(ACCOUNT_STATS_KEY, JSON.stringify(accountStats));
  }

  loadAccountStats = () => {
    return localStorage.getItem(ACCOUNT_STATS_KEY);
  };

  // worker stuff

  handleMessage = (message: MessageEvent) => {
    const { requestId, result } = JSON.parse(message.data);
    if (requestId === this.recommendationsRequest.requestId) {
      message.stopPropagation();
      console.log("EngravingCalculator.onmessage", requestId, result);
      runInAction(() => {
        this.recommendationCache.put(
          this.recommendationsRequest.cacheKey,
          result
        );
        this.recommendationsRequest.result = result;
      });
    }
  };

  registerWorker(worker: Worker) {
    worker.addEventListener("message", this.handleMessage);
    this.workers.push(worker);
  }
}
