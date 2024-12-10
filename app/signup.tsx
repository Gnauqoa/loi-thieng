import React, { useState } from 'react'
//import { Button, Form, H4, Spinner, Input, View } from 'tamagui'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function SignupScreen({ screens, setScreen }: any) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birth, setBirth] = useState("");

    return (
        <View>
            <View className="gap-y-3 mx-5 mt-2">
                <Text className="text-5xl font-bold text-center">Lời thiêng</Text>
                <TextInput
                    placeholder='Nhập địa chỉ Email'
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder='Nhập tên đăng nhập'
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    secureTextEntry={true}
                    placeholder='Nhập mật khẩu'
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    secureTextEntry={true}
                    placeholder='Nhập lại mật khẩu'
                    style={styles.input}
                    value={rePassword}
                    onChangeText={setRePassword}
                />
                <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                    <TextInput
                        placeholder='Nhập họ'
                        style={[styles.input, { width: "46%" }]}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <TextInput
                        placeholder='Nhập tên'
                        style={[styles.input, { width: "46%" }]}
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>
                <TouchableOpacity
                    style={styles.buttonLogin}
                >
                    <Text className="color-black text-center text-xl font-bold ">
                        Tọa tài khoản
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setScreen(screens.LOGIN)}
                >
                    <Text className="color-black text-center text-xl">
                        Đăng nhập
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

