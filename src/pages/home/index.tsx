import { Text, View } from "@tamagui/core";
import { Button } from "react-native";
import { useDispatch } from "@/config/redux/store";
import { login, useAuth } from "@/config/redux/slices/auth";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  useEffect(() => {
    console.log({ auth });
    Toast.show({
      type: "success",
      text1: "Hello",
      text2: "This is some something 👋",
    });
  }, [auth]);

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
