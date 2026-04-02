import { getTimeTool } from "./system/getTime.js";
import { addTool } from "./math/add.js";
import { readFileTool } from "./file/readFile.js";
import { writeFileTool } from "./file/writeFile.js";
import { weatherTool } from "./external/weather.js";

export const tools = [
  getTimeTool,
  addTool,
  readFileTool,
  writeFileTool,
  weatherTool,
];