import { combineReducers } from "redux";
import { counterReducer } from "./customers";

export const rootReducer = combineReducers({
  counterReducer
});