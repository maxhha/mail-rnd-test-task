#!/usr/bin/env node

import yargs from "yargs"
import { hideBin } from "yargs/helpers"

yargs(hideBin(process.argv))
  .command<{ packages: Array<string> }>(
    ["install <packages...>", "i"],
    "add packages to your dependencies",
    () => {},
    (argv) => {
      console.info(argv)
    }
  )
  .option("config", {
    type: "string",
    description: "path to file with configuration",
    default: "package.json",
  })
  .demandCommand(1).argv
