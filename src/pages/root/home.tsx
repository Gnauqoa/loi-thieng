import { Text, View } from "@tamagui/core";
import { Button } from "react-native";
import { useDispatch } from "@/config/redux/store";
import { login } from "@/config/redux/slices/auth";

const HomeScreen = () => {
  const dispatch = useDispatch();

  return (
    <View>
      <Text>Home screen</Text>
      <Button
        title="Login"
        onPress={() => {
          dispatch(
            login({ account: "830a979ca9f4b0e76ffa", password: "123123123@q" })
          );
        }}
      />
    </View>
  );
};

export default HomeScreen;
