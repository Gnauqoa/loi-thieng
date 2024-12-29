import { login, useAuth } from "@/config/redux/slices/auth";
import { SafeAreaView, View } from "react-native";
import { Input, Text, Button, Form, InputProps, Spinner } from "tamagui";
import { useState } from "react";
import { toastError } from "@/utils/toast";
import TextField, { createHandleChangeForm } from "@/components/TextFIeld";

const LoginScreen = () => {
  const { isLoading, dispatch } = useAuth();

  const [formData, setFormData] = useState({
    account: "",
    password: "",
  });

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
    <SafeAreaView className="flex flex-col w-full h-full px-4 justify-center gap-3">
      <TextField
        label="Tài khoản (email hoặc tên đăng nhập)"
        value={formData.account}
        nativeID="account"
        onChangeText={(value) => handleChange("account", value)}
      />
      <TextField
        label="Mật khẩu"
        value={formData.password}
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
    </SafeAreaView>
  );
};

export default LoginScreen;
