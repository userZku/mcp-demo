import fs from "fs/promises";
import path from "path";

export const readFileSafe = async (filepath: string) => {
  const resolved = path.resolve(filepath);
  return fs.readFile(resolved, "utf-8");
};

export const writeFileSafe = async (
  filepath: string,
  content: string,
  append: boolean
) => {
  const resolved = path.resolve(filepath);

  await fs.mkdir(path.dirname(resolved), { recursive: true });

  if (append) {
    await fs.appendFile(resolved, content, "utf-8");
  } else {
    await fs.writeFile(resolved, content, "utf-8");
  }
};