import React from "react";
import "./preview.css";
interface PreviewProps {
  code: string;
}

const html = `
<html>
<head></head>
<body>
  <div id="root"></div>
  <script>
    window.addEventListener('message',(event)=>{
      try{
        eval(event.data)
      }catch(error){
        const root=document.querySelector('#root')
        root.innerHTML='<div style="color:red"><h4>Runtime error </h4>' + error + '</div>'
        throw error;
      }
    },false)
  </script>
</body>
</html>   
`;
const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = React.useRef<any>();
  //update iframe to default before new code
  React.useEffect(() => {
    iframe.current.srcdoc = html;
    iframe.current.contentWindow.postMessage(code, "*");
  }, [code]);

  return (
    //iframe does not send events to the parent, so we a making after element in front of it when is dragged
    <div className="preview-wrapper">
      <iframe
        
        sandbox="allow-scripts"
        srcDoc={html}
        title="my-iframe"
        ref={iframe}
      />
    </div>
  );
};

export default Preview;
