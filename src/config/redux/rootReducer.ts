import { combineReducers } from "redux";
// slices
import postReducer from "./slices/post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  keyPrefix: "redux-",
  whitelist: [],
};

const rootReducer = combineReducers({
  post: postReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export { rootPersistConfig, rootReducer, persistedReducer };
