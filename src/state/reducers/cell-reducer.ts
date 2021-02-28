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

const reducer = (
  state: CellState = initialState,
  action: Action
): CellState => {
  switch (action.type) {
    case ActionType.DELETE_CELL:
      return state;
    case ActionType.UPDATE_CELL:
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      return state;
    case ActionType.MOVE_CELL:
      return state;
    default:
      return state;
  }
};

export default reducer;
