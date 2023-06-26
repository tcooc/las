import { Typography, List, ListItem, Button, Tooltip } from "@mui/material";
import { observer } from "mobx-react-lite";
import { CLASS_ENGRAVINGS } from "../data";
import {
  accessoriesToEngravings,
  AccessorySlot,
  EngravingCalculator,
  engravingsToString,
  sumEngravings,
} from "../models";

export const Recommendations = observer(
  ({ store }: { store: EngravingCalculator }) => {
    const minimumStone = store.possibleStones.length
      ? store.possibleStones.map(([s0, s1]) => `${s0}/${s1}`).join(", ")
      : "(none)";
    const startingSum = store.startingSum.length
      ? engravingsToString(store.startingSum)
      : "(none)";
    const startingNeeds = store.startingNeeds.length
      ? engravingsToString(store.startingNeeds)
      : "(none)";
    const equippedEngravings = sumEngravings(
      accessoriesToEngravings(store.equippedAccessories)
    );
    const equipped = equippedEngravings.length
      ? engravingsToString(equippedEngravings)
      : "(none)";
    const tooManyEquipped =
      store.equippedAccessories.filter(
        ({ slot }) => slot === AccessorySlot.Necklace
      ).length > 1 ||
      store.equippedAccessories.filter(
        ({ slot }) => slot === AccessorySlot.Earring
      ).length > 2 ||
      store.equippedAccessories.filter(
        ({ slot }) => slot === AccessorySlot.Ring
      ).length > 2;

    return (
      <div>
        <Typography>
          <b>Minimum viable stones:</b> <span>{minimumStone}</span>
        </Typography>
        <Typography>
          <b>Starting point:</b> <span>{startingSum}</span>
        </Typography>
        <Typography>
          <b>Needed on accessories:</b> <span>{startingNeeds}</span>
        </Typography>
        <Typography>
          <b>Equipped on accessories:</b> <span>{equipped}</span>
        </Typography>
        <Typography variant="h5" gutterBottom>
          Combinations{" "}
          <Tooltip
            title={
              <List dense disablePadding>
                <ListItem>* Ignore legendary combo</ListItem>
                <ListItem>* Using equipped accessories</ListItem>
                <ListItem>* Start with class accessory (recommended)</ListItem>
              </List>
            }
            sx={{ cursor: "pointer" }}
          >
            <Typography variant="caption" component="span">
              ?
            </Typography>
          </Tooltip>
        </Typography>
        {tooManyEquipped && (
          <Typography color="error">Too many accessories equipped</Typography>
        )}
        {store.recommendationsRequest.result ? (
          store.recommendationsRequest.result.length ? (
            <List>
              {store.recommendationsRequest.result.map((combo) => {
                const isClass = combo.some(({ name }) =>
                  CLASS_ENGRAVINGS.includes(name)
                );
                const text = combo
                  .reduce((acc, engraving) => {
                    acc.push(`${engraving.name} ${engraving.value}`);
                    return acc;
                  }, [] as string[])
                  .join(" / ");
                const buildAccessory = () => {
                  const accessory: Parameters<typeof store.addAccessory>[0] = {
                    equipped: true,
                  };
                  if (combo.length >= 1) {
                    accessory.engraving1 = combo[0];
                  }
                  if (combo.length >= 2) {
                    accessory.engraving2 = combo[1];
                  }
                  return accessory;
                };
                return (
                  <ListItem
                    key={text}
                    sx={{ color: isClass ? "primary.main" : undefined }}
                  >
                    <Typography
                      sx={{
                        flex: { xs: 1, md: "unset" },
                      }}
                    >
                      {text}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        marginLeft: 1,
                      }}
                      onClick={() => store.addAccessory(buildAccessory())}
                    >
                      Add
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography>(none)</Typography>
          )
        ) : (
          <Typography>Calculating...</Typography>
        )}
      </div>
    );
  }
);
