import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";
//output of the reducer
interface CellState {
  data: {
    [key: string]: Cell;
  };
  order: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CellState = {
  data: {},
  order: [],
  loading: false,
  error: null,
};

//https://immerjs.github.io/immer/docs/update-patterns
const reducer = produce((state: CellState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.DELETE_CELL:
      const idToDelete = action.payload;
      delete state.data[idToDelete];
      state.order = state.order.filter((x) => x !== idToDelete);
      return;
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return;
    case ActionType.INSERT_CELL_BEFORE:
      return state;
    case ActionType.MOVE_CELL:
      return state;
    default:
      return state;
  }
});

export default reducer;
