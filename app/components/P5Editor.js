import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./editor.css";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Button from "@mui/material/Button";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import getFullCode from "./P5Utils";

function downloadStringAsFile(filename, content) {
  // 创建一个Blob对象
  const blob = new Blob([content], { type: "text/plain" });

  // 创建一个临时的 <a> 元素
  const link = document.createElement("a");

  // 创建一个URL对象
  const url = URL.createObjectURL(blob);

  // 设置下载属性和文件名
  link.href = url;
  link.download = filename;

  // 将 <a> 元素添加到DOM，并模拟点击
  document.body.appendChild(link);
  link.click();

  // 释放URL对象
  URL.revokeObjectURL(url);

  // 移除 <a> 元素
  document.body.removeChild(link);
}

function generateIframeCode(dynamicCode) {
  const iframeContent = getFullCode(dynamicCode);

  return (
    <iframe
      style={{
        minWidth: "100%",
        minHeight: "100%",
      }}
      srcDoc={iframeContent}
    ></iframe>
  );
}

function rootCSS() {
  return {
    height: "98vh",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  };
}

function horizontalSplitPaneCSS() {
  return {
    flex: 1,
  };
}

function toolBarCSS() {
  return {
    paddingTop: "10px",
    paddingBottom: "10px",
    marginBottom: "10px",
    borderBottom: "1px dashed #a6a6a6",
  };
}

export default function P5Editor(params) {
  const {
    demos = { 空白: "" },
    showConsole = true,
    showSelector = false,
  } = params;

  let [demoValue, setDemoValue] = useState(0);
  const [inputCode, setInputCode] = useState("");
  const [code, setCode] = useState();
  const [consoleText, setConsoleText] = useState([
    {
      content: "### More Than Chat ###",
    },
  ]);

  useEffect(() => {
    const handleIframeMessages = (event) => {
      if (event.data && event.data.type === "IFRAME_ERROR") {
        // 在这里处理错误信息，例如显示错误提示
        // console.error("Iframe Error:", event.data.error);
        console.log(11);
        setConsoleText([...consoleText, { content: event.data.error.message }]);
      }
      if (event.data && event.data.type === "IFRAME_LOG") {
        // 在这里处理日志信息，例如显示在终端中
        setConsoleText([...consoleText, { content: event.data.log }]);
      }
    };
    window.addEventListener("message", handleIframeMessages);
    // 卸载时清理事件监听器
    return () => {
      window.removeEventListener("message", handleIframeMessages);
    };
  }, []);

  return (
    <Box style={rootCSS()}>
      <Stack direction="row" spacing={2} style={toolBarCSS()}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            aria-label="play"
            size="large"
            onClick={() => {
              setCode(inputCode);
            }}
          >
            <PlayCircleIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="stop"
            size="large"
            onClick={() => {
              setCode("");
            }}
          >
            <StopCircleIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="download"
            size="large"
            onClick={() => {
              downloadStringAsFile("index.js", inputCode);
            }}
          >
            <DownloadForOfflineRoundedIcon fontSize="inherit" />
          </IconButton>
        </Stack>

        {showSelector && (
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Demo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={demoValue}
                label="Demo"
                onChange={(event) => {
                  setDemoValue(event.target.value);
                  setInputCode(demos[Object.keys(demos)[event.target.value]]);
                }}
              >
                {Object.keys(demos).map((demo, index) => (
                  <MenuItem key={demo} value={index}>
                    {demo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Stack>

      <div style={horizontalSplitPaneCSS()}>
        <PanelGroup
          id="horizontal-group"
          style={{
            position: "relative",
          }}
          direction="horizontal"
        >
          <Panel defaultSize={40} minSize={10}>
            <PanelGroup
              id="vertical-group"
              style={{
                position: "relative",
              }}
              direction="vertical"
            >
              <Panel defaultSize={80} minSize={10}>
                <div className="left-item">
                  <Editor
                    value={inputCode}
                    onChange={(code) => setInputCode(code)}
                    defaultLanguage="javascript"
                    fontSize="38px"
                    options={{
                      fontSize: "20px",
                      minimap: { enabled: false },
                    }}
                  />
                </div>
              </Panel>

              {showConsole && (
                <>
                  <PanelResizeHandle id="vertical-group" />
                  <Panel defaultSize={20} minSize={10}>
                    <div className="console">
                      <Stack
                        direction="row"
                        alignContent="center"
                        style={{
                          backgroundColor: "#c1c1c1",
                          padding: "5px 10px 5px 10px",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span>终端</span>
                        </div>
                        <Button
                          variant="text"
                          style={{
                            color: "black",
                            fontSize: "medium",
                          }}
                          onClick={() => {
                            setConsoleText([]);
                          }}
                        >
                          清空
                        </Button>
                      </Stack>
                      <div
                        style={{
                          flex: 1,
                          backgroundColor: "#f1f1f1",
                          padding: "10px",
                          color: "#555555",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {consoleText.map((item, index) => (
                          <span key={index}>{item.content}</span>
                        ))}
                      </div>
                    </div>
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>
          <PanelResizeHandle id="horizontal-group" />
          <Panel defaultSize={60} minSize={10}>
            <div className="right-item">{generateIframeCode(code)}</div>
          </Panel>
        </PanelGroup>
      </div>
    </Box>
  );
}
