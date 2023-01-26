import { Engraving } from "./engravings";

export enum Stat {
  Crit = "Crit",
  Spec = "Specialization",
  Swift = "Swiftness",
}

export interface StatValue {
  name: Stat;
  value: number;
}

export enum AccessorySlot {
  Necklace = "Necklace",
  Earring = "Earring",
  Ring = "Ring",
}

export interface PartialAccessory {
  slot?: AccessorySlot;
  stat1: Partial<StatValue>;
  stat2: Partial<StatValue>;
  engraving1: Partial<Engraving>;
  engraving2: Partial<Engraving>;
  engraving3: Partial<Engraving>;

  price?: number;
  owned?: boolean;
}

export interface Accessory extends PartialAccessory {
  slot: AccessorySlot;
  stat1: StatValue;
  stat2: Partial<StatValue>; // 2nd stat is optional
  engraving1: Engraving;
  engraving2: Engraving;
  engraving3: Engraving;

  bid: number;
  buyout?: number;
}

export const isStat = (stat: Partial<StatValue>): stat is StatValue =>
  !!(stat.name && stat.value);
