import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";

//output of the reducer
interface BundleState {
  [key: string]:
    | {
        loading: boolean;
        code: string;
        error: string;
      }
    | undefined;
}

//initial state
const initialState: BundleState = {};

//reducer
const reducer = produce(
  (state: BundleState = initialState, action: Action): BundleState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        state[action.payload.cellId] = {
          loading: true,
          code: "",
          error: "",
        };
        return state;
      case ActionType.BUNDLE_COMPLETE:
        state[action.payload.cellId] = {
          loading: false,
          error: action.payload.bundle.err,
          code: action.payload.bundle.code,
        };
        return state;

      default:
        return state;
    }
  }
);

export default reducer;
