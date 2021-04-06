#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs"
import yargs, { config } from "yargs"
import { hideBin } from "yargs/helpers"

import install from "./commands/install"
import info from "./commands/info"

yargs(hideBin(process.argv))
  .option("config", {
    type: "string",
    description: "path to file with configuration",
    default: "package.json",
  })
  .command(info)
  .command(install)
  .demandCommand(1).argv
