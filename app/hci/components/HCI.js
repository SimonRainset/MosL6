import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";
import BedroomBabyIcon from "@mui/icons-material/BedroomBaby";
import PetsIcon from "@mui/icons-material/Pets";
import { useRouter } from "next/navigation";

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: "Sandtray",
    description:
      "心理沙盘游戏是一种投射性心理治疗方法，使用者通过在沙盘中摆放各种模型创造一个象征性的世界，从而自由地表达内心情感和无意识内容。",
    imageURL: "url(/images/HCI/Sandtray.jpg)",
    url: "hci/Sandtray/index.html",
  },
  {
    icon: <BedroomBabyIcon />,
    title: "皇帝养成计划",
    description: "帝王大舞台，有胆你就来！",
    imageURL: "url(/images/HCI/Empire.jpg)",
    url: "hci/Empire/index.html",
  },
  {
    icon: <PetsIcon />,
    title: "嘟嘟投喂模拟器",
    description:
      "嘟嘟是一只可怜的流浪小狗，你可以选择给嘟嘟投喂不同的食物让他开心起来哦！",
    imageURL: "url(/images/HCI/Dudu.png)",
    url: "hci/Dudu/index.html",
  },
];

export default function HCI() {
  const router = useRouter();

  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  return (
    <Container id="HCI" sx={{ py: { xs: 2, sm: 4 } }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <div>
            <Typography component="h2" variant="h4" color="text.primary">
              交叉创新实践课——人机交互设计
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: { xs: 2, sm: 4 } }}
            >
              人机交互设计课程结课产品展示
            </Typography>
          </div>
          <Grid
            container
            item
            gap={1}
            sx={{ display: { xs: "auto", sm: "none" } }}
          >
            {items.map(({ title }, index) => (
              <Chip
                key={index}
                label={title}
                onClick={() => handleItemClick(index)}
                sx={{
                  borderColor: "primary.light",
                  background: "primary.light",
                  backgroundColor:
                    selectedItemIndex === index ? "primary.main" : "",
                  "& .MuiChip-label": {
                    color: selectedItemIndex === index ? "#fff" : "",
                  },
                }}
              />
            ))}
          </Grid>

          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: "100%", display: { xs: "none", sm: "flex" } }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Card
                key={index}
                variant="outlined"
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={{
                  p: 3,
                  height: "fit-content",
                  width: "100%",
                  background: "none",
                  backgroundColor:
                    selectedItemIndex === index ? "action.selected" : undefined,
                  borderColor: (theme) => {
                    if (theme.palette.mode === "light") {
                      return selectedItemIndex === index
                        ? "primary.light"
                        : "grey.200";
                    }
                    return selectedItemIndex === index
                      ? "primary.dark"
                      : "grey.800";
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    textAlign: "left",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { md: "center" },
                    gap: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      color: () => {
                        return selectedItemIndex === index
                          ? "primary.main"
                          : "grey.300";
                      },
                    }}
                  >
                    {icon}
                  </Box>
                  <Box sx={{ textTransform: "none" }}>
                    <Typography
                      color="text.primary"
                      variant="body2"
                      fontWeight="bold"
                    >
                      {title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ my: 0.5 }}
                    >
                      {description}
                    </Typography>
                    <Link
                      color="primary"
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        "& > svg": { transition: "0.2s" },
                        "&:hover > svg": { transform: "translateX(2px)" },
                      }}
                      onClick={() => {
                        router.push(items[index].url);
                      }}
                    >
                      <span>Try</span>
                      <ChevronRightRoundedIcon
                        fontSize="small"
                        sx={{ mt: "1px", ml: "2px" }}
                      />
                    </Link>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { xs: "none", sm: "flex" }, width: "100%" }}
        >
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              width: "100%",
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                m: "auto",
                width: 600,
                height: 459,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundImage: items[selectedItemIndex].imageURL,
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
