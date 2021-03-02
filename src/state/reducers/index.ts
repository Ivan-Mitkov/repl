import { combineReducers } from "redux";
import cellReducer from "./cell-reducer";
import bundleReducer from "./bundleReducers";

const reducers = combineReducers({
  cells: cellReducer,
  bundles: bundleReducer,
});

export default reducers;

//https://redux.js.org/recipes/usage-with-typescript
export type RootState = ReturnType<typeof reducers>;
