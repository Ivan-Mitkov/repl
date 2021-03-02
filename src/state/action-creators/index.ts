// import axios from "axios";
import { Dispatch } from "redux";
import { ActionType } from "../action-types";
import {
  Action,
  DeleteCellAction,
  InsertCellAfterAction,
  MoveCellAction,
  UpdateCellAction,
  BundleCompleteAction,
  BundleStartAction,
} from "../actions";
import bundle from "../../bundler";
import { CellTypes, Direction, Cell } from "../cell";

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id: id,
      content,
    },
  };
};
export const deleteCell = (id: string): DeleteCellAction => {
  return { type: ActionType.DELETE_CELL, payload: id };
};
export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};
export const insertCellAfter = (
  id: string | null,
  type: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type,
    },
  };
};

export const createBundle = (cellId: string, input: string) => {
  //unsure calling dispatch with only valid type
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.BUNDLE_START, payload: { cellId } });
    //start bunling
    const result = await bundle(input);
    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: {
          code: result.code,
          err: result.err,
        },
      },
    });
  };
};
