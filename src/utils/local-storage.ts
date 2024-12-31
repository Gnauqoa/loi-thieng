import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_NAME = "_ut.lw";
export const FIREBASE_TOKEN_NAME = "_ut.fb";
const BO_RANK = "_b_r";

export const saveToken = async (token: string): Promise<void> => {
  if (token) {
    await AsyncStorage.setItem(TOKEN_NAME, token);
  }
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_NAME);
};

export const removeToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_NAME);
};

export const saveFirebaseToken = async (
  firebase_token: string
): Promise<void> => {
  if (firebase_token) {
    await AsyncStorage.setItem(FIREBASE_TOKEN_NAME, firebase_token);
  }
};

export const getFirebaseToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(FIREBASE_TOKEN_NAME);
};

export const removeFirebaseToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(FIREBASE_TOKEN_NAME);
};
