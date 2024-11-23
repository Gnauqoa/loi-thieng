import { Button, Text, View } from "react-native";

const HomeScreen = () => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text className="color-black text-center text-xl font-bold">
        Join meetin
      </Text>
      <Button title="Go to Details" />
    </View>
  );
};

export default HomeScreen;
