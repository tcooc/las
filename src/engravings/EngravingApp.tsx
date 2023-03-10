import { useEffect } from "react";
import { EngravingCalculator } from "../models";
import { EngravingForm } from "./EngravingForm";
import { EngravingMenu } from "./EngravingMenu";

const store = new EngravingCalculator();
(window as any).store = store; // debug

export const EngravingApp = () => {
  useEffect(() => {
    const saveData = store.load();
    if (saveData) {
      store.saveData = saveData;
    }
    const accountStats = store.loadAccountStats();
    if (accountStats) {
      store.accountStats = JSON.parse(accountStats);
    }
    const saveInterval = setInterval(store.save, 5000);
    return () => clearInterval(saveInterval);
  }, []);

  return (
    <>
      <EngravingForm store={store} />
      <EngravingMenu store={store} />
    </>
  );
};
