import { EngravingCalculator } from "../models";
import { EngravingForm } from "./EngravingForm";

const store = new EngravingCalculator();
(window as any).store = store; // debug

export const EngravingApp = () => {
  return <EngravingForm store={store} />;
};
