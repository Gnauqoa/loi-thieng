import { Text, View } from "@tamagui/core";
import { Button } from "react-native";
import axios from "../../utils/axios";
import { AxiosError } from "axios";
const HomeScreen = () => {
  return (
    <View>
      <Text>Home screen</Text>
      <Button
        title="Login"
        onPress={async () => {
          try {
            const data = await axios.post("/users/users/sign_in", {
              account: "30453ba6fa72a6d0afa8",
              password: "123456",
            });
            console.log(data);
          } catch (error) {
            const err = error as AxiosError;
            console.log(err);
          }
        }}
      />
    </View>
  );
};

export default HomeScreen;
