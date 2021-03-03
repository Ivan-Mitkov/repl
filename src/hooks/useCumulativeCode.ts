import { useTypedSelector } from "../hooks/useTypedSelector";

export const useCumulativeCode = (cellId: string) => {
  //from state get the combine code of all cells
  return useTypedSelector((state) => {
    //function for easy show result
    const showFunc = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';
    var show=(value)=>{
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
`;
    //same function but for other cells
    const showFuncNoOp = "var show=()=>{}";
    //reach into cell peace of state
    const { data, order } = state.cells;
    const orderedCell = order.map((id) => data[id]);
    //code of all previous code cells
    const accumulatedCode = [];
    for (let c of orderedCell) {
      if (c.id === cellId) {
        accumulatedCode.push(showFunc);
      } else {
        accumulatedCode.push(showFuncNoOp);
      }
      if (c.type === "code") {
        accumulatedCode.push(c.content);
      }
      //stop before reaching current cell
      if (c.id === cellId) {
        break;
      }
    }
    return accumulatedCode;
  }).join("\n");
};
