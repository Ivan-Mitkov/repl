import { combineReducers } from "redux";
import cellReducer from "./cell-reducer";

const reducers = combineReducers({
  cells: cellReducer,
});

export default reducers;

//https://redux.js.org/recipes/usage-with-typescript
export type RootState = ReturnType<typeof reducers>;
