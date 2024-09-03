import fs from "fs/promises";
import path from "path";
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  let course = searchParams.get("course");
  const demoDirPath = path.join(process.cwd(), "app", "learn", "code", course);

  try {
    // 读取文件夹内容
    const files = await fs.readdir(demoDirPath);

    // 初始化一个对象来存储文件名和内容
    const filesContent = {};

    // 使用Promise.all来并发读取所有文件的内容
    await Promise.all(
      files.map(async (file) => {
        // 确保只处理JavaScript文件
        if (file.endsWith(".js")) {
          const filePath = path.join(demoDirPath, file);
          const content = await fs.readFile(filePath, "utf-8");
          // 将文件名（不包括扩展名）和其内容添加到filesContent对象
          filesContent[file.replace(".js", "")] = content;
        }
      })
    );

    Response.status = 200;
    return Response.json(filesContent);
  } catch (err) {
    // 如果出现错误，返回500状态和错误消息
    Response.status = 500;
    return Response.json({ error: "Unable to process directory" });
  }
}
