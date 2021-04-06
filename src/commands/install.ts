import { readFileSync, writeFileSync } from "fs"
import { CommandModule } from "yargs"
import { GlobalArguments } from "./global"

interface Arguments extends GlobalArguments {
  packages: string[]
}

const command: CommandModule<GlobalArguments, Arguments> = {
  command: ["install <packages...>", "i"],
  describe: "add packages to your dependencies",
  handler: (argv: Arguments) => {
    console.debug(`Read data from config "${argv.config}"`)
    const data = readFileSync(argv.config, "utf8")

    console.debug("Parse json")
    const parsed = JSON.parse(data)

    console.debug("Add new dependencies")
    if (!parsed.dependencies) {
      parsed.dependencies = {}
    }

    for (let pack of argv.packages) {
      const m = pack.match(/^(.+)@(.+)$/)
      const dep = m?.[1] ?? pack
      const ver = m?.[2] ?? "**here should be version**"

      parsed.dependencies[dep] = ver
    }

    console.debug("Save file")
    writeFileSync(argv.config, JSON.stringify(parsed))
  },
}

export default command
