import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: { token: String | null; authenticated: boolean | null };
    onRegister?: (username: String, email: String, password: String, firstName: String, lastName: String, birth: String) => Promise<any>;
    onLogin?: (account: String, password: String) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = 'https://loi-thieng-be-35a53d3650c4.herokuapp.com/api/users/users';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: String | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            //console.log('Found Token:', token);
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
        };
        loadToken();
    }, []);



    const register = async (username: String, email: String, password: String, first_name: String, last_name: String, birth: String) => {
        try {
            const result = await axios.post(`${API_URL}`, { username, email, password, first_name, last_name, birth });
            console.log(result);
            return result;
        } catch (e) {
            console.log(e);
            return { error: true, msg: (e as any) };
        }
    };

    const login = async (account: String, password: String) => {
        try {
            const result = await axios.post(`${API_URL}/sign_in`, { account, password });

            //console.log("Ban da dang nhap", result.data.data.access_token);

            setAuthState({
                token: result.data.data.access_token,
                authenticated: true
            })
            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.data.access_token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.data.access_token);
            return result;
        } catch (e) {
            return { error: true, msg: (e as any) };
        }
    };

    const logout = async () => {
        console.log("User logout");
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        axios.defaults.headers.common['Authorization'] = '';
        setAuthState({
            token: null,
            authenticated: false
        });
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
    };

    return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}