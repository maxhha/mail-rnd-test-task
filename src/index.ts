#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs"
import yargs, { config } from "yargs"
import { hideBin } from "yargs/helpers"

yargs(hideBin(process.argv))
  .command<{ packages: string[]; config: string }>(
    ["install <packages...>", "i"],
    "add packages to your dependencies",
    () => {},
    (argv) => {
      console.debug(`Read data from config "${argv.config}"`)
      const data = readFileSync(argv.config, "utf8")

      console.debug("Parse json")
      const parsed = JSON.parse(data)

      console.debug("Add new dependencies")
      if (!parsed.dependencies) {
        parsed.dependencies = {}
      }

      for (let dep of argv.packages)
        parsed.dependencies[dep] = "**here should be version**"

      console.debug("Save file")
      writeFileSync(argv.config, JSON.stringify(parsed))
    }
  )
  .option("config", {
    type: "string",
    description: "path to file with configuration",
    default: "package.json",
  })
  .demandCommand(1).argv
