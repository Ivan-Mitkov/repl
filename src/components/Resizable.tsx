import { ResizableBox } from "react-resizable";
import { Direction } from "../enums";
import "./resizable.css";

interface ResizableProps {
  direction: Direction;
}
//https://www.npmjs.com/package/react-resizable
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    //width can't be %
    <ResizableBox
      height={300}
      width={Infinity}
      resizeHandles={["s"]}
      maxConstraints={[Infinity, window.innerHeight * 0.9]}
      minConstraints={[Infinity, 50]}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizable;
