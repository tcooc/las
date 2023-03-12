import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import {
  ChangeEvent,
  FunctionComponent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { EngravingCalculator, SaveData, SAVE_KEY } from "../models";

const SAVE_SLOTS = 5;

export interface SaveDialogProps {
  open: boolean;
  close: () => void;
  store: EngravingCalculator;
}

export const SaveDialog: FunctionComponent<SaveDialogProps> = observer(
  ({ open, close, store }) => {
    const [saveSlots, setSaveSlots] = useState<SaveData[]>([]);

    const loadSlot = useCallback(
      (index: number) => store.load(`${SAVE_KEY}-${index}`),
      [store]
    );

    const loadSaveSlots = useCallback(() => {
      const slots = [];
      for (let i = 0; i < SAVE_SLOTS; i++) {
        const saveData = loadSlot(i);
        slots.push(saveData ? JSON.parse(saveData) : {});
      }
      setSaveSlots(slots);
    }, [loadSlot]);

    useEffect(() => {
      loadSaveSlots();
    }, [loadSaveSlots]);

    const onSave = (index: number) => {
      store.save(`${SAVE_KEY}-${index}`, true);
      loadSaveSlots();
    };

    const onLoad = (index: number) => {
      const saveData = loadSlot(index);
      if (saveData) {
        store.saveData = saveData;
        close();
      }
    };

    const onChange = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
      try {
        const value = atob(currentTarget.value);
        if (value.endsWith("}")) {
          store.saveData = value;
          close();
        }
      } catch (e) {
        console.error(e);
      }
    };

    return (
      <Dialog open={open} onClose={close}>
        <DialogTitle>Save slots</DialogTitle>
        <DialogContent>
          <List dense>
            {saveSlots.map((slot, index) => (
              <ListItem key={index}>
                <Typography>{index + 1}</Typography>
                <Button
                  onClick={() => onSave(index)}
                  title="Save current build to slot"
                >
                  Save
                </Button>
                <Button onClick={() => onLoad(index)} title="Load saved build">
                  Load
                </Button>
                <Typography>
                  {Object.keys(slot).length
                    ? slot.goal
                        .reduce((acc, { name }) => {
                          if (name) {
                            acc.push(name);
                          }
                          return acc;
                        }, [] as string[])
                        .join(", ")
                    : "(empty)"}
                </Typography>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex" }}>
            <div>
              Copy save data
              <input
                onChange={() => {}}
                onClick={({ currentTarget }: MouseEvent<HTMLInputElement>) =>
                  currentTarget.select()
                }
                value={btoa(store.saveData)}
              />
            </div>
            <div>
              Paste save data
              <input onChange={onChange} value="" />
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
);
