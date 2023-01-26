export interface Engraving {
  name: string;
  value: number;
}

export const isEngraving = (
  engraving: Partial<Engraving>
): engraving is Engraving => !!(engraving.name && engraving.value);
