"use client";

import { useEffect, useState } from "react";
import "./index.css";
import AVGMakerEditor from "../components/AVGMakerEditor";

export default function Playground() {
  let [demos, setDemos] = useState({ 空白: "" });

  const readAllDemoCodes = async () => {
    fetch("/api/getDemo?route=avgmaker")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        // 在这里你可以处理文件名列表
        setDemos({ ...demos, ...data });
      })
      .catch((error) => {
        console.error("获取文件列表失败:", error);
      });
  };

  useEffect(() => {
    readAllDemoCodes();
  }, []);

  return (
    <AVGMakerEditor demos={demos} showSelector={true} showConsole={true} />
  );
}
