import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import registrationReducer from "./registrationReducer";
import agencyReducer from "./agencyReducer";

const rootReducer = combineReducers({
  authReducer: authReducer,
  registration: registrationReducer,
  agencyReducer: agencyReducer,
});

export default rootReducer;
