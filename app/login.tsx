import { useAuth } from '@/config/AuthContext';
import React from 'react'
import { useState, useEffect } from 'react';
//import { View } from 'tamagui'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'
export default function LoginScreen({screens, setScreen}:any) {
  const {onLogin}=useAuth();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const result = await onLogin!(account,password);
    if(result && result.error) {
      //console.log(result);
      alert(result.msg);
    }
  };

  return (
    <View>
      <View className="gap-y-3 mx-5 mt-2">
        <Text className="text-5xl font-bold text-center">Lời thiêng</Text>
        <TextInput
          placeholder='Tài khoản'
          style={styles.input}
          value={account}
          onChangeText={setAccount}
        />
        <TextInput
          secureTextEntry={true}
          placeholder='Mật khẩu'
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={login}
        >
          <Text className="color-black text-center text-xl font-bold ">
            Đăng nhập
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setScreen(screens.SIGNUP)}
        >
          <Text className="color-black text-center text-xl">
            Đăng ký
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    height: 40,
    margin: 10,
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "deepskyblue"
  },
  buttonLogin: {
    display: "flex",
    justifyContent: "center",
    height: 40,
    margin: 10,
    backgroundColor: "deepskyblue",
    borderRadius: 5,
  }
});
