import React from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview";
import Resizable from "./Resizable";
import { Direction } from "../enums";
import { Cell } from "../state";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import "./code-cell.css";

interface CodeCellProps {
  cell: Cell;
}
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  //action creators
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  //from state get the combine code of all cells
  const cumulativeCode = useTypedSelector((state) => {
    //reach into cell peace of state
    const { data, order } = state.cells;
    const orderedCell = order.map((id) => data[id]);
    //code of all previous code cells
    const accumulatedCode = [
      `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      const show=(value)=>{
        const root=document.querySelector('#root');
        if(typeof value==='object'){
          if(value.$$typeof && value.props){
            _ReactDOM.render(value,root)
          }else{
            root.innerHTML=JSON.stringify(value);
          }
        }else{
          root.innerHTML=value;
        }
      }
      `,
    ];
    for (let c of orderedCell) {
      if (c.type === "code") {
        accumulatedCode.push(c.content);
      }
      //stop before reaching current cell
      if (c.id === cell.id) {
        break;
      }
    }
    return accumulatedCode;
  });
  const handleValueChange = (value: string) => {
    updateCell(cell.id, value);
  };
  React.useLayoutEffect(() => {
    createBundle(cell.id, cumulativeCode.join("\n"));
    // eslint-disable-next-line
  }, []);
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode.join("\n"));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    //createBundle is memoized in useTypedSelector
  }, [cumulativeCode.join("\n"), cell.content, cell.id, createBundle]);

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
