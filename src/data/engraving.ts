import { AccessorySlot, Stat } from "../models";

export const CLASS_ENGRAVINGS = [
  "Grace of the Empress",
  "Order of the Emperor",
  "Barrage Enhancement",
  "Firepower Enhancement",
  "Desperate Salvation",
  "True Courage",
  "Berserker Technique",
  "Mayhem",
  "Enhanced Weapon",
  "Pistoleer",
  "Remaining Energy",
  "Surge",
  "Gravity Training",
  "Rage Hammer",
  "Control",
  "Pinnacle",
  "Combat Readiness",
  "Lone Knight",
  "Peacemaker",
  "Time to Hunt",
  "Arthetinean Skill",
  "Evolutionary Legacy",
  "Blessed Aura",
  "Judgment",
  "Hunger",
  "Lunar Voice",
  "Shock Training",
  "Ultimate Skill: Taijutsu",
  "Demonic Impulse",
  "Perfect Suppression",
  "Death Strike",
  "Loyal Companion",
  "Igniter",
  "Reflux",
  "Energy Overflow",
  "Robust Spirit",
  "Deathblow",
  "Esoteric Flurry",
  "Esoteric Skill Enhancement",
  "First Intention",
  "Full Bloom",
  "Recurrence",
  "Predator",
  "Punisher",
];

export const BATTLE_ENGRAVINGS = [
  "Adrenaline",
  "All-Out Attack",
  "Ambush Master",
  "Awakening",
  "Barricade",
  "Cursed Doll",
  "Drops of Ether",
  "Ether Predator",
  "Expert",
  "Grudge",
  "Heavy Armor",
  "Hit Master",
  "Keen Blunt Weapon",
  "Mass Increase",
  "Master Brawler",
  "Master's Tenacity",
  "Precise Dagger",
  "Raid Captain",
  "Spirit Absorption",
  "Stabilized Status",
  "Super Charge",
  "Vital Point Hit",
];

export const CURSES = [
  "Atk. Power Reduction",
  "Atk. Speed Reduction",
  "Defense Reduction",
  "Move Speed Reduction",
];

export const ENGRAVINGS = [...BATTLE_ENGRAVINGS, ...CLASS_ENGRAVINGS];

export const MAX_ENGRAVINGS = 6;
export const LEVELS = [5, 10, 15];
export const POINTS_EQUIP = [3, 6, 9, 12];
export const POINTS_STONE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const POINTS_ACC1 = [3, 4, 5, 6];
export const POINTS_ACC2 = [2, 3];
export const POINTS_ACC3 = [1, 2, 3];
export const SLOTS = [
  AccessorySlot.Necklace,
  AccessorySlot.Earring,
  AccessorySlot.Ring,
];
export const STATS = [Stat.Crit, Stat.Spec, Stat.Swift];
