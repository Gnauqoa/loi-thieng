import { login, useAuth } from "@/config/redux/slices/auth";
import { SafeAreaView, View } from "react-native";
import { Button, Spinner, Image, useWindowDimensions } from "tamagui";
import { useEffect, useState } from "react";
import { toastError } from "@/utils/toast";
import TextField, { createHandleChangeForm } from "@/components/TextFIeld";
import bg from "@/assets/login/background.png";

const LoginScreen = () => {
  const { isLoading, dispatch } = useAuth();

  const [formData, setFormData] = useState({
    account: "fc902ecf05e4570e091f",
    password: "123123123@q",
  });
  const { width } = useWindowDimensions();
  const widthImg = width / 1.1;
  const heightImg = (widthImg * 1152) / 896;

  const handleChange = createHandleChangeForm(setFormData);

  const handleLogin = () => {
    if (!formData.account || !formData.password) {
      toastError("Please fill in all fields.");
      return;
    }

    dispatch(
      login({
        account: formData.account,
        password: formData.password,
      })
    );
  };

  return (
    <SafeAreaView className="flex flex-col p-5 overflow-hidden w-full h-full justify-center items-center relative ">
      <Image
        src={bg}
        style={{
          width: widthImg,
          height: heightImg,
          objectFit: "cover",
        }}
      />

      <View className="absolute z-20 flex flex-col gap-4 h-full w-full justify-center px-24">
        <TextField
          label="Tài khoản (email hoặc tên đăng nhập)"
          value={formData.account}
          width={`${widthImg - 100}px`}
          onChangeText={(value) => handleChange("account", value)}
        />
        <TextField
          label="Mật khẩu"
          value={formData.password}
          width={`${widthImg - 100}px`}
          onChangeText={(value) => handleChange("password", value)}
          textContentType="password"
          secureTextEntry={true}
        />

        {isLoading ? (
          <Spinner />
        ) : (
          <Button disabled={isLoading} onPress={handleLogin}>
            Đăng nhập
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
