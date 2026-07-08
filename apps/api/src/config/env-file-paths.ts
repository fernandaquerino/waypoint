import { resolve } from "node:path";

export const envFilePaths = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "../../.env"),
];
