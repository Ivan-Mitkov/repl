import React from "react";
import "./add-cell.css";
import { useActions } from "../hooks/useActions";

interface AddCellProps {
  nextCellId: string | null;
  forceVisible?: boolean;
}
const AddCell: React.FC<AddCellProps> = ({ nextCellId, forceVisible }) => {
  const { insertCellAfter } = useActions();
  return (
    <div className={forceVisible ? "add-cell force-visible" : "add-cell"}>
      <div className="add-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(nextCellId, "code")}
        >
          <span className="icon is-small">
            <i className="fas fa-plus"></i>
          </span>
          <span>Code </span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(nextCellId, "text")}
        >
          <span className="icon is-small">
            <i className="fas fa-plus"></i>
          </span>
          <span>Text </span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default AddCell;
