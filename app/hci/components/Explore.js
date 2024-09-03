import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/navigation";

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: "对话",
    description: "一个简单的大语言模型对话集合。",
    url: "/chat",
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: "图形化Prompt",
    description: "形象地解释，什么是Prompt。",
    url: "/playground/index.html",
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: "Noita GPT",
    description: "合成你的魔杖，用组合的力量击败敌人。",
    url: "/noitaGPT/index.html",
  },
  {
    icon: <PsychologyIcon />,
    title: "Funsoul",
    description: "大脑，人类最强的器官；AI，人类最好的利刃。",
    url: "/funSoul/index.html",
  },
  {
    icon: <MoveUpIcon />,
    title: "人生跳跃模拟器",
    description: "短短几个秋，都浓缩在一个动作里了。",
    url: "/lifeJumper/index.html",
  },

  {
    icon: <FavoriteIcon />,
    title: "约会日记",
    description: "谁不想看林黛玉和伏地魔恋爱呢？",
    url: "/date/index.html",
  },
];

export default function Explore() {
  const router = useRouter();

  return (
    <Box
      id="explore"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "#06090a",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4">
            探索
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            人工智能需要艺术，正如艺术需要人工智能那样。
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              onClick={() => {
                router.push(items[index].url);
              }}
            >
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  p: 3,
                  height: "100%",
                  border: "1px solid",
                  borderColor: "grey.800",
                  background: "transparent",
                  backgroundColor: "grey.900",
                  transition: "background-color 0.3s ease",
                  ":hover": {
                    backgroundColor: "#505050",
                    cursor: "pointer",
                  },
                }}
              >
                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                <div>
                  <Typography fontWeight="medium" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
