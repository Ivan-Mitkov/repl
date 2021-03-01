import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { ActionType } from "./action-types";

export const store = createStore(reducers, {}, applyMiddleware(thunk));

//test reducers
store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: { id: null, type: "code" },
});
store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: { id: null, type: "text" },
});
console.log(store.getState());
const tempId = store.getState().cells.order[1];
console.log(tempId);
store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: { id: tempId, type: "code" },
});
console.log(store.getState());
store.dispatch({
  type: ActionType.DELETE_CELL,
  payload: tempId,
});
console.log(store.getState());
const tempId2 = store.getState().cells.order[1];

store.dispatch({
  type: ActionType.MOVE_CELL,
  payload: { id: tempId2, direction: "up" },
});
console.log(store.getState());
store.dispatch({
  type: ActionType.UPDATE_CELL,
  payload: { id: tempId2, content: "change" },
});
console.log(store.getState());
