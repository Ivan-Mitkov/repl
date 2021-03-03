import React from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview";
import Resizable from "./Resizable";
import { Direction } from "../enums";
import { Cell } from "../state";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";

interface CodeCellProps {
  cell: Cell;
}
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  //action creators
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  
  const handleValueChange = (value: string) => {
    updateCell(cell.id, value);
  };

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      createBundle(cell.id, cell.content);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content, cell.id]);

  return (
    <Resizable direction={Direction.vertical}>
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction={Direction.horisontal}>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value: string) => handleValueChange(value)}
          ></CodeEditor>
        </Resizable>
        {bundle && <Preview code={bundle.code} bundlingStatus={bundle.error} />}
      </div>
    </Resizable>
  );
};

export default CodeCell;
