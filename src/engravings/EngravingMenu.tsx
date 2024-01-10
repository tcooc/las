import {
  Box,
  Dialog,
  DialogContent,
  Fab,
  FormControl,
  TextField,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { EngravingCalculator, Stat } from "@/models";
import { SaveDialog } from "@/engravings/SaveDialog";

export const EngravingMenu = observer(
  ({ store }: { store: EngravingCalculator }) => {
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [accountStatsOpen, setAccountStatsOpen] = useState(false);

    const handleAccountStatChange =
      (stat: Stat) =>
      ({ target }: ChangeEvent<HTMLInputElement>) => {
        const value = target.value ? parseInt(target.value) : 0;
        if (isFinite(value)) {
          store.accountStats = {
            ...store.accountStats,
            [stat]: value,
          };
        }
      };

    return (
      <>
        <Box
          sx={{
            position: "fixed",
            display: "flex",
            flexDirection: {
              xs: "row",
              md: "column",
            },
            gap: 1,
            top: {
              xs: "unset",
              md: 16,
            },
            left: {
              xs: "unset",
              md: 16,
            },
            bottom: {
              xs: 16,
              md: "unset",
            },
            right: {
              xs: 16,
              md: "unset",
            },
          }}
        >
          <Fab onClick={() => setSaveDialogOpen(true)}>Save</Fab>
          <Fab onClick={() => setAccountStatsOpen(true)}>Stats</Fab>
        </Box>
        <SaveDialog
          open={saveDialogOpen}
          close={() => setSaveDialogOpen(false)}
          store={store}
        />
        <Dialog
          open={accountStatsOpen}
          onClose={() => setAccountStatsOpen(false)}
        >
          <DialogContent>
            <FormControl>
              <TextField
                label={Stat.Crit}
                type="number"
                value={store.accountStats[Stat.Crit]}
                onChange={handleAccountStatChange(Stat.Crit)}
              />
            </FormControl>
            <FormControl>
              <TextField
                label={Stat.Spec}
                type="number"
                value={store.accountStats[Stat.Spec]}
                onChange={handleAccountStatChange(Stat.Spec)}
              />
            </FormControl>
            <FormControl>
              <TextField
                label={Stat.Swift}
                type="number"
                value={store.accountStats[Stat.Swift]}
                onChange={handleAccountStatChange(Stat.Swift)}
              />
            </FormControl>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);
