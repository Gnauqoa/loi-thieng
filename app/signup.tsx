import { useAuth } from '@/config/AuthContext';
import React, { useState } from 'react'
//import { Button, Form, H4, Spinner, Input, View } from 'tamagui'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

interface error {
    email: String | null,
    password: String | null,
    username: String | null,
    name: String | null,
    birth: String | null,
}

export default function SignupScreen({ screens, setScreen }: any) {
    const { onRegister, onLogin } = useAuth();
    const [loginErrors, setLoginErrors] = useState<error>();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");



    const login = async () => {
        const result = await onLogin!(username, password);
        if (result && result.error) {
            //console.log(result);
            alert(result.msg);
        }
    };

    const signup = async () => {
        const result = await onRegister!(username, email, password, firstName, lastName,  year+"-"+month+"-"+day);
        if (result && result.error) {
            //console.log(result);
            alert(result.msg);
        } else {
            login();
        }
    };

    const validateLogin = () => {
        let errors: error = {
            email: null,
            password: null,
            username: null,
            name: null,
            birth: null,
        }
        if (!email) errors.email = "Không được để trống";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Email không hợp lệ";
        } else {
            errors.email = null;
        }

        if (!password) errors.password = "Xin hãy nhập mật khẩu";
        else if (password !== rePassword) {
            errors.password = "Mật khẩu không khớp"
        } else {
            errors.password = null;
        }
        if (!username) errors.username = "Không được để trống";
        if (!firstName || !lastName) errors.name = "Không được để trống";
        if (!day || !month || !year) errors.birth = "Không được để trống";
        setLoginErrors(errors);
        let result = !Object.values(errors).every(o => o === null);
        if (result) {
            return true;
        } return false;
    };


    return (
        <View>
            <View className="gap-y-3 mx-5 mt-2">
                <Text className="text-5xl font-bold text-center">Lời thiêng</Text>
                <View style={styles.inputContainer}>
                    <View style={{ display: 'flex', justifyContent: "space-between", flexDirection: "row", padding: 2 }}>
                        <Text style={styles.nameText}>Email</Text>
                        {loginErrors?.email != null && <Text style={{ color: 'red' }}>{loginErrors?.email}</Text>}
                    </View>
                    <TextInput
                        placeholder='Nhập địa chỉ Email'
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        inputMode='email'
                    />
                </View>

                <View style={styles.inputContainer}>
                    <View style={{ display: 'flex', justifyContent: "space-between", flexDirection: "row", padding: 2 }}>
                        <Text style={styles.nameText}>Tên đăng nhập</Text>
                        {loginErrors?.username != null && <Text style={{ color: 'red' }}>{loginErrors?.username}</Text>}
                    </View>
                    <TextInput
                        placeholder='Nhập tên đăng nhập'
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View style={[styles.inputContainer, { height: 120 }]}>
                    <View style={{ display: 'flex', justifyContent: "space-between", flexDirection: "row", padding: 2 }}>
                        <Text style={styles.nameText}>Mật khẩu</Text>
                        {loginErrors?.password != null && <Text style={{ color: 'red' }}>{loginErrors?.password}</Text>}
                    </View>
                    <TextInput
                        secureTextEntry={true}
                        placeholder='Nhập mật khẩu'
                        style={[styles.input, { marginBottom: 10 }]}
                        value={password}
                        onChangeText={(e) => {
                            setPassword(e);
                        }}
                    />
                    <TextInput
                        secureTextEntry={true}
                        placeholder='Nhập lại mật khẩu'
                        style={styles.input}
                        value={rePassword}
                        onChangeText={setRePassword}
                    />
                </View>



                <View style={styles.inputContainer}>
                    <View style={{ display: 'flex', justifyContent: "space-between", flexDirection: "row", padding: 2 }}>
                        <Text style={styles.nameText}>Họ và tên</Text>
                        {loginErrors?.name != null && <Text style={{ color: 'red' }}>{loginErrors?.name}</Text>}
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                        <TextInput
                            placeholder='Nhập họ'
                            style={[styles.input, { width: "48%" }]}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            placeholder='Nhập tên'
                            style={[styles.input, { width: "48%" }]}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <View style={{ display: 'flex', justifyContent: "space-between", flexDirection: "row", padding: 2 }}>
                        <Text style={styles.nameText}>Ngày tháng năm sinh</Text>
                        {loginErrors?.birth != null && <Text style={{ color: 'red' }}>{loginErrors?.birth}</Text>}
                    </View>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <TextInput
                            placeholder='Nhập ngày'
                            style={[styles.input, { width: "30%" }]}
                            value={day}
                            onChangeText={setDay}
                            inputMode="numeric"
                        />
                        <Text style={styles.nameText}>/</Text>
                        <TextInput
                            placeholder='Nhập tháng'
                            style={[styles.input, { width: "30%" }]}
                            value={month}
                            onChangeText={setMonth}
                            inputMode="numeric"
                        />
                        <Text style={styles.nameText}>/</Text>
                        <TextInput
                            placeholder='Nhập năm'
                            style={[styles.input, { width: "30%" }]}
                            value={year}
                            onChangeText={setYear}
                            inputMode="numeric"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.buttonLogin}
                    onPress={() => {
                        if (validateLogin()) {
                            console.log("co loi: ", loginErrors);
                        } else {
                            //console.log("da tao tai khoan thanh cong");
                            signup();
                        }
                    }
                    }
                >
                    <Text className="color-black text-center text-xl font-bold ">
                        Tạo tài khoản
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setScreen(screens.LOGIN)}
                >
                    <Text className="color-black text-center text-xl">
                        Quay lại đăng nhập
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    nameText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 2,
    },
    inputContainer: {
        height: 70,
        width: "100%",
    },
    input: {
        padding: 10,
        height: 40,
        borderWidth: 2,
        backgroundColor: "white",
        borderRadius: 5,
        borderColor: "deepskyblue"
    },
    buttonLogin: {
        display: "flex",
        justifyContent: "center",
        height: 40,
        marginTop: 20,
        backgroundColor: "deepskyblue",
        borderRadius: 5,
    }
});

