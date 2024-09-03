"use client";

import { useEffect, useState } from "react";
import "./editor.css";
import Box from "@mui/material/Box";
import LearnGrid from "./components/LearnGrid";
import LearnConfig from "./learnConfig";
import { Button } from "@mui/material";

const rootCSS = {
  margin: 0,
};

export default function Learn() {
  const [courseIndex, setCourseIndex] = useState(0);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentCourseCodes, setCurrentCourseCodes] = useState({});

  const readCurrentCourseAllCodes = (courseTitle) => {
    fetch(`/api/getLearnCode?course=${courseTitle}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        console.log(data);
        setCurrentCourseCodes(data);
      })
      .catch((error) => {
        console.error("获取文件列表失败:", error);
      });
  };

  const switchCourse = (index) => {
    setCurrentCourseCodes({});
    setCourseIndex(index);
    let courseName = Object.keys(LearnConfig)[index];
    let course = LearnConfig[courseName];
    setCurrentCourse(course);
    readCurrentCourseAllCodes(courseName);
  };

  const renderAllButtons = () => {
    // 基于LearnConfig的Key值，渲染所有按钮
    return Object.keys(LearnConfig).map((key, index) => (
      <Button
        key={key}
        onClick={() => {
          switchCourse(index);
        }}
        className={
          index === courseIndex
            ? "menu-button-activate"
            : "menu-button-notactivate"
        }
      >
        {key}
      </Button>
    ));
  };

  useEffect(() => {
    switchCourse(0);
  }, []);

  return (
    <Box style={rootCSS}>
      <Box className="page-header-wrapper"></Box>

      <Box className="logo">MoreThanChat</Box>

      <Box className="menu-fixed">
        <Box className="menu-wrapper">{renderAllButtons()}</Box>
      </Box>

      <Box className="page-header">
        {currentCourse ? currentCourse.mainTitle : "Loading..."}
      </Box>

      <Box className="page-description">
        {currentCourse ? currentCourse.mainDesc : "Loading..."}
      </Box>

      {currentCourse &&
      currentCourse.content.length > 0 &&
      Object.keys(currentCourseCodes).length > 0 &&
      currentCourseCodes["error"] === undefined ? (
        currentCourse.content.map((content) => (
          <LearnGrid
            key={content.title}
            title={content.title}
            tags={content.tags}
            desc={content.desc}
            defaultCode={currentCourseCodes[content.file]}
            referenceName={content.referenceName}
            referenceLink={content.referenceLink}
          />
        ))
      ) : (
        <></>
      )}
    </Box>
  );
}
