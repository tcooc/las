import { Typography, Button, Paper, Grid } from "@mui/material";
import { POINTS_ACC1, POINTS_ACC2, POINTS_ACC3 } from "../data";
import {
  Engraving,
  PartialAccessory,
  StatValue,
  EngravingCalculator,
} from "../models";
import { observer } from "mobx-react-lite";
import {
  SlotPicker,
  StatPicker,
  StatInput,
  EngravingPicker,
  PointsPicker,
  EngravingPickerType,
  CheckboxField,
} from "./fields";

export interface AccessoryProps {
  index: number;
  accessory: PartialAccessory;
  store: EngravingCalculator;
  show: boolean;
}

export const Accessory = observer(
  ({ index, accessory, store, show }: AccessoryProps) => {
    const handleEngravingChange =
      (engraving: Partial<Engraving>) => (name: string | null) => {
        store.updateEngraving(engraving, { name });
      };

    const handleEngravingValueChange =
      (engraving: Partial<Engraving>) => (value: number) => {
        store.updateEngraving(engraving, { value });
      };

    const handleSlotChange =
      (accessory: PartialAccessory) => (slot: string) => {
        store.updateAccessory(accessory, { slot });
      };

    const handlePriceChange =
      (accessory: PartialAccessory) => (price: number | null) => {
        store.updateAccessory(accessory, {
          price,
        });
      };

    const handleStatChange = (stat: Partial<StatValue>) => (name: string) => {
      store.updateStat(stat, { name });
    };

    const handleStatValueChange =
      (stat: Partial<StatValue>) => (value: number | null) => {
        store.updateStat(stat, { value });
      };

    const handleEquippedChange = (equipped: boolean) => {
      store.updateAccessory(accessory, { equipped });
    };

    const handleRemove = () => {
      store.removeAccessory(index);
    };

    return (
      <Paper
        sx={{
          padding: 1,
          display: show ? undefined : "none",
        }}
      >
        <Typography variant="h6" color={accessory.slot ? "primary" : "error"}>
          Accessory {index + 1}
          {accessory.slot ? "" : " (slot needed for build search)"}
        </Typography>
        <Grid container>
          <Grid item container xs={12}>
            <Grid item xs={12} md={2} sx={{ display: "flex" }}>
              <SlotPicker
                value={accessory.slot}
                onChange={handleSlotChange(accessory)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: "flex",
              }}
            >
              <StatPicker
                label="Combat Stat 1"
                value={accessory.stat1.name}
                onChange={handleStatChange(accessory.stat1)}
              />
              <StatInput
                label="Stat"
                value={accessory.stat1.value}
                onChange={handleStatValueChange(accessory.stat1)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: "flex",
              }}
            >
              <StatPicker
                label="Combat Stat 2"
                value={accessory.stat2.name}
                onChange={handleStatChange(accessory.stat2)}
              />
              <StatInput
                label="Stat"
                value={accessory.stat2.value}
                onChange={handleStatValueChange(accessory.stat2)}
              />
            </Grid>
          </Grid>
          <Grid item container xs={12}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
              }}
            >
              <EngravingPicker
                label={"Engraving 1"}
                value={accessory.engraving1.name}
                onChange={handleEngravingChange(accessory.engraving1)}
              />
              <PointsPicker
                label="Points"
                options={POINTS_ACC1}
                value={accessory.engraving1.value}
                onChange={handleEngravingValueChange(accessory.engraving1)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
              }}
            >
              <EngravingPicker
                label={"Engraving 2"}
                value={accessory.engraving2.name}
                onChange={handleEngravingChange(accessory.engraving2)}
              />
              <PointsPicker
                label="Points"
                options={POINTS_ACC2}
                value={accessory.engraving2.value}
                onChange={handleEngravingValueChange(accessory.engraving2)}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
              }}
            >
              <EngravingPicker
                type={EngravingPickerType.Curse}
                label={"Curse"}
                value={accessory.engraving3.name}
                onChange={handleEngravingChange(accessory.engraving3)}
              />
              <PointsPicker
                label="Points"
                options={POINTS_ACC3}
                value={accessory.engraving3.value}
                onChange={handleEngravingValueChange(accessory.engraving3)}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex" }}>
            <CheckboxField
              label="Equipped"
              checked={accessory.equipped}
              onChange={handleEquippedChange}
            />
            <StatInput
              label="Price"
              value={accessory.price}
              onChange={handlePriceChange(accessory)}
            />
            <Button onClick={handleRemove}>Remove</Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
);
