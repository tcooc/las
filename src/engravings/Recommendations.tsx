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
  ({ store }: { store: EngravingCalculator }) => (
    <div>
      <Typography>
        Starting point: {engravingsToString(store.startingSum)}
      </Typography>
      <Typography>
        Needed on accessories: {engravingsToString(store.startingNeeds)}
      </Typography>
      <Typography>
        Equipped on accessories:{" "}
        {engravingsToString(
          sumEngravings(accessoriesToEngravings(store.equippedAccessories))
        )}
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
        >
          <Typography variant="caption" component="span">
            ?
          </Typography>
        </Tooltip>
      </Typography>
      {(store.equippedAccessories.filter(
        ({ slot }) => slot === AccessorySlot.Necklace
      ).length > 1 ||
        store.equippedAccessories.filter(
          ({ slot }) => slot === AccessorySlot.Earring
        ).length > 2 ||
        store.equippedAccessories.filter(
          ({ slot }) => slot === AccessorySlot.Ring
        ).length > 2) && (
        <Typography color="error">Too many accessories equipped</Typography>
      )}
      {store.recommendations.length ? (
        <List>
          {store.recommendations.map((combo) => {
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
                <Typography>{text}</Typography>
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
        <Typography>(Empty)</Typography>
      )}
    </div>
  )
);
