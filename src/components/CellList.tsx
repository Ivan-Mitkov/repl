import React from "react";
import { useTypedSelector } from "../hooks/useTypedSelector";
import CellListItem from "./CellListItem";

const CellList: React.FC = () => {
  //get all cells from state in an ordered list
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => data[id]);
  });

  const reneredCells = cells.map((cell) => (
    <CellListItem cell={cell} key={cell.id} />
  ));

  return <div>{reneredCells}</div>;
};

export default CellList;
