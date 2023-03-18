import { Container, Typography, Button, Grid } from "@mui/material";
import { POINTS_EQUIP, LEVELS, MAX_ENGRAVINGS, POINTS_STONE } from "../data";
import { observer } from "mobx-react-lite";
import { Accessories } from "./Accessories";
import { EngravingPicker, EngravingPickerType, PointsPicker } from "./fields";
import { EngravingCalculator, Engraving, getKey } from "../models";
import { Recommendations } from "./Recommendations";

export const EngravingForm = observer(
  ({ store }: { store: EngravingCalculator }) => {
    const handleEngravingChange =
      (engraving: Partial<Engraving>) => (name: string | null) => {
        store.updateEngraving(engraving, { name });
      };

    const handleEngravingValueChange =
      (engraving: Partial<Engraving>) => (value: number) => {
        store.updateEngraving(engraving, { value });
      };

    return (
      <Container>
        <Grid container>
          <Grid item md={4}>
            <Typography variant="h5" gutterBottom>
              Build Goal
            </Typography>
            {store.goal.map((goal, index) => (
              <div key={getKey(goal)}>
                <EngravingPicker
                  label={`Engraving ${index + 1}`}
                  value={goal.name}
                  onChange={handleEngravingChange(goal)}
                />
                <PointsPicker
                  label="Points"
                  options={LEVELS}
                  value={goal.value}
                  onChange={handleEngravingValueChange(goal)}
                />
              </div>
            ))}
            {store.goal.length < MAX_ENGRAVINGS && (
              <Button onClick={store.addGoal}>Add</Button>
            )}
          </Grid>
          <Grid item md={8}>
            <Typography variant="h5" gutterBottom>
              Starting Point
            </Typography>
            <div>
              <EngravingPicker
                label={"Equipped 1"}
                value={store.equipped1.name}
                onChange={handleEngravingChange(store.equipped1)}
              />
              <PointsPicker
                label="Points"
                options={POINTS_EQUIP}
                value={store.equipped1.value}
                onChange={handleEngravingValueChange(store.equipped1)}
              />
              <EngravingPicker
                label={"Equipped 2"}
                value={store.equipped2.name}
                onChange={handleEngravingChange(store.equipped2)}
              />
              <PointsPicker
                label="Points"
                options={POINTS_EQUIP}
                value={store.equipped2.value}
                onChange={handleEngravingValueChange(store.equipped2)}
              />
            </div>
            <div>
              <EngravingPicker
                label={"Stone 1"}
                type={EngravingPickerType.Battle}
                value={store.stone1.name}
                onChange={handleEngravingChange(store.stone1)}
              />
              <PointsPicker
                label="Points"
                options={POINTS_STONE}
                value={store.stone1.value}
                onChange={handleEngravingValueChange(store.stone1)}
              />
              <EngravingPicker
                label={"Stone 2"}
                type={EngravingPickerType.Battle}
                value={store.stone2.name}
                onChange={handleEngravingChange(store.stone2)}
              />
              <PointsPicker
                label="Points"
                options={POINTS_STONE}
                value={store.stone2.value}
                onChange={handleEngravingValueChange(store.stone2)}
              />
              <EngravingPicker
                label={"Curse"}
                type={EngravingPickerType.Curse}
                value={store.stone3.name}
                onChange={handleEngravingChange(store.stone3)}
              />
              <PointsPicker
                label="Points"
                options={POINTS_STONE}
                value={store.stone3.value}
                onChange={handleEngravingValueChange(store.stone3)}
              />
            </div>
          </Grid>
        </Grid>
        <Accessories store={store} />
        <Recommendations store={store} />
      </Container>
    );
  }
);
