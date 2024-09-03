import * as React from "react";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundImage:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #CEE5FD, #FFF)"
            : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
        backgroundSize: "100% 20%",
        backgroundRepeat: "no-repeat",
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignSelf: "center",
              textAlign: "center",
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
            }}
          >
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: "clamp(3rem, 10vw, 8rem)",
                color: "primary.main",
              }}
            >
              More
            </Typography>
            &nbsp;Than&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: "clamp(3rem, 10vw, 8rem)",
                color: "primary.main",
              }}
            >
              Chat
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
          >
            探索艺术与人工智能的交汇，帮助艺术家、设计师和开发人员创作更好的作品。
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              router.push("/playground");
            }}
          >
            尝试一下
          </Button>
        </Stack>
        <Box
          id="image"
          sx={(theme) => ({
            mt: { xs: 4, sm: 6 },
            alignSelf: "center",
            height: { xs: 200, sm: 700 },
            width: "100%",
            backgroundImage: 'url("/photos/mtccamp.jpg")',
            backgroundSize: "cover",
            borderRadius: "10px",
            outline: "1px solid",
            outlineColor: alpha("#BFCCD9", 0.5),
            boxShadow: `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`,
          })}
        />
      </Container>
    </Box>
  );
}
