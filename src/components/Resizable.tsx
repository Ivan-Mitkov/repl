import React from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import { Direction } from "../enums";
import "./resizable.css";

interface ResizableProps {
  direction: Direction;
}
//https://www.npmjs.com/package/react-resizable
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [innerHeight, setInnerHeight] = React.useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const listener = () => {
      setInnerHeight(window.innerHeight);
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  let resizableProps: ResizableBoxProps;
  if (direction === Direction.horisontal) {
    resizableProps = {
      className: "resize-horisontal",
      height: Infinity,
      width: innerWidth * 0.75,
      resizeHandles: ["e"],
      maxConstraints: [innerWidth * 0.75, Infinity],
      minConstraints: [50, Infinity],
    };
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
      maxConstraints: [Infinity, innerHeight * 0.9],
      minConstraints: [Infinity, 50],
    };
  }
  return (
    //width can't be %
    <ResizableBox {...resizableProps}>{children}</ResizableBox>
  );
};

export default Resizable;
