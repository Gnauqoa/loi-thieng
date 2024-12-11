import { useAuth } from "@/config/AuthContext";
import { Button, Text, View } from "react-native";

const HomeScreen = () => {

  const {authState , onLogout} =useAuth();
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        rowGap: 10
      }}
    >
      <Text className="color-black text-center text-xl font-bold">
        Join meetin
      </Text>
      <Button title="Logout" onPress={onLogout}/>
      <Button title="Test" onPress={()=>{console.log(authState)}}/>
    </View>
  );
};

export default HomeScreen;
