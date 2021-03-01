import React from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview";
import bundler from "../bundler";
import Resizable from "./Resizable";
import { Direction } from "../enums";
import { Cell } from "../state";
import { useActions } from "../hooks/useActions";

interface CodeCellProps {
  cell: Cell;
}
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  //action creators
  const { updateCell } = useActions();

  const handleValueChange = (value: string) => {
    updateCell(cell.id, value);
  };

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      const bundeledCode = await bundler(cell.content);
      setCode(bundeledCode.code);
      setError(bundeledCode.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction={Direction.vertical}>
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction={Direction.horisontal}>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value: string) => handleValueChange(value)}
          ></CodeEditor>
        </Resizable>
        <Preview code={code} bundlingStatus={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
