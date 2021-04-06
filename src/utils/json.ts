import { readFileSync } from "fs"
import parseJson from "parse-json"

export const readJson = (filename: string): any =>
  parseJson(readFileSync(filename, "utf8"), filename)
