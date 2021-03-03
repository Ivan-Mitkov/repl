import React from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview";
import Resizable from "./Resizable";
import { Direction } from "../enums";
import { Cell } from "../state";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import "./code-cell.css";
import { useCumulativeCode } from "../hooks/useCumulativeCode";
interface CodeCellProps {
  cell: Cell;
}
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  //action creators
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  const cumulativeCode = useCumulativeCode(cell.id);

  const handleValueChange = (value: string) => {
    updateCell(cell.id, value);
  };
  React.useLayoutEffect(() => {
    createBundle(cell.id, cumulativeCode);
    // eslint-disable-next-line
  }, []);
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    //createBundle is memoized in useTypedSelector
  }, [cumulativeCode, cell.content, cell.id, createBundle]);

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

        {!bundle || bundle.loading ? (
          <div className="progress-wrapper">
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          </div>
        ) : (
          <Preview code={bundle.code} bundlingStatus={bundle.error} />
        )}
      </div>
    </Resizable>
  );
};

export default CodeCell;
