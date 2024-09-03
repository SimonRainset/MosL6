import fs from "fs/promises";
import path from "path";
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(req) {
  const url = new URL(req.url);
  const folder = url.searchParams.get("folder");

  // 构建指向某一路径
  const dirPath = path.join(process.cwd(), folder);

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    const folders = items
      .filter((item) => item.isDirectory())
      .map((item) => item.name);

    Response.status = 200;
    return Response.json(folders);
  } catch (err) {
    console.error(err);
    // 如果出现错误，返回500状态和错误消息
    Response.status = 500;
    return Response.json({ error: "Unable to process directory" });
  }
}
