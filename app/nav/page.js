"use client";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import "./style.css";

function getRandomLowOpacityColor() {
  const red = Math.floor(Math.random() * 256); // 0-255
  const green = Math.floor(Math.random() * 256); // 0-255
  const blue = Math.floor(Math.random() * 256); // 0-255
  const alpha = Math.random() * 0.7; // 0.0-0.3 for low opacity

  return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(2)})`;
}

function titleCSS() {
  return {
    fontSize: "12em",
    fontFamily: "math",
  };
}

function topBarCSS() {
  return {
    height: "10%",
  };
}

function tryButtonCSS() {
  return {
    backgroundColor: "rgb(156, 39, 176)",
    color: "white",
    borderRadius: "20px",
    minHeight: "5vh",
    minWidth: "40vw",
    fontFamily: "fantasy",
    fontSize: "2em",
  };
}

function gridCSS() {
  return {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: getRandomLowOpacityColor(),
    width: "16vw",
    height: "9vw",
    borderRadius: "20px",
  };
}

export default function Navigation() {
  let baseURL;

  const router = useRouter();

  if (process.env.NODE_ENV === "development") {
    baseURL = "http://localhost:3000";
  } else {
    baseURL = "https://morethanchat.club";
  }

  let grids = [
    {
      title: "MoreThanChat对话",
      url: "/chat",
    },
    {
      title: "Prompt PlayGround",
      url: `${baseURL}/playground/index.html`,
    },
    {
      title: "NoitaGPT",
      url: `${baseURL}/noitaGPT/index.html`,
    },
    {
      title: "Noita提示词测试",
      url: `${baseURL}/noitaPromptTest/index.html`,
    },
    {
      title: "人生跳跃模拟器",
      url: `${baseURL}/lifeJumper/index.html`,
    },
    {
      title: "FunSoul",
      url: `${baseURL}/funSoul/index.html`,
    },
    {
      title: "Date",
      url: `${baseURL}/date/index.html`,
    },

    {
      title: "agentAVG",
      url: `${baseURL}/agentAVGMaker/index.html`,
    },
    {
      title: "SZ_HK_MO",
      url: `${baseURL}/shengangao/index.html`,
    },
    {
      title: "Agent Jianghu",
      url: `${baseURL}/agentJianghu/index.html`,
    }, 
    {
      title: "MOS2",
      url: `${baseURL}/MOS2/index.html`,
    },
  ];

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "98vh",
      }}
    >
      <Box style={topBarCSS()}></Box>
      <Box style={titleCSS()}>More Than Chat</Box>
      <Box>
        <Button
          style={tryButtonCSS()}
          onClick={() => {
            router.push("/playground");
          }}
        >
          Try
        </Button>
      </Box>

      <Box className="gallery" container spacing={2}>
        {grids.map((grid) => (
          <Box style={gridCSS()} key={grid.url} xs={3}>
            <Button
              style={{
                width: "100%",
                height: "100%",
                color: "black",
                fontFamily: "fantasy",
                fontSize: "1.5em",
              }}
              onClick={() => {
                router.push(grid.url);
              }}
            >
              {grid.title}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
