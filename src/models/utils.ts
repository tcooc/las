import { Engraving, isEngraving, isStat, PartialAccessory, StatValue } from ".";

const keyCache: { obj: WeakRef<object>; key: string }[] = [];

export const getKey = (obj: object) => {
  const hit = keyCache.find((item) => obj === item.obj.deref());
  if (hit) {
    return hit.key;
  }
  const key = `${Date.now()}-${Math.random()}`;
  keyCache.push({ obj: new WeakRef(obj), key });
  return key;
};

export const sumEngravings = (engravings: Engraving[]) => {
  return engravings.reduce((acc, engraving) => {
    const index = acc.findIndex((e) => e.name === engraving.name);
    if (index === -1) {
      acc.push({ ...engraving });
    } else {
      acc[index].value += engraving.value;
    }
    return acc;
  }, [] as Engraving[]);
};

export const diffEngravings = (goal: Engraving[], toRemove: Engraving[]) => {
  const result: Engraving[] = goal.map((engraving) => ({ ...engraving }));
  toRemove.forEach((engraving) => {
    const index = result.findIndex((e) => e.name === engraving.name);
    if (index > -1) {
      result[index].value = Math.max(result[index].value - engraving.value, 0);
    }
  });
  return result.filter((engraving) => engraving.value > 0);
};

export const engravingsToString = (engravings: Engraving[]) =>
  engravings
    .sort((a, b) => (b.name > a.name ? 1 : -1))
    .map(({ name, value }) => `${name} = ${value}`)
    .join(", ");

/**
 *
 * @param accessories accessories to sum
 * @returns stats sorted desc
 */
export const sumStats = (accessories: PartialAccessory[]) =>
  accessories
    .reduce((acc, accessory) => {
      if (isStat(accessory.stat1)) {
        acc.push(accessory.stat1);
      }
      if (isStat(accessory.stat2)) {
        acc.push(accessory.stat2);
      }
      return acc;
    }, [] as StatValue[])
    .reduce((acc, stat) => {
      const index = acc.findIndex((s) => s.name === stat.name);
      if (index === -1) {
        acc.push({ ...stat });
      } else {
        acc[index].value += stat.value;
      }
      return acc;
    }, [] as StatValue[])
    .sort((a, b) => b.value - a.value);

export const accessoryToEngravings = (accessory: PartialAccessory) => {
  const engravings: Engraving[] = [];
  if (isEngraving(accessory.engraving1)) {
    engravings.push(accessory.engraving1);
  }
  if (isEngraving(accessory.engraving2)) {
    engravings.push(accessory.engraving2);
  }
  if (isEngraving(accessory.engraving3)) {
    engravings.push(accessory.engraving3);
  }
  return engravings;
};

export const accessoriesToEngravings = (accessories: PartialAccessory[]) =>
  accessories
    .reduce((acc, accessory) => {
      Array.prototype.push.apply(acc, accessoryToEngravings(accessory));
      return acc;
    }, [] as Partial<Engraving>[])
    .filter(isEngraving);

export const accessoryToString = (accessory: PartialAccessory) =>
  `${accessory.slot} ${engravingsToString(accessoryToEngravings(accessory))} ${
    accessory.stat1.name || ""
  } ${accessory.stat1.value || ""} ${accessory.stat2.name || ""} ${
    accessory.stat2.value || ""
  }`.trim();
