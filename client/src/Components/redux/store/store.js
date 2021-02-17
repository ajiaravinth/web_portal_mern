import { createStore } from "redux";
// import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import { persistReducer } from "redux-persist";
import rootReducer from "../reducer/rootReducer";

const persistConfig = {
  key: "root",
  //   blacklist: ["main"],
  storage: storage,
  stateReconciler: autoMergeLevel2,
};

const pReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  pReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  //   applyMiddleware(thunk),
);

export default store;
