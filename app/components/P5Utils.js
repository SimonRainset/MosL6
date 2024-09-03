export default function getFullCode(dynamicCode) {
  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
    
        <script> 
        window.onerror = function(message, source, lineno, colno, error) {
          window.parent.postMessage({
            type: 'IFRAME_ERROR',
            error: { message, source, lineno, colno }
          }, '*'); 
          return false;  
        };
    
        function log(message) {
          window.parent.postMessage(
            {
              type: "IFRAME_LOG",
              log: message,
            },
            "*"
          );
        }
    
        </script>
    
        <script src="https://fastly.jsdelivr.net/npm/p5@1/lib/p5.min.js"></script>
        <script src="https://p5play.org/v3/planck.min.js"></script>
        <script src="https://p5play.org/v3/p5play.js"></script>
        <script src="https://unpkg.com/p5.touchgui@0.5.2/lib/p5.touchgui.js"></script>
        <script src="https://fastly.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script src="/library/RAG.js"></script>
        <script src="/library/p5llm.js"></script>
        <script src="/library/textBox.js"></script>
        <script>
        ${dynamicCode}
        </script>
    
    
        <style>
          body {
            padding: 0;
            margin: 0;
          }
          canvas {
            vertical-align: top;
          }
        </style>
      </head>
      <body></body>
    </html>`;

  return iframeContent;
}

export function getAvgFullCode(dynamicCode) {
  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
    
        <script> 
        window.onerror = function(message, source, lineno, colno, error) {
          window.parent.postMessage({
            type: 'IFRAME_ERROR',
            error: { message, source, lineno, colno }
          }, '*'); 
          return false;  
        };
    
        function log(message) {
          window.parent.postMessage(
            {
              type: "IFRAME_LOG",
              log: message,
            },
            "*"
          );
        }
    
        </script>
    
        <script src="https://fastly.jsdelivr.net/npm/p5@1/lib/p5.min.js"></script>
        <script src="https://p5play.org/v3/planck.min.js"></script>
        <script src="https://p5play.org/v3/p5play.js"></script>
        <script src="https://unpkg.com/p5.touchgui@0.5.2/lib/p5.touchgui.js"></script>
        <script src="https://fastly.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script src="/library/p5llm.js"></script>
        <script>
        ${dynamicCode}
        </script>

        <link rel="stylesheet" type="text/css" href="/commonCSS/avgmaker.css" />
    
      </head>
      <body>
        <div id="chatInterface">
          <div id="inputDiv">
            <input type="text" id="chatInput" placeholder="输入消息...">
            <button id="sendButton">发送</button>
          </div>
          <div id="chatLog" >
            <!-- 聊天记录将在这里显示 -->
          </div>
          <div id="inventory" >
            <!-- 物品将在这里显示 -->
          </div>
          <div id="iButtons"></div>
          
        </div>
    </body>
    </html>`;

  return iframeContent;
}
