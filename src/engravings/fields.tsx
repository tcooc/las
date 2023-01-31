import {
  Autocomplete,
  FormControl,
  InputLabel,
  styled,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { BATTLE_ENGRAVINGS, CURSES, ENGRAVINGS, SLOTS, STATS } from "../data";

export const EngravingFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 200,
}));

export enum EngravingPickerType {
  All,
  Battle,
  Curse,
}

export const EngravingPicker = ({
  label,
  type = EngravingPickerType.All,
  value,
  onChange,
}: {
  label: string;
  type?: EngravingPickerType;
  value?: string;
  onChange: (value: string | null) => void;
}) => (
  <EngravingFormControl>
    <Autocomplete
      size="small"
      options={
        {
          [EngravingPickerType.All]: ENGRAVINGS,
          [EngravingPickerType.Battle]: BATTLE_ENGRAVINGS,
          [EngravingPickerType.Curse]: CURSES,
        }[type]
      }
      renderInput={(params) => <TextField {...params} label={label} />}
      value={value || null}
      onChange={(_event, value) => onChange(value)}
    ></Autocomplete>
  </EngravingFormControl>
);

export const PointsPicker = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: number[];
  value?: number;
  onChange: (value: number) => void;
}) => (
  <EngravingFormControl sx={{ minWidth: 120 }}>
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      variant="outlined"
      size="small"
      value={typeof value !== "undefined" ? value : ""}
      onChange={(event) => onChange(+event.target.value)}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </EngravingFormControl>
);

export const SlotPicker = ({
  label = "Slot",
  value,
  onChange,
}: {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
}) => (
  <EngravingFormControl>
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      variant="outlined"
      size="small"
      value={typeof value !== "undefined" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
    >
      {SLOTS.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </EngravingFormControl>
);

export const StatPicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) => (
  <EngravingFormControl>
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      variant="outlined"
      size="small"
      value={typeof value !== "undefined" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {STATS.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </EngravingFormControl>
);

export const StatInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (value: number | null) => void;
}) => (
  <EngravingFormControl>
    <TextField
      label={label}
      type="number"
      size="small"
      value={typeof value !== "undefined" ? value : ""}
      onChange={(event) =>
        onChange(event.target.value === "" ? null : +event.target.value)
      }
    />
  </EngravingFormControl>
);

export const CheckboxField = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked?: boolean;
  onChange: (value: boolean) => void;
}) => (
  <EngravingFormControl>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={!!checked}
          onChange={(event) => onChange(event.target.checked)}
        />
      }
      label={label}
    />
  </EngravingFormControl>
);
