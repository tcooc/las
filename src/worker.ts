/* eslint-disable no-restricted-globals */
import { getPossibleStone, getRecommendationsBase } from "./models/helpers";

const METHOD_MAP: Record<string, Function> = {
  getPossibleStone: getPossibleStone,
  getRecommendationsBase: getRecommendationsBase,
};

self.onmessage = (message) => {
  const { requestId, method, args } = JSON.parse(message.data);
  console.log("worker.onmessage", requestId, method, args);
  self.postMessage(
    JSON.stringify({
      requestId,
      result: METHOD_MAP[method].apply(null, args),
    })
  );
};
