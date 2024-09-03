"use client";
import { Button } from "@mui/material";
import "./style.css";

import Box from "@mui/material/Box";
import Script from "next/script";
import { useState } from "react";

export default function Chat() {
  let geolocation;
  let options = { timeout: 9000 };
  const [res, setRes] = useState(null);

  return (
    <>
      <Script
        src="https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("qq map loaded");
          geolocation = new qq.maps.Geolocation(
            "HLPBZ-H2KWN-L7NFL-SX2K4-SHSHT-XWFGZ",
            "mtc"
          );
        }}
      />
      <Button
        onClick={() => {
          geolocation.getLocation(
            (position) => {
              console.log(position);
              setRes(JSON.stringify(position));
            },
            () => {
              console.log("error");
            },
            options
          );
        }}
      >
        测试
      </Button>
      <Box>{res}</Box>
    </>
  );
}
