import { resolve } from "path"
import { MiddlewareFunction } from "yargs"
import { GlobalArguments } from "../global"
import { readJson } from "../utils/json"

const validatePackageJson = (data: any, filename: string) => {
  const errors: string[] = []

  if (typeof data !== "object") {
    errors.push("Configuration file must have object in root")
  }

  if (data?.name === void 0) {
    errors.push("No required field 'name' in config")
  } else if (typeof data?.name !== "string") {
    errors.push("Field 'name' in config must be a string")
  }

  if (data?.version === void 0) {
    errors.push("No required field 'version' in config")
  } else if (typeof data?.version !== "string") {
    errors.push("Field 'version' in config must be a string")
  }

  if (errors.length > 0) {
    throw new Error(`Errors at ${filename}:\n\n${errors.join("\n")}`)
  }
}

const middleware: MiddlewareFunction<GlobalArguments> = (argv) => {
  const packagejson = readJson(resolve(argv.config))

  validatePackageJson(packagejson, argv.config)

  argv.packagejson = packagejson

  return argv
}

export default middleware
