import { combineReducers } from "redux";
// slices
import authReducer from "./slices/auth";
import postReducer from "./slices/post";
import commentReducer from "./slices/comment";

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
  auth: authReducer,
  comment: commentReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export { rootPersistConfig, rootReducer, persistedReducer };
