import { readFileSync, writeFileSync } from "fs"
import { CommandModule } from "yargs"
import { GlobalArguments } from "./global"

const command: CommandModule<GlobalArguments, GlobalArguments> = {
  command: ["info", "*"],
  describe: "list info of a project",
  handler: (argv) => {
    console.debug(`Read data from config "${argv.config}"`)
    const data = readFileSync(argv.config, "utf8")

    console.debug("Parse json")
    const parsed = JSON.parse(data)

    console.log(`${parsed.name}@${parsed.version}`)
    console.log("dependencies:")

    for (let [dep, ver] of Object.entries(parsed.dependencies)) {
      console.log(`  ${dep}@${ver}`)
    }
    console.log()
  },
}

export default command
