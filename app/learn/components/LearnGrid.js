import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "../editor.css";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import getFullCode from "../../components/P5Utils";

function downloadStringAsFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

const learnGridCSS = {
  width: "70vw",
  margin: "20px 15vw",
  backgroundColor: "white",
  borderRadius: "18px",
};

const toolBarCSS = {
  paddingTop: "2px",
  paddingBottom: "4px",
  marginBottom: "10px",
};

function generateIframeCode(dynamicCode) {
  const iframeContent = getFullCode(dynamicCode);

  return (
    <iframe
      style={{
        minWidth: "100%",
        minHeight: "100%",
        border: "none",
      }}
      srcDoc={iframeContent}
    ></iframe>
  );
}

export default function LearnGrid(params) {
  const { title, tags, desc, referenceName, referenceLink, defaultCode = "" } = params;

  const [runningCode, setRunningCode] = useState("");
  const [inputCode, setInputCode] = useState("");

  useEffect(() => {
    setInputCode(defaultCode);
  }, []);

  return (
    <Box sx={learnGridCSS}>
      <Grid container spacing={2} className="grid-container">
        <Grid item xs={12}>
          <Box className="grid-header">
            <Box className="grid-header-text">{title}</Box>
            <Box className="grid-tag-wrapper">
              {tags.map((tag) => (
                <Box key={tag} className="grid-tag">
                  {tag}
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className="grid-text">{desc}
            <a href={referenceLink}>{referenceName}</a>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" spacing={2} style={toolBarCSS}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                aria-label="play"
                size="medium"
                onClick={() => {
                  setRunningCode(inputCode);
                }}
              >
                <PlayCircleIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                aria-label="stop"
                size="medium"
                onClick={() => {
                  setRunningCode("");
                }}
              >
                <StopCircleIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                aria-label="download"
                size="medium"
                onClick={() => {
                  downloadStringAsFile("index.js", inputCode);
                }}
              >
                <DownloadForOfflineRoundedIcon fontSize="inherit" />
              </IconButton>
            </Stack>
          </Stack>
          <Editor
            value={inputCode}
            onChange={(code) => setInputCode(code)}
            defaultLanguage="javascript"
            fontSize="30px"
            options={{
              fontSize: "16px",
              minimap: { enabled: false },
            }}
            className="left-item"
          />
        </Grid>
        <Grid item xs={6}>
          <Box className="right-item-wrapper">
            <Box className="right-item">{generateIframeCode(runningCode)}</Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
