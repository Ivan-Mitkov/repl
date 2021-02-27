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
  //fix width change when browser resize
  const [width, setWidth] = React.useState(window.innerWidth * 0.75);

  React.useEffect(() => {
    let timer: any;
    const listener = () => {
      //debounce resizing for better performance
      timer = setTimeout(() => {
        if (timer) {
          clearTimeout(timer);
        }
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        //when resizing browser ResizableBox max constraint is ignored, so to fix this:
        if (width > window.innerWidth * 0.75) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    //resize with resize of the browser
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [width]);

  let resizableProps: ResizableBoxProps;
  if (direction === Direction.horisontal) {
    resizableProps = {
      className: "resize-horisontal",
      height: Infinity,
      width: width,
      resizeHandles: ["e"],
      maxConstraints: [innerWidth * 0.75, Infinity],
      minConstraints: [50, Infinity],
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      height: 300,
      //width can't be %
      width: Infinity,
      resizeHandles: ["s"],
      maxConstraints: [Infinity, innerHeight * 0.9],
      minConstraints: [Infinity, 50],
    };
  }
  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
