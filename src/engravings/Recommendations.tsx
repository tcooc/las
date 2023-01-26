import { Typography, List, ListItem } from "@mui/material";
import { observer } from "mobx-react-lite";
import { EngravingCalculator, engravingsToString } from "../models";

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
        Engravings combinations (assumes using owned accessories, start with
        class, finish with 5/3 then lower):
      </Typography>
      {store.recommendations.length ? (
        <List>
          {store.recommendations.map((combo) => {
            const text = combo
              .reduce((acc, engraving) => {
                acc.push(`${engraving.name} ${engraving.value}`);
                return acc;
              }, [] as string[])
              .join(" / ");
            return <ListItem key={text}>{text}</ListItem>;
          })}
        </List>
      ) : (
        <Typography color="error">N/A</Typography>
      )}
    </div>
  )
);
