import TamaguiProviderWrapper from "@/config/tamagui.config";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./home";
import "../global.css";

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <TamaguiProviderWrapper>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    </TamaguiProviderWrapper>
  );
}
