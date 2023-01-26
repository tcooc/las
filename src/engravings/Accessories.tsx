import { Typography, Button, List, Grid, ListItem } from "@mui/material";
import {
  EngravingCalculator,
  engravingsToString,
  getKey,
  Stat,
} from "../models";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Accessory } from "./Accessory";

type Build = EngravingCalculator["builds"][number];

export const Accessories = observer(
  ({ store }: { store: EngravingCalculator }) => {
    const [focusedBuild, setFocusedBuild] = useState<Build>();
    const [accountStats, setAccountStats] = useState({
      [Stat.Crit]: 0,
      [Stat.Spec]: 0,
      [Stat.Swift]: 0,
    });
    const focusedKeys = focusedBuild?.accessories.map(getKey);

    const promptAccountStats = () => {
      const crit = parseInt(prompt("Crit") || "");
      const spec = parseInt(prompt("Spec") || "");
      const swift = parseInt(prompt("Swift") || "");
      if (crit >= 0 && swift >= 0 && spec >= 0) {
        setAccountStats({
          [Stat.Crit]: crit,
          [Stat.Spec]: spec,
          [Stat.Swift]: swift,
        });
      }
    };

    return (
      <div>
        <Typography variant="h5" gutterBottom>
          Accessories {store.builds.length === 0 ? "(No builds found)" : ""}
        </Typography>
        {store.builds.length > 0 && (
          <>
            <Typography>
              Builds found (pet buff on highest stat):
              <Button onClick={promptAccountStats}>Set permanent stats</Button>
            </Typography>
            <List>
              {store.builds.map((build, index) => (
                <ListItem key={index}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Typography>
                        {build.stats
                          .map((stat, index) =>
                            index === 0
                              ? {
                                  ...stat,
                                  value: Math.floor(
                                    (stat.value + accountStats[stat.name]) * 1.1
                                  ),
                                }
                              : {
                                  ...stat,
                                  value: stat.value + accountStats[stat.name],
                                }
                          )
                          .map((stat) => `${stat.name}: ${stat.value}`)
                          .join(", ")}
                      </Typography>
                    </Grid>
                    {build.curses.length > 0 && (
                      <Grid item>
                        <Typography color="error">
                          Curses: {engravingsToString(build.curses)}
                        </Typography>{" "}
                      </Grid>
                    )}
                    {build.price > 0 && (
                      <Grid item>
                        <Typography>
                          Price: {build.price.toLocaleString()}
                        </Typography>{" "}
                      </Grid>
                    )}
                    <Button onClick={() => setFocusedBuild(build)}>
                      Show only
                    </Button>
                    <Button onClick={() => setFocusedBuild(undefined)}>
                      Clear filter
                    </Button>
                  </Grid>
                </ListItem>
              ))}
            </List>
          </>
        )}
        {store.accessories.map((accessory, index) => (
          <Accessory
            key={getKey(accessory)}
            index={index}
            accessory={accessory}
            store={store}
            show={!focusedKeys || focusedKeys.includes(getKey(accessory))}
          />
        ))}
        <Button onClick={store.addAccessory}>Add</Button>
      </div>
    );
  }
);
