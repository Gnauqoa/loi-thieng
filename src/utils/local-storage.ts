import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_NAME = "_ut.lw";
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

export const saveBoRank = async (bo_rank: string): Promise<void> => {
  if (bo_rank) {
    await AsyncStorage.setItem(BO_RANK, bo_rank);
  }
};

export const getBoRank = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(BO_RANK);
};

export const removeBoRank = async (): Promise<void> => {
  await AsyncStorage.removeItem(BO_RANK);
};
