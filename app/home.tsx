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
      <Text style={{ color: "#000" }}>Home</Text>
      <Button title="Go to Details" />
    </View>
  );
};

export default HomeScreen;
