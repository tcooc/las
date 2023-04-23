import { Container } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Accessories } from "./Accessories";
import { EngravingCalculator } from "../models";
import { Recommendations } from "./Recommendations";
import { Setup } from "./Setup";

export const EngravingForm = observer(
  ({ store }: { store: EngravingCalculator }) => (
    <Container>
      <Setup store={store} />
      <Recommendations store={store} />
      <Accessories store={store} />
    </Container>
  )
);
