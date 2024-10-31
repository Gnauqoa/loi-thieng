import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { config } from "@tamagui/config/v3";
import { ReactNode, FC } from "react";

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(config);

// TypeScript types across all Tamagui APIs
type Conf = typeof tamaguiConfig;
declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}

const TamaguiProviderWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return <TamaguiProvider config={tamaguiConfig}>{children}</TamaguiProvider>;
};

export default TamaguiProviderWrapper;
