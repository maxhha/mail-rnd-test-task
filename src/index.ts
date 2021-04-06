#!/usr/bin/env node

import yargs from "yargs"
import chalk from "chalk"
import { hideBin } from "yargs/helpers"

import packagejson from "./middlewares/packagejson"

import install from "./commands/install"
import info from "./commands/info"
import { GlobalArguments } from "./global"

const parser = (yargs(hideBin(process.argv)) as yargs.Argv<GlobalArguments>)
  .option("config", {
    type: "string",
    description: "path to file with configuration",
    default: "package.json",
  })
  .middleware(packagejson)
  .command(info)
  .command(install)
  .strict()
  .demandCommand(1)

;(async () => {
  try {
    const argv = await parser.parse()
  } catch (err) {
    console.error(chalk.red(err.message))
  }
})()
