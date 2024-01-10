import { Container } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Accessories } from "@/engravings/Accessories";
import { EngravingCalculator } from "@/models";
import { Recommendations } from "@/engravings/Recommendations";
import { Setup } from "@/engravings/Setup";

export const EngravingForm = observer(
  ({ store }: { store: EngravingCalculator }) => (
    <Container>
      <Setup store={store} />
      <Recommendations store={store} />
      <Accessories store={store} />
    </Container>
  )
);
