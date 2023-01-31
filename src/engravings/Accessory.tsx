import { Typography, Button, Paper } from "@mui/material";
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

    const handleOwnedChange = (owned: boolean) => {
      store.updateAccessory(accessory, { owned });
    };

    const handleRemove = () => {
      store.removeAccessory(index);
    };

    return (
      <Paper
        sx={{
          marginTop: 1,
          marginBottom: 1,
          display: show ? undefined : "none",
        }}
      >
        <Typography variant="h6" color={accessory.slot ? "primary" : "error"}>
          Accessory {index + 1}
          {accessory.slot ? "" : " (invalid)"}
        </Typography>
        <div>
          <SlotPicker
            value={accessory.slot}
            onChange={handleSlotChange(accessory)}
          />
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
        </div>
        <div>
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
        </div>
        <div>
          <CheckboxField
            label="Owned"
            checked={accessory.owned}
            onChange={handleOwnedChange}
          />
          <StatInput
            label="Price"
            value={accessory.price}
            onChange={handlePriceChange(accessory)}
          />
          <Button onClick={handleRemove}>Remove</Button>
        </div>
      </Paper>
    );
  }
);
