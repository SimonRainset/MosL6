"use client";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

import "./style.css";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ariaLabel = { "aria-label": "description" };

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [allPrompts, setAllPrompts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState("ChatGPT");

  return (
    <div className="chat">
      <Box sx={{ width: "100%" }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div">
              清华大学 More Than Chat
            </Typography>

            <FormControl
              sx={{
                ml: 4,
                maxWidth: 200,
                flex: 1,
                backgroundColor: "white",
              }}
              variant="filled"
            >
              <InputLabel>模型</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currentModel}
                label="模型"
                onChange={(e) => {
                  setCurrentModel(e.target.value);
                }}
              >
                <MenuItem value={"ChatGPT"}>ChatGPT 3.5</MenuItem>
                <MenuItem value={"ChatGLM"}>智谱ChatGLM-4</MenuItem>
                <MenuItem value={"Spark"}>讯飞Spark</MenuItem>
                  <MenuItem value={"GLM4V"}>GLM4V</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </AppBar>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Stack
        direction="row"
        justifyContent="stretch"
        sx={{
          flexGrow: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          overflow: "scroll",
        }}
      >
        {allPrompts.map((item, index) => {
          return (
            <Box className={`dialog ${item.role}`} key={`Dialog${index}`}>
              {item.content}
            </Box>
          );
        })}
      </Stack>

      <Stack
        direction="row"
        spacing={4}
        sx={{
          width: "100%",
        }}
      >
        <TextField
          fullWidth
          placeholder="请输入你想要的并点击按钮，下面就会有结果！"
          inputProps={ariaLabel}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          multiline
          variant="outlined"
          rows={6}
        />
        <Button
          onClick={() => {
            setOpen(true);
            setPrompt("");

            let temp = [...allPrompts, { role: "user", content: prompt }];
            let exeFunc;
            let agentOnComplete = (content) => {
              setOpen(false);
              setAllPrompts([
                ...temp,
                {
                  role: "assistant",
                  content: content,
                },
              ]);
            };

            switch (currentModel) {
              case "ChatGPT":
              default:
                exeFunc = () => {
                  let agent = new P5GPT();
                  agent.send(temp);
                  agent.onComplete = agentOnComplete;
                };
                break;
              case "ChatGLM":
                exeFunc = () => {
                  let agent = new P5GLM();
                  agent.send(temp);
                  agent.onComplete = agentOnComplete;
                };
                break;
                case "GLM4V":
                    exeFunc = () => {
                        let agent = new P5GLM4V();
                        agent.send(temp);
                        agent.onComplete = agentOnComplete;
                    };
                    break;
              case "Spark":
                exeFunc = () => {
                  let agent = new P5Spark();
                  agent.send(temp);
                  agent.onComplete = agentOnComplete;
                };
                break;
            }

            exeFunc();
          }}
          variant="contained"
          endIcon={<KeyboardDoubleArrowDownIcon />}
          color="success"
          sx={{
            minWidth: "120px",
          }}
        >
          提问
        </Button>
      </Stack>
    </div>
  );
}
