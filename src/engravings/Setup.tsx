import { Typography, Button, Grid, FormControl } from "@mui/material";
import { POINTS_EQUIP, LEVELS, MAX_ENGRAVINGS, POINTS_STONE } from "@/data";
import { observer } from "mobx-react-lite";
import {
  CheckboxField,
  EngravingPicker,
  EngravingPickerType,
  PointsPicker,
} from "@/engravings/fields";
import { EngravingCalculator, Engraving, getKey } from "@/models";

export const Setup = observer(({ store }: { store: EngravingCalculator }) => {
  const handleEngravingChange =
    (engraving: Partial<Engraving>) => (name: string | null) => {
      store.updateEngraving(engraving, { name });
    };

  const handleEngravingValueChange =
    (engraving: Partial<Engraving>) => (value: number) => {
      store.updateEngraving(engraving, { value });
    };

  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <Typography variant="h5" gutterBottom>
          Build Goal
        </Typography>
        <Grid container item xs={12}>
          {store.goal.map((goal, index) => (
            <Grid
              key={getKey(goal)}
              item
              xs={12}
              sx={{
                display: "flex",
              }}
            >
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
            </Grid>
          ))}
          <Grid item xs={12}>
            {store.goal.length < MAX_ENGRAVINGS && (
              <Button onClick={store.addGoal}>Add</Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography variant="h5" gutterBottom>
          Starting Point
        </Typography>
        <Grid container item xs={12}>
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
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
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
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
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
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
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
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
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
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
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <CheckboxField
                label="Include Ancient"
                checked={store.includeAncient}
                onChange={(value) => (store.includeAncient = value)}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});
