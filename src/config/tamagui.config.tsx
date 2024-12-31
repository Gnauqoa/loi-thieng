import {
  TamaguiProvider as TamaguiProviderRoot,
  createTamagui,
} from "@tamagui/core";
import { config } from "@tamagui/config/v3";
import { ReactNode, FC } from "react";

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(config);

// TypeScript types across all Tamagui APIs
type Conf = typeof tamaguiConfig;
declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}

const TamaguiProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <TamaguiProviderRoot config={tamaguiConfig}>{children}</TamaguiProviderRoot>
  );
};

export default TamaguiProvider;
