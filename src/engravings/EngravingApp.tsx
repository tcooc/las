import { useEffect } from "react";
import { EngravingCalculator } from "@/models";
import { EngravingForm } from "@/engravings/EngravingForm";
import { EngravingMenu } from "@/engravings/EngravingMenu";
import { Box } from "@mui/material";

const store = new EngravingCalculator();
try {
  (window as any).store = store; // debug
} catch (e) {}

const createWorker = () => {
  const worker = new Worker(
    /* webpackChunkName: "worker" */ new URL("../worker.ts", import.meta.url)
  );
  return worker;
};

export const EngravingApp = () => {
  useEffect(() => {
    const worker = createWorker();
    store.registerWorker(worker);
    return () => worker.terminate();
  }, []);

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
      <Box sx={{ marginBottom: 4 }} />
    </>
  );
};
