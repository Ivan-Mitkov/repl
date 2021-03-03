import React from "react";
import "./preview.css";

interface PreviewProps {
  code: string;
  bundlingStatus: string;
}
const html =`
<html>
<head></head>
<body>
  <div id="root"></div>
  <script>
  const handleError=(err)=>{
    const root=document.querySelector('#root')
    root.innerHTML='<div style="color:red"><h4>Runtime error </h4>' + err + '</div>'
    throw error;

  }
    window.addEventListener('error',(event)=>{
      event.preventDefault()
      handleError(event.error)
    })
    window.addEventListener('message',(event)=>{
      try{
        eval(event.data)
      }catch(err){
        handleError(err)
      }
    },false)
  </script>
</body>
</html>   
`;
const Preview: React.FC<PreviewProps> = ({ code, bundlingStatus }) => {
  const iframe = React.useRef<any>();
  //update iframe to default before new code
  React.useEffect(() => {
    iframe.current.srcdoc = html;
    //to give browser enough tome to update the source doc and setup message listener
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 100);
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
      {bundlingStatus && <div className="preview-error">{bundlingStatus}</div>}
    </div>
  );
};

export default Preview;
