import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

//create random id
const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};
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
//returning state just for TS, otherwise TS will tink that state can be undefined immer is taking care to return what we want
const reducer = produce((state: CellState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.DELETE_CELL:
      const idToDelete = action.payload;
      delete state.data[idToDelete];
      state.order = state.order.filter((x) => x !== idToDelete);
      return state;
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      //create new Cell
      const cell: Cell = {
        content: "",
        type: action.payload.type,
        id: randomId(),
      };
      //create new cell at state.data
      state.data[cell.id] = cell;

      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );
      console.log(foundIndex);
      if (foundIndex < 0) {
        state.order = state.order.concat(cell.id);
      } else {
        //insert in order arr
        state.order.splice(foundIndex, 0, cell.id);
      }
      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const indexToMove = state.order.findIndex(
        (id) => id === action.payload.id
      );
      let newIndex = direction === "up" ? indexToMove - 1 : indexToMove + 1;
      if (newIndex >= state.order.length) {
        newIndex = state.order.length - 1;
      } else if (newIndex < 0) {
        newIndex = 0;
      }
      //swap places
      state.order[indexToMove] = state.order[newIndex];
      state.order[newIndex] = action.payload.id;
      return state;
    default:
      return state;
  }
});

export default reducer;
